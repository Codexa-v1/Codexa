import { describe, it, expect, vi, beforeEach } from "vitest";
import { getUserProfile, updateUserProfile } from "../../backend/api/UserProfile";

const API_URL = "http://localhost:3000";
const userId = "user123";
const profileData = { name: "Alice", email: "alice@example.com" };

global.fetch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  import.meta.env = { VITE_BACKEND_URL: API_URL };
});

describe("getUserProfile", () => {
  it("should return user profile on success", async () => {
    const mockProfile = { name: "Alice", email: "alice@example.com" };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProfile,
    });

    const result = await getUserProfile(userId);

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/api/users/${userId}`);
    expect(result).toEqual(mockProfile);
  });

  it("should throw error if response not ok", async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    await expect(getUserProfile(userId)).rejects.toThrow("Failed to fetch user profile");
  });

  it("should log error and throw on fetch failure", async () => {
    const error = new Error("Network error");
    fetch.mockRejectedValueOnce(error);

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(getUserProfile(userId)).rejects.toThrow(error);
    expect(consoleSpy).toHaveBeenCalledWith("Error fetching user profile:", error);

    consoleSpy.mockRestore();
  });
});

describe("updateUserProfile", () => {
  it("should return updated profile on success", async () => {
    const updatedProfile = { name: "Alice", email: "alice@example.com", age: 30 };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => updatedProfile,
    });

    const result = await updateUserProfile(userId, profileData);

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/api/users/${userId}`,
      expect.objectContaining({
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      })
    );
    expect(result).toEqual(updatedProfile);
  });

  it("should throw error if response not ok", async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    await expect(updateUserProfile(userId, profileData)).rejects.toThrow("Failed to update user profile");
  });

  it("should log error and throw on fetch failure", async () => {
    const error = new Error("Network error");
    fetch.mockRejectedValueOnce(error);

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(updateUserProfile(userId, profileData)).rejects.toThrow(error);
    expect(consoleSpy).toHaveBeenCalledWith("Error updating user profile:", error);

    consoleSpy.mockRestore();
  });
});