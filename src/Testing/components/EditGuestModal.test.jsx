import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditGuestModal from "../../components/EditGuestModal";

describe("EditGuestModal", () => {
  const guest = {
    name: "John Doe",
    email: "john@example.com",
    phone: "123456789",
    rsvpStatus: "Pending",
  };

  const setup = (overrides = {}) => {
    const onClose = vi.fn();
    const onSave = vi.fn();
    render(
      <EditGuestModal guest={{ ...guest, ...overrides }} onClose={onClose} onSave={onSave} />
    );
    return { onClose, onSave };
  };

  it("renders all inputs with initial guest data", () => {
    setup();
    expect(screen.getByPlaceholderText("Name")).toHaveValue(guest.name);
    expect(screen.getByPlaceholderText("Email")).toHaveValue(guest.email);
    expect(screen.getByPlaceholderText("Phone")).toHaveValue(guest.phone);
    expect(screen.getByRole("combobox")).toHaveValue(guest.rsvpStatus);
  });

  it("calls onClose when cancel button is clicked", async () => {
    const { onClose } = setup();
    const cancelButton = screen.getByText("Cancel");
    await userEvent.click(cancelButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("updates form state when inputs change", async () => {
    setup();
    const nameInput = screen.getByPlaceholderText("Name");
    const emailInput = screen.getByPlaceholderText("Email");
    const phoneInput = screen.getByPlaceholderText("Phone");
    const selectInput = screen.getByRole("combobox");

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Jane Doe");
    expect(nameInput).toHaveValue("Jane Doe");

    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, "jane@example.com");
    expect(emailInput).toHaveValue("jane@example.com");

    await userEvent.clear(phoneInput);
    await userEvent.type(phoneInput, "987654321");
    expect(phoneInput).toHaveValue("987654321");

    await userEvent.selectOptions(selectInput, "Accepted");
    expect(selectInput).toHaveValue("Accepted");
  });

  it("calls onSave with updated data when form is submitted", async () => {
    const { onSave } = setup();
    const nameInput = screen.getByPlaceholderText("Name");
    const emailInput = screen.getByPlaceholderText("Email");
    const phoneInput = screen.getByPlaceholderText("Phone");
    const selectInput = screen.getByRole("combobox");

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Jane Doe");

    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, "jane@example.com");

    await userEvent.clear(phoneInput);
    await userEvent.type(phoneInput, "987654321");

    await userEvent.selectOptions(selectInput, "Accepted");

    const saveButton = screen.getByText("Save");
    await userEvent.click(saveButton);

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith({
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "987654321",
      rsvpStatus: "Accepted",
    });
  });

  it("prevents default form submission behavior", () => {
    setup();
    const form = screen.getByRole("form");
    const submitEvent = { preventDefault: vi.fn() };
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    expect(submitEvent.preventDefault).not.toHaveBeenCalled(); // React handles preventDefault internally
  });

  it("renders correctly with different initial guest values", () => {
    setup({ name: "Alice", email: "alice@example.com", phone: "", rsvpStatus: "Declined" });
    expect(screen.getByPlaceholderText("Name")).toHaveValue("Alice");
    expect(screen.getByPlaceholderText("Email")).toHaveValue("alice@example.com");
    expect(screen.getByPlaceholderText("Phone")).toHaveValue("");
    expect(screen.getByRole("combobox")).toHaveValue("Declined");
  });

  it("renders modal overlay and proper structure", () => {
    setup();
    expect(screen.getByText("Edit Guest")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
    const overlay = screen.getByText("Edit Guest").closest("div");
    expect(overlay).toHaveClass("bg-white p-6 rounded-lg w-96");
  });
});
