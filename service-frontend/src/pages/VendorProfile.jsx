import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function VendorProfile() {
  const [profile, setProfile] = useState({ name: "", email: "", role: "" });
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get("http://localhost:5000/api/users/me", { headers });
        if (isMounted) setProfile({ name: res.data.name, email: res.data.email, role: res.data.role });
      } catch (err) {
        console.error(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProfile();
    return () => { isMounted = false; };
  }, []);

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      await axios.put("http://localhost:5000/api/users/me", { ...profile, password: password || undefined }, { headers });
      alert("Profile updated successfully");
      setPassword("");
    } catch (err) {
      console.error(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p style={{ padding: "2rem" }}>Loading profile...</p>;

  return (
    <div style={{ minHeight: "100vh", background: "#020617", color: "white" }}>
      <Navbar />
      <div style={{ padding: "2rem", maxWidth: "400px" }}>
        <h1>My Profile</h1>
        <label>Name</label>
        <input style={input} value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
        <label>Email</label>
        <input style={input} value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
        <label>Role</label>
        <input style={input} value={profile.role} disabled />
        <label>Password (leave blank to keep current)</label>
        <input style={input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button style={btn} onClick={handleUpdate} disabled={updating}>{updating ? "Updating..." : "Update Profile"}</button>
      </div>
    </div>
  );
}

const input = { width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #555", marginBottom: "1rem", background: "#1e293b", color: "white" };
const btn = { padding: "10px", borderRadius: "6px", border: "none", background: "#4f7cff", color: "white", cursor: "pointer" };
