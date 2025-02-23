import { history, type History, type InsertHistory } from "@shared/schema";

export interface IStorage {
  addHistory(entry: InsertHistory): Promise<History>;
  getHistory(): Promise<History[]>;
}

export class MemStorage implements IStorage {
  private history: Map<number, History>;
  private currentId: number;

  constructor() {
    this.history = new Map();
    this.currentId = 1;
  }

  async addHistory(entry: InsertHistory): Promise<History> {
    const id = this.currentId++;
    const historyEntry: History = {
      ...entry,
      id,
      visitedAt: new Date()
    };
    this.history.set(id, historyEntry);
    return historyEntry;
  }

  async getHistory(): Promise<History[]> {
    return Array.from(this.history.values())
      .sort((a, b) => b.visitedAt.getTime() - a.visitedAt.getTime());
  }
}

export const storage = new MemStorage();
