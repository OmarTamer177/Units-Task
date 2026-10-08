import { PostRepository } from "../../application/ports/postRepository.js";
import { Post } from "../../domain/post.js";

export class MongoPostRepository extends PostRepository {
    constructor(db) {
        super();
        this.collection = db.collection("posts");
    }

    async save(post) {
        await this.collection.insertOne({
            _id: post.id,
            title: post.title,
            content: post.content,
            createdAt: post.createdAt,
        });
    }

    async findById(id) {
        const doc = await this.collection.findOne({ _id: id });
        return doc ? this.toPost(doc) : null;
    }

    async findAll() {
        const docs = await this.collection.find().sort({ createdAt: -1 }).toArray();
        return docs.map((doc) => this.toPost(doc));
    }

    toPost(doc) {
        return new Post({
            id: doc._id,
            title: doc.title,
            content: doc.content,
            createdAt: doc.createdAt,
        });
    }
}