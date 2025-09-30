// server.test.js
import { describe, it, expect, vi, beforeAll } from "vitest";
import request from "supertest";

// Mock the DB connection so it doesn't call real MongoDB
vi.mock("../backend/mongodb.js", () => ({
  default: vi.fn(() => Promise.resolve()),
}));

// Mock all routers so we can test the server without real endpoints
vi.mock("../backend/routes/EventGuest.js", () => ({
  default: (req, res) => res.status(200).send("Guest route mocked"),
}));
vi.mock("../backend/routes/EventData.js", () => ({
  default: (req, res) => res.status(200).send("Event route mocked"),
}));
vi.mock("../backend/routes/EventExport.js", () => ({
  default: (req, res) => res.status(200).send("Export route mocked"),
}));
vi.mock("../backend/routes/EventVendor.js", () => ({
  default: (req, res) => res.status(200).send("Vendor route mocked"),
}));
vi.mock("../backend/routes/EventVenue.js", () => ({
  default: (req, res) => res.status(200).send("Venue route mocked"),
}));
vi.mock("../backend/routes/EventSchedule.js", () => ({
  default: (req, res) => res.status(200).send("Schedule route mocked"),
}));
vi.mock("../backend/routes/AzureRoutes.js", () => ({
  default: (req, res) => res.status(200).send("Azure route mocked"),
}));

// Mock process.exit to avoid test crashes
vi.spyOn(process, "exit").mockImplementation(() => {});

// Import server after mocks
import server from "../backend/server.js";

describe("Integration tests for server", () => {
  it("GET / should return running message", async () => {
    const res = await request(server).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Codexa backend is running.");
  });

  it("GET /api/guests should respond", async () => {
    const res = await request(server).get("/api/guests");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Guest route mocked");
  });

  it("GET /api/events should respond", async () => {
    const res = await request(server).get("/api/events");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Event route mocked");
  });

  it("GET /api/export should respond", async () => {
    const res = await request(server).get("/api/export");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Export route mocked");
  });

  it("GET /api/vendors should respond", async () => {
    const res = await request(server).get("/api/vendors");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Vendor route mocked");
  });

  it("GET /api/venues should respond", async () => {
    const res = await request(server).get("/api/venues");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Venue route mocked");
  });

  it("GET /api/schedules should respond", async () => {
    const res = await request(server).get("/api/schedules");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Schedule route mocked");
  });

  it("GET /api/azure should respond", async () => {
    const res = await request(server).get("/api/azure");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Azure route mocked");
  });
});