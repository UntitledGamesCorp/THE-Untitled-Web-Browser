import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertHistorySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/history", async (req, res) => {
    const result = insertHistorySchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid history entry" });
    }
    
    const entry = await storage.addHistory(result.data);
    res.json(entry);
  });

  app.get("/api/history", async (_req, res) => {
    const history = await storage.getHistory();
    res.json(history);
  });

  return createServer(app);
}
