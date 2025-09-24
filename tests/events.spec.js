import { test, expect } from "@playwright/test";

const mockEvents = [
  {
    _id: "1",
    title: "Test Conference",
    category: "Conference",
    date: "2025-10-01T10:00:00Z",
    location: "Main Hall",
    rsvpCurrent: 5,
    rsvpTotal: 10,
  },
  {
    _id: "2",
    title: "Workshop on AI",
    category: "Workshop",
    date: "2025-11-01T09:00:00Z",
    location: "Room 101",
    rsvpCurrent: 2,
    rsvpTotal: 20,
  },
];

test.describe("EventsPage", () => {
  test.beforeEach(async ({ page }) => {
    // Mock the getAllEvents API call
    await page.route("**/getAllEvents*", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockEvents),
      });
    });

    await page.goto("/events");
  });

  test("renders events and allows searching", async ({ page }) => {
    // Expect header to be visible
    await expect(page.getByRole("heading", { name: "All Events" })).toBeVisible();

    // Events list should render
    const firstEvent = page.getByRole("heading", { level: 4 }).first();
    await expect(firstEvent).toBeVisible();

    // Search should filter events
    await page.getByPlaceholder("Search events...").fill("nonexistent");
    await expect(page.getByText("No events found.")).toBeVisible();

    // Clear search restores events
    await page.getByPlaceholder("Search events...").fill("");
    await expect(firstEvent).toBeVisible();
  });

  test("filters events by category", async ({ page }) => {
    const dropdown = page.locator("select");
    await dropdown.selectOption("All");
    await expect(page.getByRole("heading", { level: 4 }).first()).toBeVisible();

    // Change filter to "Conference"
    await dropdown.selectOption("Conference");
    await expect(page.getByText("Conference")).toBeVisible();
  });

  test("opens and closes the Add Event modal", async ({ page }) => {
    // Click "Add New Event"
    await page.getByRole("button", { name: /add new event/i }).click();

    // Expect modal to open
    await expect(page.getByTestId("overlay")).toBeVisible();

    // Click overlay should close it
    await page.getByTestId("overlay").click({ force: true });
    await expect(page.getByTestId("overlay")).toHaveCount(0);
  });

  test("navigates to event detail page", async ({ page }) => {
    // Click on "View" for the first event
    await page.getByRole("button", { name: "View" }).first().click();

    // Should navigate to /events/:id
    await expect(page).toHaveURL(/\/events\/1/);
  });

  test("cancel flow shows confirmation dialog", async ({ page }) => {
    // Click Cancel on the first event
    await page.getByRole("button", { name: "Cancel" }).first().click();

    // Confirmation dialog should appear
    await expect(page.getByRole("heading", { name: "Cancel Event?" })).toBeVisible();

    // "No, Go Back" closes the dialog
    await page.getByRole("button", { name: "No, Go Back" }).click();
    await expect(page.getByRole("heading", { name: "Cancel Event?" })).toHaveCount(0);
  });
});
