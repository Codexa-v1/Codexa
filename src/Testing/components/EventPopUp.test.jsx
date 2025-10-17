/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import EventPopup from "@/components/EventPopup"
import { useAuth0 } from "@auth0/auth0-react"
import { createEvent } from "@/backend/api/EventData.js"

// === MOCKS ===
vi.mock("@auth0/auth0-react", () => ({
  useAuth0: vi.fn(),
}))

vi.mock("@/backend/api/EventData.js", () => ({
  createEvent: vi.fn(),
}))

// === MOCK UTILS ===
vi.mock("@/utils/eventColors", () => ({
  eventColors: { conference: "#123456", workshop: "#abcdef" },
}))

// === TEST SUITE ===
describe("EventPopup", () => {
  const onClose = vi.fn()
  const mockUser = { sub: "user123" }

  beforeEach(() => {
    useAuth0.mockReturnValue({ user: mockUser })
    vi.clearAllMocks()
  })

  // ---------- 1. Render Test ----------
  it("renders all key form fields", () => {
    render(<EventPopup onClose={onClose} />)

    expect(screen.getByText("Add New Event")).toBeInTheDocument()
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Event Title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Location/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Capacity/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Budget/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Description of Event/i)).toBeInTheDocument()
  })

  // ---------- 2. Validation Tests ----------
  it("shows error when end date is missing", async () => {
    render(<EventPopup onClose={onClose} />)

    const addBtn = screen.getByRole("button", { name: /Add New Event/i })
    fireEvent.click(addBtn)

    expect(await screen.findByText(/End date is required/i)).toBeInTheDocument()
  })

  it("shows error if end date is before start date", async () => {
    render(<EventPopup onClose={onClose} />)

    const startDateInput = screen.getByLabelText(/Start Date/i)
    const endDateInput = screen.getByLabelText(/End Date/i)
    const addBtn = screen.getByRole("button", { name: /Add New Event/i })

    fireEvent.change(startDateInput, { target: { value: "2025-12-10" } })
    fireEvent.change(endDateInput, { target: { value: "2025-12-09" } })
    fireEvent.click(addBtn)

    expect(await screen.findByText(/End date cannot be before start date/i)).toBeInTheDocument()
  })

  it("shows error if end time <= start time on same day", async () => {
    render(<EventPopup onClose={onClose} />)

    fireEvent.change(screen.getByLabelText(/Start Date/i), { target: { value: "2025-12-10" } })
    fireEvent.change(screen.getByLabelText(/End Date/i), { target: { value: "2025-12-10" } })
    fireEvent.change(screen.getByLabelText(/Start Time/i), { target: { value: "10:00" } })
    fireEvent.change(screen.getByLabelText(/End Time/i), { target: { value: "09:00" } })

    fireEvent.click(screen.getByRole("button", { name: /Add New Event/i }))

    expect(await screen.findByText(/End time must be after start time/i)).toBeInTheDocument()
  })

  // ---------- 3. Success Test ----------
  it("creates event successfully and calls onClose after delay", async () => {
    createEvent.mockResolvedValueOnce({ message: "Created" })
    vi.useFakeTimers()

    render(<EventPopup onClose={onClose} />)

    fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: "conference" } })
    fireEvent.change(screen.getByLabelText(/Event Title/i), { target: { value: "My Event" } })
    fireEvent.change(screen.getByLabelText(/Start Date/i), { target: { value: "2025-12-10" } })
    fireEvent.change(screen.getByLabelText(/End Date/i), { target: { value: "2025-12-11" } })
    fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: "Wits Campus" } })
    fireEvent.change(screen.getByLabelText(/Budget/i), { target: { value: "5000" } })
    fireEvent.change(screen.getByLabelText(/Capacity/i), { target: { value: "100" } })
    fireEvent.change(screen.getByLabelText(/Description of Event/i), { target: { value: "Annual event" } })

    fireEvent.click(screen.getByRole("button", { name: /Add New Event/i }))

    expect(createEvent).toHaveBeenCalled()

    await waitFor(() => {
      expect(screen.getByText(/Event Created Successfully!/i)).toBeInTheDocument()
    })

    vi.advanceTimersByTime(2000)
    await waitFor(() => expect(onClose).toHaveBeenCalled())

    vi.useRealTimers()
  })

  // ---------- 4. Error Handling ----------
  it("displays API error message when createEvent fails", async () => {
    createEvent.mockRejectedValueOnce(new Error("Server down"))

    render(<EventPopup onClose={onClose} />)

    fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: "conference" } })
    fireEvent.change(screen.getByLabelText(/Event Title/i), { target: { value: "My Event" } })
    fireEvent.change(screen.getByLabelText(/Start Date/i), { target: { value: "2025-12-10" } })
    fireEvent.change(screen.getByLabelText(/End Date/i), { target: { value: "2025-12-11" } })
    fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: "Wits Campus" } })
    fireEvent.change(screen.getByLabelText(/Budget/i), { target: { value: "5000" } })
    fireEvent.change(screen.getByLabelText(/Capacity/i), { target: { value: "100" } })
    fireEvent.change(screen.getByLabelText(/Description of Event/i), { target: { value: "Annual event" } })

    fireEvent.click(screen.getByRole("button", { name: /Add New Event/i }))

    expect(await screen.findByText(/Server down/i)).toBeInTheDocument()
  })

  // ---------- 5. Close Button ----------
  it("calls onClose when close button is clicked", () => {
    render(<EventPopup onClose={onClose} />)
    fireEvent.click(screen.getByRole("button", { name: "" })) // close icon has no text
    expect(onClose).toHaveBeenCalled()
  })
})
