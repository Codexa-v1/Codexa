import { render, screen, waitFor, fireEvent } from "@testing-library/react"
import { vi } from "vitest"
import FloorPlanModal from "@/components/FloorPlanModal"
import { useAuth0 } from "@auth0/auth0-react"

// Mock Auth0
vi.mock("@auth0/auth0-react", () => ({
  useAuth0: vi.fn(),
}))

// Mock FloorPlanUpload child
vi.mock("@/components/FloorPlanUpload", () => ({
  default: ({ onUploadSuccess }) => (
    <button onClick={onUploadSuccess} data-testid="mock-upload">
      Mock Upload
    </button>
  ),
}))

// Mock fetch globally
global.fetch = vi.fn()

// Helper: mock resolved fetch
const mockFetchResponse = (data, ok = true) =>
  Promise.resolve({
    ok,
    json: () => Promise.resolve(data),
  })

describe("FloorPlanModal", () => {
  const mockUser = { sub: "user123" }
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    useAuth0.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
    })
  })

  it("renders loading state initially", async () => {
    fetch.mockReturnValueOnce(new Promise(() => {})) // never resolves

    render(<FloorPlanModal eventId="event1" onClose={mockOnClose} />)

    expect(screen.getByText("Loading floor plans...")).toBeInTheDocument()
  })

  it("renders fetched floor plans correctly", async () => {
    const mockFiles = [
      { name: "VenueMap.pdf", type: "FloorPlan", url: "https://test.com/VenueMap.pdf" },
      { name: "HallLayout.jpg", type: "FloorPlan", url: "https://test.com/HallLayout.jpg" },
    ]

    fetch.mockResolvedValueOnce(mockFetchResponse(mockFiles))

    render(<FloorPlanModal eventId="event1" onClose={mockOnClose} />)

    await waitFor(() => expect(screen.getByText("VenueMap.pdf")).toBeInTheDocument())
    expect(screen.getByText("HallLayout.jpg")).toBeInTheDocument()
    expect(screen.getAllByRole("button", { name: /delete/i })).toHaveLength(2)
  })

  it("renders 'No floor plans available' if API returns empty", async () => {
    fetch.mockResolvedValueOnce(mockFetchResponse([]))

    render(<FloorPlanModal eventId="event1" onClose={mockOnClose} />)

    await waitFor(() =>
      expect(screen.getByText("No floor plans available for this event.")).toBeInTheDocument()
    )
  })

  it("calls fetch again when upload succeeds", async () => {
    fetch.mockResolvedValueOnce(mockFetchResponse([]))
    render(<FloorPlanModal eventId="event1" onClose={mockOnClose} />)

    // Wait for initial load
    await waitFor(() => screen.getByTestId("mock-upload"))

    // Trigger upload success (should re-fetch)
    fetch.mockResolvedValueOnce(mockFetchResponse([]))
    fireEvent.click(screen.getByTestId("mock-upload"))

    expect(fetch).toHaveBeenCalledTimes(2)
  })

  it("shows delete confirmation modal when delete is clicked", async () => {
    const mockFiles = [
      { name: "VenueMap.pdf", type: "FloorPlan", url: "https://test.com/VenueMap.pdf" },
    ]
    fetch.mockResolvedValueOnce(mockFetchResponse(mockFiles))

    render(<FloorPlanModal eventId="event1" onClose={mockOnClose} />)

    await waitFor(() => screen.getByText("VenueMap.pdf"))

    fireEvent.click(screen.getByTitle("Delete"))

    expect(
      screen.getByText(/Are you sure you want to delete\s*"VenueMap\.pdf"/i)
    ).toBeInTheDocument()

  })

  it("handles successful deletion and refetches floor plans", async () => {
    const mockFiles = [
      { name: "VenueMap.pdf", type: "FloorPlan", url: "https://test.com/VenueMap.pdf" },
    ]

    // First fetch (initial load)
    fetch.mockResolvedValueOnce(mockFetchResponse(mockFiles))

    render(<FloorPlanModal eventId="event1" onClose={mockOnClose} />)
    await waitFor(() => screen.getByText("VenueMap.pdf"))

    // Open delete confirm modal
    fireEvent.click(screen.getByTitle("Delete"))

    // Mock delete API response
    fetch
      .mockResolvedValueOnce({ ok: true }) // delete call
      .mockResolvedValueOnce(mockFetchResponse([])) // refetch

    fireEvent.click(screen.getByText("Delete"))

    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/azure/delete-user-document"),
        expect.objectContaining({ method: "POST" })
      )
    )
    expect(fetch).toHaveBeenCalledTimes(3) // initial + delete + refetch
  })

  it("calls onClose when close button is clicked", async () => {
    fetch.mockResolvedValueOnce(mockFetchResponse([]))
    render(<FloorPlanModal eventId="event1" onClose={mockOnClose} />)

    await waitFor(() => screen.getByRole("button", { name: "" })) // wait for render
    fireEvent.click(screen.getByRole("button", { name: "" }))
    expect(mockOnClose).toHaveBeenCalled()
  })
})
