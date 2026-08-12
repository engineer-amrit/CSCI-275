import type { SupportTicket } from "@/types";

const MOCK_TICKETS: SupportTicket[] = [
  {
    id: "t1",
    subject: "Cannot change restaurant status",
    message:
      "I am unable to update my restaurant status from the vendor dashboard.",
    status: "pending",
    userId: "vendor-1",
    createdAt: "2026-07-26T08:00:00Z",
  },
  {
    id: "t2",
    subject: "Account recovery request",
    message: "I lost access to my account and need help recovering it.",
    status: "in_progress",
    userId: "user-5",
    assignedTo: "1",
    createdAt: "2026-07-25T14:20:00Z",
  },
  {
    id: "t3",
    subject: "Menu update not saving",
    message: "Changes to my food menu are not being saved.",
    status: "resolved",
    userId: "vendor-3",
    assignedTo: "1",
    createdAt: "2026-07-24T11:45:00Z",
  },
];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const supportService = {
  async getAll(): Promise<SupportTicket[]> {
    await delay(600);
    return MOCK_TICKETS;
  },

  async getById(id: string): Promise<SupportTicket | undefined> {
    await delay(400);
    return MOCK_TICKETS.find((t) => t.id === id);
  },

  async updateStatus(
    id: string,
    status: SupportTicket["status"],
  ): Promise<SupportTicket> {
    await delay(500);
    const ticket = MOCK_TICKETS.find((t) => t.id === id);
    if (!ticket) throw new Error("Ticket not found");
    ticket.status = status;
    return ticket;
  },
};
