import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EventPopup from "@/components/EventPopup";
import { vi } from "vitest";
import { useAuth0 } from "@auth0/auth0-react";

// Mock Auth0
vi.mock("@auth0/auth0-react", () => ({
  useAuth0: vi.fn(),
}));

// Mock env variable
vi.stubEnv("VITE_BACKEND_URL", "http://mock-backend");

describe("EventPopup", () => {
  const mockUser = { sub: "auth0|12345", name: "Test User" };
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    useAuth0.mockReturnValue({ user: mockUser });
  });

  it("renders form fields and heading", () => {
    render(<EventPopup onClose={mockOnClose} selectedDate={null} />);
    expect(screen.getByRole("heading", { name: /add new event/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/event title/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add new event/i })).toBeInTheDocument();
  });

  it("calls onClose when close icon clicked", () => {
    render(<EventPopup onClose={mockOnClose} selectedDate={null} />);
    fireEvent.click(screen.getByRole("img", { hidden: true })); // GrClose renders an <svg>
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("shows new category input when 'other' is selected", () => {
    render(<EventPopup onClose={mockOnClose} selectedDate={null} />);
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: "other" } });
    expect(screen.getByPlaceholderText(/add new category/i)).toBeInTheDocument();
  });

  it("submits successfully and shows success message", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
    );

    render(<EventPopup onClose={mockOnClose} selectedDate="2025-09-01" />);
    fireEvent.change(screen.getByLabelText(/event title/i), { target: { value: "My Event" } });
    fireEvent.click(screen.getByRole("button", { name: /add new event/i }));

    expect(await screen.findByText(/event created successfully!/i)).toBeInTheDocument();
    await waitFor(() => expect(mockOnClose).toHaveBeenCalled());
  });

  it("shows error message when fetch fails", async () => {
    global.fetch = vi.fn(() => Promise.resolve({ ok: false }));

    render(<EventPopup onClose={mockOnClose} selectedDate={null} />);
    fireEvent.click(screen.getByRole("button", { name: /add new event/i }));

    expect(await screen.findByText(/failed to create event/i)).toBeInTheDocument();
  });

  it("disables button and shows loading while submitting", async () => {
    let resolveFetch;
    global.fetch = vi.fn(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
    );

    render(<EventPopup onClose={mockOnClose} selectedDate={null} />);
    fireEvent.click(screen.getByRole("button", { name: /add new event/i }));

    expect(screen.getByRole("button", { name: /creating/i })).toBeDisabled();

    // finish fetch
    resolveFetch({ ok: true, json: () => Promise.resolve({}) });
    await waitFor(() =>
      expect(screen.queryByRole("button", { name: /creating/i })).not.toBeInTheDocument()
    );
  });
});

