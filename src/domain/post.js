export class Post {
    constructor({ id, title, content, createdAt }) {
        if (!title?.trim()) throw new Error("title is required");
        if (!content?.trim()) throw new Error("content is required");
        this.id = id;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
    }
}