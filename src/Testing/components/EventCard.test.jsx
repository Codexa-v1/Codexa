import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, beforeEach, expect } from "vitest";
import EventCard from "@/components/EventCard";
import { useNavigate } from "react-router-dom";
import { eventColors } from "@/utils/eventColors";
import dayjs from "dayjs";

// Mock useNavigate
vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

describe("EventCard", () => {
  const mockNavigate = vi.fn();
  const mockSetConfirmDeleteId = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  const sampleEvent = {
    _id: "event-123",
    category: "Conference",
    title: "Test Event",
    date: "2025-10-01",
    location: "New York",
  };

  it("renders event title, date, location and category label", () => {
    render(<EventCard event={sampleEvent} setConfirmDeleteId={mockSetConfirmDeleteId} />);

    const { bgColor, labelColor } = eventColors[sampleEvent.category] || eventColors.Other;

    // Check category label
    const label = screen.getByText(sampleEvent.category);
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass(labelColor);

    // Check title
    expect(screen.getByText(sampleEvent.title)).toBeInTheDocument();

    // Check formatted date
    const formattedDate = dayjs(sampleEvent.date).format("DD MMM YYYY");
    expect(screen.getByText(formattedDate)).toBeInTheDocument();

    // Check location
    expect(screen.getByText(sampleEvent.location)).toBeInTheDocument();

    // Check section background class
    const section = screen.getByText(sampleEvent.title).closest("section");
    expect(section).toHaveClass(bgColor);
  });

  it("calls navigate with correct path when 'View Event' is clicked", () => {
    render(<EventCard event={sampleEvent} setConfirmDeleteId={mockSetConfirmDeleteId} />);

    const viewButton = screen.getByText("View Event");
    fireEvent.click(viewButton);

    expect(mockNavigate).toHaveBeenCalledWith(`/events/${sampleEvent._id}`);
  });

  it("calls setConfirmDeleteId with event id when 'Cancel' is clicked", () => {
    render(<EventCard event={sampleEvent} setConfirmDeleteId={mockSetConfirmDeleteId} />);

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(mockSetConfirmDeleteId).toHaveBeenCalledWith(sampleEvent._id);
  });

  it("falls back to 'Other' colors if category not in eventColors", () => {
    const unknownEvent = { ...sampleEvent, category: "Unknown" };
    render(<EventCard event={unknownEvent} setConfirmDeleteId={mockSetConfirmDeleteId} />);

    const { bgColor, labelColor } = eventColors.Other;

    const label = screen.getByText("Unknown");
    expect(label).toHaveClass(labelColor);

    const section = screen.getByText(unknownEvent.title).closest("section");
    expect(section).toHaveClass(bgColor);
  });

  it("handles missing date gracefully", () => {
    const noDateEvent = { ...sampleEvent, date: null };
    render(<EventCard event={noDateEvent} setConfirmDeleteId={mockSetConfirmDeleteId} />);

    expect(screen.getByText(noDateEvent.title)).toBeInTheDocument();
    // Date should be empty string
    expect(screen.queryByText("01 Oct 2025")).not.toBeInTheDocument();
  });
});
