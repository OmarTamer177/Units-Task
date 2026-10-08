import { randomUUID } from "crypto";
import { Post } from "../domain/post.js";

export class CreatePost {
  constructor(postRepository, eventPublisher) {
    this.postRepository = postRepository;
    this.eventPublisher = eventPublisher;
  }

  async execute({ title, content }) {

    const post = new Post({
      id: randomUUID(),
      title,
      content,
      createdAt: new Date(),
    });

    await this.postRepository.save(post);
    await this.eventPublisher.publish("post.created", {
      id: post.id,
      title: post.title,
    });

    return post;
  }
}