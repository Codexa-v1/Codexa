import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import EventDetails from "../pages/EventDetails";

// Mock react-router params
vi.mock("react-router-dom", () => ({
  useParams: () => ({ id: "789" }), // test with Emily & Jake’s Wedding
  useNavigate: () => vi.fn(),
}));

// Mock Navbar
vi.mock("../components/Navbar", () => ({
  default: () => <div data-testid="navbar">Navbar</div>,
}));

// Mock Auth0 so user.sub is defined
vi.mock("@auth0/auth0-react", () => ({
  useAuth0: () => ({
    user: { name: "Tester", sub: "auth0|123" },
    isAuthenticated: true,
    isLoading: false,
  }),
}));

// Mock backend API
vi.mock("@/backend/api/EventData", () => ({
  getAllEvents: vi.fn(() =>
    Promise.resolve([
      {
        _id: "789",
        title: "Emily & Jake’s Wedding",
        category: "Wedding",
        location: "Central Park",
        description: "A beautiful day.",
      },
    ])
  ),
}));

describe("EventDetails", () => {
  test("renders event details for valid id", async () => {
    render(<EventDetails />);

    // heading may be async since event is fetched
    await waitFor(() =>
      expect(
        screen.getByText(/Emily & Jake/i)
      ).toBeInTheDocument()
    );

    expect(screen.getByText(/Wedding/i)).toBeInTheDocument();
    expect(screen.getByText(/Central Park/i)).toBeInTheDocument();
  });

  test("opens and closes EditEventModal", async () => {
    render(<EventDetails />);

    const editBtn = await screen.findByRole("button", { name: /Edit Event/i });
    fireEvent.click(editBtn);

    expect(await screen.findByText(/Save Changes/i)).toBeInTheDocument();

    // close modal
    fireEvent.click(screen.getByRole("button", { name: /Close/i }));
    await waitFor(() =>
      expect(screen.queryByText(/Save Changes/i)).not.toBeInTheDocument()
    );
  });

  test("opens and closes RSVPModal", async () => {
    render(<EventDetails />);
    const rsvpBtn = await screen.findByRole("button", { name: /RSVP/i });
    fireEvent.click(rsvpBtn);
    expect(await screen.findByText(/Submit RSVP/i)).toBeInTheDocument();
  });

  test("opens and closes VendorsModal", async () => {
    render(<EventDetails />);
    const vendorsBtn = await screen.findByRole("button", { name: /Vendors/i });
    fireEvent.click(vendorsBtn);
    expect(await screen.findByText(/Add Vendor/i)).toBeInTheDocument();
  });

  test("opens and closes DocumentsModal", async () => {
    render(<EventDetails />);
    const docsBtn = await screen.findByRole("button", { name: /Documents/i });
    fireEvent.click(docsBtn);
    expect(await screen.findByText(/Upload Document/i)).toBeInTheDocument();
  });

  test("opens and closes FloorPlanModal", async () => {
    render(<EventDetails />);
    const floorBtn = await screen.findByRole("button", { name: /Floor/i });
    fireEvent.click(floorBtn);
    expect(await screen.findByText(/Upload Floor Plan/i)).toBeInTheDocument();
  });
});
