import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import FloorPlanModal from "../../components/FloorPlanModal";
import { useAuth0 } from "@auth0/auth0-react";

// ------------------ MOCKS ------------------

// Mock Auth0
vi.mock("@auth0/auth0-react", () => ({
  useAuth0: vi.fn(),
}));

vi.mock("@/components/FloorPlanUpload", () => {
  return {
    default: (props) => (
      <div data-testid="floorplan-upload-mock">
        FloorPlanUpload Mock
        <button onClick={() => props.onUploadSuccess?.()}>Mock Upload</button>
      </div>
    ),
  };
});


describe("FloorPlanModal", () => {
  const user = { sub: "auth0|123" };
  const eventId = "event-1";
  const onClose = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    global.fetch = vi.fn();
    useAuth0.mockReturnValue({
      user,
      isAuthenticated: true,
    });
  });

  it("renders loading state initially", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<FloorPlanModal eventId={eventId} onClose={onClose} />);
    expect(screen.getByText(/Loading floor plans/i)).toBeInTheDocument();
    await waitFor(() =>
      expect(
        screen.getByText(/No floor plans available/i)
      ).toBeInTheDocument()
    );
  });

  it("renders floor plan PDFs and images correctly", async () => {
    const mockData = [
      { name: "plan1.pdf", type: "FloorPlan", url: "http://example.com/plan1.pdf" },
      { name: "image1.png", type: "FloorPlan", url: "http://example.com/image1.png" },
    ];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    render(<FloorPlanModal eventId={eventId} onClose={onClose} />);

    await waitFor(() => {
      expect(screen.getByText("plan1.pdf")).toBeInTheDocument();
      expect(screen.getByText("View / Download PDF")).toBeInTheDocument();
      expect(screen.getByAltText("image1.png")).toBeInTheDocument();
    });
  });

  it("renders no floor plans message if none exist", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<FloorPlanModal eventId={eventId} onClose={onClose} />);
    await waitFor(() =>
      expect(
        screen.getByText(/No floor plans available/i)
      ).toBeInTheDocument()
    );
  });

  it("calls onClose when close button is clicked", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<FloorPlanModal eventId={eventId} onClose={onClose} />);
    fireEvent.click(screen.getByText("×"));
    expect(onClose).toHaveBeenCalled();
  });

  it("deletes a floor plan after confirmation", async () => {
    const floorPlan = { name: "plan1.pdf", type: "FloorPlan", url: "url" };
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [floorPlan] }) // initial fetch
      .mockResolvedValueOnce({ ok: true }); // delete fetch

    vi.spyOn(window, "confirm").mockReturnValueOnce(true);

    render(<FloorPlanModal eventId={eventId} onClose={onClose} />);
    await waitFor(() => screen.getByText("plan1.pdf"));

    const deleteButton = screen.getAllByRole("button").find((b) =>
      b.closest("div")?.textContent.includes(floorPlan.name)
    );
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });

  it("does not delete floor plan if user cancels confirmation", async () => {
    const floorPlan = { name: "plan1.pdf", type: "FloorPlan", url: "url" };
    fetch.mockResolvedValueOnce({ ok: true, json: async () => [floorPlan] });

    vi.spyOn(window, "confirm").mockReturnValueOnce(false);

    render(<FloorPlanModal eventId={eventId} onClose={onClose} />);
    await waitFor(() => screen.getByText("plan1.pdf"));

    const deleteButton = screen.getAllByRole("button").find((b) =>
      b.closest("div")?.textContent.includes(floorPlan.name)
    );
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1); // only initial fetch
    });
  });

  it("handles fetch errors gracefully", async () => {
    fetch.mockRejectedValueOnce(new Error("Fetch failed"));
    render(<FloorPlanModal eventId={eventId} onClose={onClose} />);
    await waitFor(() =>
      expect(
        screen.getByText(/No floor plans available/i)
      ).toBeInTheDocument()
    );
  });

  it("re-fetches floor plans after upload", async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => [] });

    render(<FloorPlanModal eventId={eventId} onClose={onClose} />);
    const uploadButton = screen.getByText("Simulate Upload");
    fireEvent.click(uploadButton);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
  });
});
