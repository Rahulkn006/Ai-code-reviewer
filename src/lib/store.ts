// In-memory store for analyses (replaces Prisma while database is unavailable)
import { randomUUID } from "crypto";

export interface StoredAnalysis {
  id: string;
  userId: string;
  userEmail: string;
  input: string;
  result: any;
  createdAt: Date;
}

const analyses: Map<string, StoredAnalysis> = new Map();

export const store = {
  createAnalysis(userEmail: string, input: string, result: any): StoredAnalysis {
    const analysis: StoredAnalysis = {
      id: randomUUID(),
      userId: userEmail,
      userEmail,
      input: input.length > 50000 ? input.slice(0, 50000) + "... [TRUNCATED]" : input,
      result,
      createdAt: new Date(),
    };
    analyses.set(analysis.id, analysis);
    return analysis;
  },

  getAnalysis(id: string): StoredAnalysis | undefined {
    return analyses.get(id);
  },

  getHistoryByEmail(email: string): StoredAnalysis[] {
    return Array.from(analyses.values())
      .filter((a) => a.userEmail === email)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  deleteAnalysis(id: string): boolean {
    return analyses.delete(id);
  },
};
