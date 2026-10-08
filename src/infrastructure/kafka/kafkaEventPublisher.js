import { EventPublisher } from "../../application/ports/eventPublisher.js";

export class KafkaEventPublisher extends EventPublisher {
    constructor(producer) {
        super();
        this.producer = producer;
    }

    async publish(topic, payload) {
        await this.producer.send({
            topic,
            messages: [{ key: payload.id, value: JSON.stringify(payload) }],
        });
    }
}