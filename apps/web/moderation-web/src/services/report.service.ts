import type { Report } from "@/types";

const MOCK_REPORTS: Report[] = [
  {
    id: "r1",
    targetType: "restaurant",
    targetId: "rest-1",
    reason: "Fake restaurant listing",
    status: "pending",
    reporterId: "user-1",
    createdAt: "2026-07-25T10:00:00Z",
  },
  {
    id: "r2",
    targetType: "review",
    targetId: "rev-5",
    reason: "Spam review",
    status: "under_review",
    reporterId: "user-3",
    createdAt: "2026-07-24T15:30:00Z",
  },
  {
    id: "r3",
    targetType: "media",
    targetId: "med-12",
    reason: "Inappropriate image",
    status: "resolved",
    reporterId: "user-2",
    createdAt: "2026-07-23T09:15:00Z",
  },
];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const reportService = {
  async getAll(): Promise<Report[]> {
    await delay(600);
    return MOCK_REPORTS;
  },

  async getById(id: string): Promise<Report | undefined> {
    await delay(400);
    return MOCK_REPORTS.find((r) => r.id === id);
  },

  async updateStatus(id: string, status: Report["status"]): Promise<Report> {
    await delay(500);
    const report = MOCK_REPORTS.find((r) => r.id === id);
    if (!report) throw new Error("Report not found");
    report.status = status;
    return report;
  },
};
