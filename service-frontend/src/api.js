// src/api.js
const BASE_URL = "http://localhost:5000/api"; // your backend URL

// Login
export const loginUser = async (email, password) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Login API error:", error);
    return { message: "Login failed" };
  }
};

// Register
export const registerUser = async (name, email, password, role) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, role }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Register API error:", error);
    return { message: "Registration failed" };
  }
};
