export class GetPost {
    constructor(postRepository) { this.postRepository = postRepository; }

    async execute(id) {
        const post = await this.postRepository.findById(id);
        if (!post) throw new Error("post not found");
        return post;
    }
}