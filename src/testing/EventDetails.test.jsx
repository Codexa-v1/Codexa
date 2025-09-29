import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";
import "@testing-library/jest-dom";
import EventDetails from "../pages/EventDetails";

// ---- single mock event ----
const mockEvent = {
  _id: "789",
  title: "Emily & Jake’s Wedding",
  category: "Wedding",
  status: "Confirmed",
  date: "2025-08-31",
  startTime: "15:00",
  endTime: "22:00",
  location: "Central Park",
  description: "A beautiful day.",
  rsvpTotal: 120,
  rsvpCurrent: 100,
  budget: 120000,
  vendors: [
    { _id: "v1", name: "DJ" },
    { _id: "v2", name: "Caterer" },
  ],
  documents: [{ _id: "d1", name: "Contract.pdf" }],
  floorPlanUrl: "floorplan.jpg",
};

// ---- global fetch mock ----
beforeAll(() => {
  global.fetch = vi.fn((url, options) => {
    if (url.includes("/api/events/all")) {
      let userId = "";
      try {
        userId = JSON.parse(options?.body || "{}").userId;
      } catch {}
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(userId === "test-user-id" ? [mockEvent] : []),
      });
    }
    if (url.includes("/api/event/789")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockEvent),
      });
    }
    if (url.includes("/api/guests/event/789") || url.includes("/api/eventguest/789")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { _id: "g1", name: "Alice" },
          { _id: "g2", name: "Bob" },
        ]),
      });
    }
    if (url.includes("/api/vendors/event/789") || url.includes("/api/eventvendor/789")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { _id: "v1", name: "DJ" },
          { _id: "v2", name: "Caterer" },
        ]),
      });
    }
    if (url.includes("/api/eventdocuments/789")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ _id: "d1", name: "Contract.pdf" }]),
      });
    }
    if (url.includes("/api/eventfloorplan/789")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ _id: "f1", name: "Main Hall" }]),
      });
    }
    return Promise.resolve({ ok: false, json: () => Promise.resolve({}) });
  });
});

// ---- Auth0 mocks ----
vi.mock("@auth0/auth0-react", () => ({
  useAuth0: () => ({ user: { sub: "test-user-id" } }),
}));
vi.mock("@/auth0/auth0-react", () => ({
  useAuth0: () => ({ user: { sub: "test-user-id" } }),
}));

// ---- child component mocks ----
vi.mock("../components/Navbar", () => ({
  default: () => <div data-testid="navbar">Navbar</div>,
}));
vi.mock("../components/EditEventModal", () => ({
  default: ({ onClose }) => (
    <div data-testid="edit-modal">
      EditEventModal <button onClick={onClose}>Close</button>
    </div>
  ),
}));
vi.mock("../components/RSVPModal", () => ({
  default: ({ onClose }) => (
    <div data-testid="rsvp-modal">
      RSVPModal <button onClick={onClose}>Close</button>
    </div>
  ),
}));
vi.mock("../components/VendorsModal", () => ({
  default: ({ onClose }) => (
    <div data-testid="vendors-modal">
      VendorsModal <button onClick={onClose}>Close</button>
    </div>
  ),
}));
vi.mock("../components/FloorPlanModal", () => ({
  default: ({ onClose }) => (
    <div data-testid="floorplan-modal">
      FloorPlanModal <button onClick={onClose}>Close</button>
    </div>
  ),
}));
vi.mock("../components/DocumentsModal", () => ({
  default: ({ onClose }) => (
    <div data-testid="documents-modal">
      DocumentsModal <button onClick={onClose}>Close</button>
    </div>
  ),
}));

// ---- helper ----
function renderWithRouter(initialPath = "/event/789") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/event/:id" element={<EventDetails />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("EventDetails", () => {
  it("renders 'Event Not Found' when id is invalid", () => {
    renderWithRouter("/event/999");
    expect(screen.getByText("Event Not Found")).toBeInTheDocument();
    expect(screen.getByText("Back to Events")).toBeInTheDocument();
  });

  it("renders event details for valid id", async () => {
    renderWithRouter("/event/789");

    expect(await screen.findByText("Emily & Jake’s Wedding")).toBeInTheDocument();
    expect(await screen.findByText("Wedding")).toBeInTheDocument();
    expect(await screen.findByText("Budget")).toBeInTheDocument();

    // handle duplicates
    const prices = await screen.findAllByText(/R\s?120000/);
    expect(prices.length).toBeGreaterThan(0);
  });

  it("opens and closes EditEventModal", async () => {
    renderWithRouter("/event/789");
    await screen.findByText("Emily & Jake’s Wedding");

    await act(async () => {
      fireEvent.click(screen.getByText("Edit Event"));
    });
    expect(screen.getByTestId("edit-modal")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Close"));
    expect(screen.queryByTestId("edit-modal")).not.toBeInTheDocument();
  });

  it("opens and closes RSVPModal", async () => {
    renderWithRouter("/event/789");
    await screen.findByText("Emily & Jake’s Wedding");

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /RSVP/i }));
    });
    expect(screen.getByTestId("rsvp-modal")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Close"));
    expect(screen.queryByTestId("rsvp-modal")).not.toBeInTheDocument();
  });

  it("opens and closes VendorsModal", async () => {
    renderWithRouter("/event/789");
    await screen.findByText("Emily & Jake’s Wedding");

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Vendors/i }));
    });
    expect(screen.getByTestId("vendors-modal")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Close"));
    expect(screen.queryByTestId("vendors-modal")).not.toBeInTheDocument();
  });

  it("opens and closes DocumentsModal", async () => {
    renderWithRouter("/event/789");
    await screen.findByText("Emily & Jake’s Wedding");

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Documents/i }));
    });
    expect(screen.getByTestId("documents-modal")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Close"));
    expect(screen.queryByTestId("documents-modal")).not.toBeInTheDocument();
  });

  it("opens and closes FloorPlanModal", async () => {
    renderWithRouter("/event/789");
    await screen.findByText("Emily & Jake’s Wedding");

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Floor/i }));
    });
    expect(screen.getByTestId("floorplan-modal")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Close"));
    expect(screen.queryByTestId("floorplan-modal")).not.toBeInTheDocument();
  });
});
