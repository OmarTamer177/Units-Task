export class PostController {
    constructor({ createPost, getPost, listPosts }) {
        this.createPost = createPost;
        this.getPost = getPost;
        this.listPosts = listPosts;
    }

    create = async (req, res) => {
        try {
            const post = await this.createPost.execute(req.body);
            res.status(201).json(post);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    };

    get = async (req, res) => {
        try {
            const post = await this.getPost.execute(req.params.id);
            res.json(post);
        } catch (err) {
            res.status(404).json({ error: err.message });
        }
    };

    list = async (req, res) => {
        const posts = await this.listPosts.execute();
        res.json(posts);
    };
}