import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";
import "@testing-library/jest-dom";
import EventDetails from "../pages/EventDetails";

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

  it("renders event details for valid id", () => {
  renderWithRouter("/event/789");
  expect(screen.getByText("Emily & Jake’s Wedding")).toBeInTheDocument();
  expect(screen.getByText("Wedding")).toBeInTheDocument();
  expect(screen.getByText("Budget")).toBeInTheDocument();
  expect(screen.getByText(/R\s?120000/)).toBeInTheDocument();
});


  it("opens and closes EditEventModal", () => {
    renderWithRouter("/event/789");
    fireEvent.click(screen.getByText("Edit Event"));
    expect(screen.getByTestId("edit-modal")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Close"));
    expect(screen.queryByTestId("edit-modal")).not.toBeInTheDocument();
  });

  it("opens and closes RSVPModal", () => {
  renderWithRouter("/event/789");
  fireEvent.click(screen.getByRole("button", { name: /view rsvp list/i }));
  expect(screen.getByTestId("rsvp-modal")).toBeInTheDocument();
  fireEvent.click(screen.getByText("Close"));
  expect(screen.queryByTestId("rsvp-modal")).not.toBeInTheDocument();
});


  it("opens and closes VendorsModal", () => {
  renderWithRouter("/event/789");
  fireEvent.click(screen.getByRole("button", { name: /view vendors/i }));
  expect(screen.getByTestId("vendors-modal")).toBeInTheDocument();
  fireEvent.click(screen.getByText("Close"));
  expect(screen.queryByTestId("vendors-modal")).not.toBeInTheDocument();
});

it("opens and closes DocumentsModal", () => {
  renderWithRouter("/event/789");
  fireEvent.click(screen.getByRole("button", { name: /view documents/i }));
  expect(screen.getByTestId("documents-modal")).toBeInTheDocument();
  fireEvent.click(screen.getByText("Close"));
  expect(screen.queryByTestId("documents-modal")).not.toBeInTheDocument();
});


  it("opens and closes FloorPlanModal", () => {
    renderWithRouter("/event/789");
    fireEvent.click(screen.getByText("View Floor Plan"));
    expect(screen.getByTestId("floorplan-modal")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Close"));
    expect(screen.queryByTestId("floorplan-modal")).not.toBeInTheDocument();
  });

  // it("opens and closes DocumentsModal", () => {
  //   renderWithRouter("/event/789");
  //   fireEvent.click(screen.getByText(" View Documents"));
  //   expect(screen.getByTestId("documents-modal")).toBeInTheDocument();
  //   fireEvent.click(screen.getByText("Close"));
  //   expect(screen.queryByTestId("documents-modal")).not.toBeInTheDocument();
  // });
});
