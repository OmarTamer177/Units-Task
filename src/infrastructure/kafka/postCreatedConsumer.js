export async function startPostCreatedConsumer(kafka) {
    const consumer = kafka.consumer({ groupId: "post-processor" });
    await consumer.connect();
    await consumer.subscribe({ topic: "post.created", fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ message }) => {
            const event = JSON.parse(message.value.toString());
            console.log("[consumer] post.created received:", event);
        },
    });
}