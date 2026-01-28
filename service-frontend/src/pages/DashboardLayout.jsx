import Navbar from "../components/Navbar";

export default function DashboardLayout({ children }) {
  return (
    <div style={container}>
      <Navbar />
      <div style={content}>{children}</div>
    </div>
  );
}

const container = {
  minHeight: "100vh",
  background: "#020617",
  color: "white",
};

const content = {
  padding: "2rem",
};
