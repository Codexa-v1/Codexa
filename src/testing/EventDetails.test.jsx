import { MemoryRouter, Routes, Route } from "react-router-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import "@testing-library/jest-dom";
import EventDetails from "../pages/EventDetails";

// ---- mock backend API ----
vi.mock("@/backend/api/EventData", () => ({
  getAllEvents: vi.fn(() =>
    Promise.resolve([
      {
        _id: "789",
        title: "Emily & Jake’s Wedding",
        category: "Wedding",
        location: "Central Park",
        budget: 120000,
        status: "Upcoming",
        date: "2024-07-01T15:00:00Z",
        startTime: "15:00",
        endTime: "22:00",
        description: "A beautiful wedding event.",
        rsvpTotal: 100,
        rsvpCurrent: 80,
        floorPlanUrl: "",
      },
      {
        _id: "456",
        title: "Business Conference",
        category: "Conference",
        location: "Grand Hotel",
        budget: 50000,
        status: "Upcoming",
        date: "2024-08-10T09:00:00Z",
        startTime: "09:00",
        endTime: "17:00",
        description: "Annual business conference.",
        rsvpTotal: 200,
        rsvpCurrent: 150,
        floorPlanUrl: "",
      },
      {
        _id: "123",
        title: "John’s 30th Birthday",
        category: "Birthday",
        location: "Home",
        budget: 10000,
        status: "Upcoming",
        date: "2024-09-05T18:00:00Z",
        startTime: "18:00",
        endTime: "23:00",
        description: "John's birthday party.",
        rsvpTotal: 30,
        rsvpCurrent: 25,
        floorPlanUrl: "",
      },
    ])
  ),
}));

// ---- mocks for child components ----
vi.mock("../components/Navbar", () => ({
  default: () => <div data-testid="navbar">Navbar</div>,
}));
vi.mock("../components/EditEventModal", () => ({
  default: ({ onClose }) => (
    <div data-testid="edit-modal">
      EditEventModal
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));
vi.mock("../components/RSVPModal", () => ({
  default: ({ onClose }) => (
    <div data-testid="rsvp-modal">
      RSVPModal
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));
vi.mock("../components/VendorsModal", () => ({
  default: ({ onClose }) => (
    <div data-testid="vendors-modal">
      VendorsModal
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));
vi.mock("../components/FloorPlanModal", () => ({
  default: ({ onClose }) => (
    <div data-testid="floorplan-modal">
      FloorPlanModal
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));
vi.mock("../components/DocumentsModal", () => ({
  default: ({ onClose }) => (
    <div data-testid="documents-modal">
      DocumentsModal
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

// helper: render with router param
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
    // Flexible matcher so encoding differences in apostrophes don’t break tests
    expect(
      screen.getByText((content) => content.includes("Emily") && content.includes("Jake"))
    ).toBeInTheDocument();
    expect(screen.getByText(/Wedding/i)).toBeInTheDocument();
    expect(screen.getByText(/Budget/i)).toBeInTheDocument();
    expect(screen.getByText(/R\s?\d+/)).toBeInTheDocument();
  });

  it("opens and closes EditEventModal", () => {
    renderWithRouter("/event/789");
    fireEvent.click(screen.getByText(/Edit Event/i));
    expect(screen.getByTestId("edit-modal")).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Close/i));
    expect(screen.queryByTestId("edit-modal")).not.toBeInTheDocument();
  });

  it("opens and closes RSVPModal", () => {
    renderWithRouter("/event/789");
    fireEvent.click(screen.getByText(/RSVP/i));
    expect(screen.getByTestId("rsvp-modal")).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Close/i));
    expect(screen.queryByTestId("rsvp-modal")).not.toBeInTheDocument();
  });

  it("opens and closes VendorsModal", () => {
    renderWithRouter("/event/789");
    fireEvent.click(screen.getByText(/Vendors/i));
    expect(screen.getByTestId("vendors-modal")).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Close/i));
    expect(screen.queryByTestId("vendors-modal")).not.toBeInTheDocument();
  });

  it("opens and closes DocumentsModal", () => {
    renderWithRouter("/event/789");
    fireEvent.click(screen.getByText(/Documents/i));
    expect(screen.getByTestId("documents-modal")).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Close/i));
    expect(screen.queryByTestId("documents-modal")).not.toBeInTheDocument();
  });

  it("opens and closes FloorPlanModal", () => {
    renderWithRouter("/event/789");
    fireEvent.click(screen.getByText(/Floor/i));
    expect(screen.getByTestId("floorplan-modal")).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Close/i));
    expect(screen.queryByTestId("floorplan-modal")).not.toBeInTheDocument();
  });
});
