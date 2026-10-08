import express from "express";
import { CreatePost } from "./application/createPost.js";
import { GetPost } from "./application/getPost.js";
import { ListPosts } from "./application/listPosts.js";
import { PostController } from "./api/postController.js";
import { postRoutes } from "./api/postRoutes.js";
import { MongoClient } from "mongodb";
import { MongoPostRepository } from "./infrastructure/mongo/mongoPostRepository.js";

import { Kafka } from "kafkajs";
import { KafkaEventPublisher } from "./infrastructure/kafka/kafkaEventPublisher.js";
import { startPostCreatedConsumer } from "./infrastructure/kafka/postCreatedConsumer.js";

const kafka = new Kafka({
    clientId: "posts-api",
    brokers: [process.env.KAFKA_BROKER ?? "localhost:9092"],
});

const admin = kafka.admin();
await admin.connect();
await admin.createTopics({ topics: [{ topic: "post.created" }], waitForLeaders: true });
await admin.disconnect();

const producer = kafka.producer();
await producer.connect();

await startPostCreatedConsumer(kafka);

const publisher = new KafkaEventPublisher(producer);

const mongoUrl = process.env.MONGO_URL ?? "mongodb://localhost:27017";
const client = new MongoClient(mongoUrl);
await client.connect();

const repo = new MongoPostRepository(client.db("postsdb"));

const controller = new PostController({
    createPost: new CreatePost(repo, publisher),
    getPost: new GetPost(repo),
    listPosts: new ListPosts(repo),
});

const app = express();
app.use(express.json());
app.use("/posts", postRoutes(controller));


app.listen(8000, (err) => {
    if (err) throw err;
    console.log("listening on 8000");
});