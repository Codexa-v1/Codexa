const API_URL = import.meta.env.VITE_BACKEND_URL

export const updateUserProfile = async (userId, profileData) => {
  try {
    const response = await fetch(`${API_URL}/api/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    })

    if (!response.ok) {
      throw new Error("Failed to update user profile")
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw error
  }
}

export const getUserProfile = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/api/users/${userId}`)

    if (!response.ok) {
      throw new Error("Failed to fetch user profile")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching user profile:", error)
    throw error
  }
}
