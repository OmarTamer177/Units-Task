import { EventPublisher } from "../../application/ports/eventPublisher.js";

export class ConsoleEventPublisher extends EventPublisher {
    async publish(topic, payload) {
        console.log(`[event] ${topic}`, payload);
    }
}