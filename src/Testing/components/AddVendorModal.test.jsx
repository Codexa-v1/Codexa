import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddVenuesModal from "@/components/AddVenuesModal";
import * as api from "@/backend/api/EventVenue";

vi.mock("@/backend/api/EventVenue");

describe("AddVenuesModal", () => {
  const eventId = "123";
  const onClose = vi.fn();
  const onVenuesUpdated = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders modal with empty form", () => {
    render(<AddVenuesModal eventId={eventId} onClose={onClose} onVenuesUpdated={onVenuesUpdated} />);

    expect(screen.getByText("Add New Venue(s)")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Venue Name")).toHaveValue("");
    expect(screen.getByPlaceholderText("Venue Address")).toHaveValue("");
    expect(screen.getByPlaceholderText("Email")).toHaveValue("");
    expect(screen.getByPlaceholderText("Phone")).toHaveValue("");
    expect(screen.getByPlaceholderText("Capacity")).toHaveValue("");
    expect(screen.getByText("Venue Status")).toBeInTheDocument();
  });

  test("updates form values when inputs change", () => {
    render(<AddVenuesModal eventId={eventId} onClose={onClose} onVenuesUpdated={onVenuesUpdated} />);

    const nameInput = screen.getByPlaceholderText("Venue Name");
    const addressInput = screen.getByPlaceholderText("Venue Address");
    const emailInput = screen.getByPlaceholderText("Email");
    const phoneInput = screen.getByPlaceholderText("Phone");
    const capacityInput = screen.getByPlaceholderText("Capacity");
    const statusSelect = screen.getByRole("combobox");
    const imageInput = screen.getByPlaceholderText("Venue Image URL (optional)");

    fireEvent.change(nameInput, { target: { value: "Venue 1" } });
    fireEvent.change(addressInput, { target: { value: "123 Street" } });
    fireEvent.change(emailInput, { target: { value: "venue@email.com" } });
    fireEvent.change(phoneInput, { target: { value: "0123456789" } });
    fireEvent.change(capacityInput, { target: { value: "100" } });
    fireEvent.change(statusSelect, { target: { value: "Pending" } });
    fireEvent.change(imageInput, { target: { value: "http://image.com" } });

    expect(nameInput).toHaveValue("Venue 1");
    expect(addressInput).toHaveValue("123 Street");
    expect(emailInput).toHaveValue("venue@email.com");
    expect(phoneInput).toHaveValue("0123456789");
    expect(capacityInput).toHaveValue("100");
    expect(statusSelect).toHaveValue("Pending");
    expect(imageInput).toHaveValue("http://image.com");
  });

  test("adds a venue to the preview list", () => {
    render(<AddVenuesModal eventId={eventId} onClose={onClose} onVenuesUpdated={onVenuesUpdated} />);

    const nameInput = screen.getByPlaceholderText("Venue Name");
    const addressInput = screen.getByPlaceholderText("Venue Address");
    const emailInput = screen.getByPlaceholderText("Email");
    const phoneInput = screen.getByPlaceholderText("Phone");
    const capacityInput = screen.getByPlaceholderText("Capacity");
    const statusSelect = screen.getByRole("combobox");
    const addButton = screen.getByText("+ Add Venue");

    fireEvent.change(nameInput, { target: { value: "Venue 1" } });
    fireEvent.change(addressInput, { target: { value: "123 Street" } });
    fireEvent.change(emailInput, { target: { value: "venue@email.com" } });
    fireEvent.change(phoneInput, { target: { value: "0123456789" } });
    fireEvent.change(capacityInput, { target: { value: "100" } });
    fireEvent.change(statusSelect, { target: { value: "Pending" } });

    fireEvent.click(addButton);

    expect(screen.getByText("Venue 1")).toBeInTheDocument();
    expect(screen.getByText("123 Street")).toBeInTheDocument();
    expect(screen.getByText("venue@email.com")).toBeInTheDocument();
    expect(screen.getByText("0123456789")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  test("calls API and closes modal when saving all venues", async () => {
    api.addVenue.mockResolvedValue({});
    api.getVenues.mockResolvedValue([{ venueName: "Venue 1" }]);

    render(<AddVenuesModal eventId={eventId} onClose={onClose} onVenuesUpdated={onVenuesUpdated} />);

    const nameInput = screen.getByPlaceholderText("Venue Name");
    const addressInput = screen.getByPlaceholderText("Venue Address");
    const emailInput = screen.getByPlaceholderText("Email");
    const phoneInput = screen.getByPlaceholderText("Phone");
    const capacityInput = screen.getByPlaceholderText("Capacity");
    const statusSelect = screen.getByRole("combobox");
    const addButton = screen.getByText("+ Add Venue");

    fireEvent.change(nameInput, { target: { value: "Venue 1" } });
    fireEvent.change(addressInput, { target: { value: "123 Street" } });
    fireEvent.change(emailInput, { target: { value: "venue@email.com" } });
    fireEvent.change(phoneInput, { target: { value: "0123456789" } });
    fireEvent.change(capacityInput, { target: { value: "100" } });
    fireEvent.change(statusSelect, { target: { value: "Pending" } });

    fireEvent.click(addButton);

    const saveAllButton = screen.getByText("Save All Venues");
    fireEvent.click(saveAllButton);

    await waitFor(() => {
      expect(api.addVenue).toHaveBeenCalledTimes(1);
      expect(api.addVenue).toHaveBeenCalledWith(eventId, expect.objectContaining({ venueName: "Venue 1" }));
      expect(api.getVenues).toHaveBeenCalledWith(eventId);
      expect(onVenuesUpdated).toHaveBeenCalledWith([{ venueName: "Venue 1" }]);
      expect(onClose).toHaveBeenCalled();
    });
  });

  test("displays error if API fails", async () => {
    api.addVenue.mockRejectedValue(new Error("API failed"));

    render(<AddVenuesModal eventId={eventId} onClose={onClose} onVenuesUpdated={onVenuesUpdated} />);

    const nameInput = screen.getByPlaceholderText("Venue Name");
    const addressInput = screen.getByPlaceholderText("Venue Address");
    const emailInput = screen.getByPlaceholderText("Email");
    const phoneInput = screen.getByPlaceholderText("Phone");
    const capacityInput = screen.getByPlaceholderText("Capacity");
    const statusSelect = screen.getByRole("combobox");
    const addButton = screen.getByText("+ Add Venue");

    fireEvent.change(nameInput, { target: { value: "Venue 1" } });
    fireEvent.change(addressInput, { target: { value: "123 Street" } });
    fireEvent.change(emailInput, { target: { value: "venue@email.com" } });
    fireEvent.change(phoneInput, { target: { value: "0123456789" } });
    fireEvent.change(capacityInput, { target: { value: "100" } });
    fireEvent.change(statusSelect, { target: { value: "Pending" } });

    fireEvent.click(addButton);

    const saveAllButton = screen.getByText("Save All Venues");
    fireEvent.click(saveAllButton);

    await waitFor(() => {
      expect(screen.getByText("API failed")).toBeInTheDocument();
    });
  });
});
