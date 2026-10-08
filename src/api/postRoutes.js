import { Router } from "express";

export function postRoutes(controller) {
    const router = Router();
    router.post("/", controller.create);
    router.get("/", controller.list);
    router.get("/:id", controller.get);
    return router;
}