# Posts Service

A small backend service for creating and reading posts. It is built with Node.js and Express, stores data in MongoDB, and publishes an event to Apache Kafka every time a post is created. The code follows a simple DDD layout and is deployed on Google Cloud.

Live URL: http://35.208.205.56:8000

## Architecture

The project has four layers. Dependencies point inward: the API calls the application layer, the application layer depends only on the domain, and infrastructure plugs into the application layer from the side.

```
src/
  domain/            Post entity and its validation rules
  application/       Use cases: CreatePost, GetPost, ListPosts
    ports/           PostRepository and EventPublisher contracts
  infrastructure/    Implementations of those contracts
    mongo/           MongoPostRepository
    kafka/           KafkaEventPublisher and the post.created consumer
  api/               Express routes and controller
  server.js          Wires everything together
```

The application layer says what it needs (save a post, publish an event) as plain contracts, and infrastructure fulfils them. The API never touches Mongo or Kafka directly. Swapping either one means changing a single line in `server.js`.

## Event flow

When a post is created, the `CreatePost` use case saves it through the repository and then publishes a `post.created` event with the post's id and title. A Kafka consumer (group `post-processor`) receives the event and logs it. The consumer runs in the same process as the API to keep the project small. In a larger system it would be its own service.

## API

```
POST /posts        Create a post       -> 201
GET  /posts        List posts          -> 200 (newest first)
GET  /posts/:id    Get one post        -> 200, or 404 if not found
```

A post is created with a JSON body:

```json
{ "title": "Hello", "content": "My first post" }
```

If the title or content is missing, the API returns 400 with `{ "error": "..." }`.

Example:

```bash
curl -X POST http://35.208.205.56:8000/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello","content":"My first post"}'
```

A Postman collection is included in `postman_collection.json`.

## Running locally

You need Docker. From the project root:

```bash
docker compose up --build
```

This starts the API, MongoDB and Kafka. The API is available at http://localhost:8000. The connection settings are passed to the API as environment variables: `MONGO_URL` and `KAFKA_BROKER`.

## Deployment

The image is published on Docker Hub as `omartamer177/posts-api`. It runs on a Compute Engine e2-micro VM in us-central1 on Google Cloud.

The VM is created with a startup script that installs Docker, adds 2 GB of swap (the machine only has 1 GB of RAM), writes the compose file, then pulls and starts the three containers. A firewall rule opens TCP port 8000 to VMs with the `posts-api` network tag. Mongo and Kafka are only reachable inside the Docker network.
