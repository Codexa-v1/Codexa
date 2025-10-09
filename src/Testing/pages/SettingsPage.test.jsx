import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SettingsPage from "../../pages/SettingsPage";

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

// Mock Auth0
const mockUser = {
  sub: "auth0|123456",
  name: "Test User",
  email: "test@example.com",
  picture: "https://example.com/profile.jpg",
};
const mockSocialUser = {
  sub: "google-oauth2|abcdef",
  name: "Social User",
  email: "social@example.com",
  picture: "https://example.com/social.jpg",
};
let isAuthenticated = true;
let isLoading = false;
let user = mockUser;

vi.mock("@auth0/auth0-react", () => ({
  useAuth0: () => ({
    user,
    isAuthenticated,
    isLoading,
  }),
}));

// Mock updateUserProfile API
vi.mock("@/backend/api/UserProfile", () => ({
  updateUserProfile: vi.fn(),
}));

// Mock Navbar
vi.mock("@/components/Navbar", () => ({
  __esModule: true,
  default: () => <nav data-testid="navbar">Navbar</nav>,
}));

describe("SettingsPage", () => {
  beforeEach(() => {
    isAuthenticated = true;
    isLoading = false;
    user = mockUser;
    mockNavigate.mockReset();
  });

  it("renders loading state when auth is loading", () => {
    isLoading = true;
    render(<SettingsPage />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    expect(screen.getByTestId("navbar")).not.toBeInTheDocument();
  });

  it("redirects to home if not authenticated", () => {
    isAuthenticated = false;
    render(<SettingsPage />);
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("renders Navbar and page header", () => {
    render(<SettingsPage />);
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByText(/Account Settings/i)).toBeInTheDocument();
    expect(screen.getByText(/Manage your profile/i)).toBeInTheDocument();
  });

  it("renders user profile info", () => {
    render(<SettingsPage />);
    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
    expect(screen.getByAltText(/Profile/i)).toHaveAttribute("src", mockUser.picture);
  });

  it("renders form fields with correct values", () => {
    render(<SettingsPage />);
    expect(screen.getByLabelText(/Full Name/i)).toHaveValue(mockUser.name);
    expect(screen.getByLabelText(/Email Address/i)).toHaveValue(mockUser.email);
    expect(screen.getByLabelText(/Profile Picture URL/i)).toHaveValue(mockUser.picture);
  });

  it("disables email field and shows info", () => {
    render(<SettingsPage />);
    expect(screen.getByLabelText(/Email Address/i)).toBeDisabled();
    expect(screen.getByText(/Email address cannot be changed/i)).toBeInTheDocument();
  });

  it("allows editing name and picture fields", async () => {
    render(<SettingsPage />);
    const nameInput = screen.getByLabelText(/Full Name/i);
    const pictureInput = screen.getByLabelText(/Profile Picture URL/i);
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "New Name");
    expect(nameInput).toHaveValue("New Name");
    await userEvent.clear(pictureInput);
    await userEvent.type(pictureInput, "https://newpic.com/pic.jpg");
    expect(pictureInput).toHaveValue("https://newpic.com/pic.jpg");
  });

  it("shows social login warning and disables editing for social accounts", () => {
    user = mockSocialUser;
    render(<SettingsPage />);
    expect(screen.getByText(/Social Login Account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Full Name/i)).toBeDisabled();
    expect(screen.getByLabelText(/Profile Picture URL/i)).toBeDisabled();
    expect(screen.getByText(/Profile picture is managed by your social provider/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Editing Disabled/i })).toBeDisabled();
  });

  it("shows additional info card", () => {
    render(<SettingsPage />);
    expect(screen.getByText(/Account Information/i)).toBeInTheDocument();
    expect(screen.getByText(/Your account is managed by Auth0/i)).toBeInTheDocument();
  });

  it("navigates back to dashboard when back button is clicked", async () => {
    render(<SettingsPage />);
    const backButton = screen.getByRole("button", { name: /Back to Dashboard/i });
    await userEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith("/home");
  });

  it("submits form and shows success message", async () => {
    const updateUserProfile = vi.fn().mockResolvedValue({});
    render(<SettingsPage />);
    const nameInput = screen.getByLabelText(/Full Name/i);
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Updated Name");
    const submitButton = screen.getByRole("button", { name: /Save Changes/i });
    await userEvent.click(submitButton);
    await waitFor(() => {
      expect(updateUserProfile).toHaveBeenCalledWith(mockUser.sub, {
        name: "Updated Name",
        picture: mockUser.picture,
      });
      expect(screen.getByText(/Profile updated successfully/i)).toBeInTheDocument();
    });
  });

  it("shows error message on failed profile update", async () => {
    const updateUserProfile = vi.fn().mockRejectedValue(new Error("fail"));
    render(<SettingsPage />);
    const submitButton = screen.getByRole("button", { name: /Save Changes/i });
    await userEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText(/Failed to update profile/i)).toBeInTheDocument();
    });
  });

  it("disables submit button while loading", async () => {
    let resolvePromise;
    const updateUserProfile = vi.fn().mockImplementation(
      () => new Promise((resolve) => { resolvePromise = resolve; })
    );
    render(<SettingsPage />);
    const submitButton = screen.getByRole("button", { name: /Save Changes/i });
    await userEvent.click(submitButton);
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
    resolvePromise();
  });

  it("reloads page after successful update", async () => {
    const originalReload = window.location.reload;
    window.location.reload = vi.fn();

    render(<SettingsPage />);
    const submitButton = screen.getByRole("button", { name: /Save Changes/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(window.location.reload).toHaveBeenCalled();
    });

    // Restore original
    window.location.reload = originalReload;
  });
});