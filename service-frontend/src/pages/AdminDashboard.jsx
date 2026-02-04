import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [customers, setCustomers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newService, setNewService] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
  });

  /* ================= FETCH ALL ================= */
  const fetchAll = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    setLoading(true);

    try {
      const [usersRes, ordersRes, servicesRes] = await Promise.all([
        axios.get("http://localhost:5000/api/users", { headers }),
        axios.get("http://localhost:5000/api/orders", { headers }),
        axios.get("http://localhost:5000/api/services", { headers }),
      ]);

      const users = usersRes.data;
      setCustomers(users.filter((u) => u.role === "user"));
      setVendors(users.filter((u) => u.role === "vendor"));
      setOrders(ordersRes.data);
      setServices(servicesRes.data);

      // Notifications for newly logged-in vendors
      users.filter(u => u.role === "vendor" && u.isLoggedIn).forEach(v => {
        setNotifications(prev => [...prev, `${v.name} just logged in.`]);
      });

    } catch (err) {
      console.error(err);
      alert("Failed loading data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  /* ================= VENDOR ================= */
  const toggleVendorStatus = async (vendor) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    await axios.put(
      `http://localhost:5000/api/users/${vendor._id}`,
      { isApproved: !vendor.isApproved },
      { headers }
    );
    fetchAll();
  };

  /* ================= SERVICES ================= */
  const addService = async () => {
    const { name, price, description, category } = newService;
    if (!name || !price || !description || !category)
      return alert("All fields are required");

    const token = localStorage.getItem("token");
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    await axios.post(
      "http://localhost:5000/api/services",
      { name, price: Number(price), description, category },
      { headers }
    );

    setNewService({ name: "", price: "", description: "", category: "" });
    fetchAll();
  };

  const deleteService = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    if (!window.confirm("Delete service?")) return;
    await axios.delete(`http://localhost:5000/api/services/${id}`, { headers });
    fetchAll();
  };

  /* ================= ORDERS ================= */
  const updateOrderStatus = async (id, status) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    await axios.put(`http://localhost:5000/api/orders/${id}`, { status }, { headers });
    fetchAll();
  };

  if (loading) {
    return (
      <div style={loadingPage}>
        <div style={loadingSpinner}>
          <span style={spinnerIcon}>⏳</span>
          <p style={loadingText}>Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  const goToTab = (tab) => setActiveTab(tab);

  return (
    <div style={page}>
      <Navbar role="admin" notifications={notifications} />

      <div style={container}>
        <div style={headerSection}>
          <div style={titleGroup}>
            <div style={adminIconCircle}>
              <span style={adminIcon}>👨‍💼</span>
            </div>
            <div>
              <h2 style={pageTitle}>Admin Dashboard</h2>
              <p style={pageSubtitle}>Manage your platform efficiently</p>
            </div>
          </div>
        </div>

        <div style={statsGrid}>
          <Stat 
            title="Customers" 
            value={customers.length} 
            onClick={() => goToTab("customers")}
            icon="👥"
            color="#4f7cff"
          />
          <Stat 
            title="Vendors" 
            value={vendors.length} 
            onClick={() => goToTab("vendors")}
            icon="👨‍🔧"
            color="#22c55e"
          />
          <Stat 
            title="Orders" 
            value={orders.length} 
            onClick={() => goToTab("orders")}
            icon="📦"
            color="#f59e0b"
          />
          <Stat 
            title="Services" 
            value={services.length} 
            onClick={() => goToTab("services")}
            icon="🛠️"
            color="#8b5cf6"
          />
        </div>

        <div style={tabs}>
          {[
            { key: "overview", label: "Overview", icon: "📊" },
            { key: "customers", label: "Customers", icon: "👥" },
            { key: "vendors", label: "Vendors", icon: "👨‍🔧" },
            { key: "orders", label: "Orders", icon: "📦" },
            { key: "services", label: "Services", icon: "🛠️" }
          ].map((tab) => (
            <button
              key={tab.key}
              style={activeTab === tab.key ? activeBtn : btn}
              onClick={() => setActiveTab(tab.key)}
              onMouseEnter={(e) => {
                if (activeTab !== tab.key) {
                  e.currentTarget.style.background = "rgba(79, 124, 255, 0.2)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.key) {
                  e.currentTarget.style.background = "rgba(15, 23, 42, 0.8)";
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              <span style={tabIcon}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ===== OVERVIEW ===== */}
        {activeTab === "overview" && (
          <div style={overviewContainer}>
            <div style={welcomeCard}>
              <div style={welcomeIcon}>👋</div>
              <h3 style={welcomeTitle}>Welcome, <b>Admin</b>!</h3>
              <p style={welcomeText}>Click on the stats above to manage users, orders, and services.</p>
            </div>
            <div style={quickActionsGrid}>
              <QuickAction 
                icon="👥" 
                title="Manage Customers" 
                description="View all registered customers"
                onClick={() => goToTab("customers")}
              />
              <QuickAction 
                icon="👨‍🔧" 
                title="Approve Vendors" 
                description="Review vendor applications"
                onClick={() => goToTab("vendors")}
              />
              <QuickAction 
                icon="📦" 
                title="Track Orders" 
                description="Monitor order status"
                onClick={() => goToTab("orders")}
              />
              <QuickAction 
                icon="🛠️" 
                title="Add Services" 
                description="Manage service catalog"
                onClick={() => goToTab("services")}
              />
            </div>
          </div>
        )}

        {/* ===== CUSTOMERS ===== */}
        {activeTab === "customers" && (
          <div style={contentSection}>
            <div style={sectionHeader}>
              <span style={sectionIcon}>👥</span>
              <h3 style={sectionTitle}>Customer Management</h3>
              <span style={countBadge}>{customers.length} Total</span>
            </div>
            {customers.length === 0 ? (
              <EmptyState icon="👥" message="No customers found" />
            ) : (
              customers.map((c) => (
                <div key={c._id} style={card}>
                  <div style={cardHeader}>
                    <div style={userIconCircle}>
                      <span style={userIconSmall}>👤</span>
                    </div>
                    <div style={cardInfo}>
                      <b style={cardName}>{c.name}</b>
                      <p style={cardEmail}>
                        <span style={emailIcon}>✉️</span>
                        {c.email}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ===== VENDORS ===== */}
        {activeTab === "vendors" && (
          <div style={contentSection}>
            <div style={sectionHeader}>
              <span style={sectionIcon}>👨‍🔧</span>
              <h3 style={sectionTitle}>Vendor Management</h3>
              <span style={countBadge}>{vendors.length} Total</span>
            </div>
            {vendors.length === 0 ? (
              <EmptyState icon="👨‍🔧" message="No vendors found" />
            ) : (
              vendors.map((v) => (
                <div key={v._id} style={card}>
                  <div style={cardHeader}>
                    <div style={vendorIconCircle}>
                      <span style={userIconSmall}>👨‍🔧</span>
                    </div>
                    <div style={cardInfo}>
                      <b style={cardName}>{v.name}</b>
                      <p style={cardEmail}>
                        <span style={emailIcon}>✉️</span>
                        {v.email}
                      </p>
                      <div style={statusRow}>
                        <span style={statusLabel}>Status:</span>
                        <span style={v.isApproved ? approvedBadge : suspendedBadge}>
                          {v.isApproved ? "✅ Approved" : "⛔ Suspended"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button 
                    style={v.isApproved ? suspendBtn : approveBtn} 
                    onClick={() => toggleVendorStatus(v)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.opacity = "0.9";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.opacity = "1";
                    }}
                  >
                    <span style={btnIconSmall}>
                      {v.isApproved ? "⛔" : "✅"}
                    </span>
                    {v.isApproved ? "Suspend" : "Approve"}
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* ===== ORDERS ===== */}
        {activeTab === "orders" && (
          <div style={contentSection}>
            <div style={sectionHeader}>
              <span style={sectionIcon}>📦</span>
              <h3 style={sectionTitle}>Order Management</h3>
              <span style={countBadge}>{orders.length} Total</span>
            </div>
            {orders.length === 0 ? (
              <EmptyState icon="📦" message="No orders found" />
            ) : (
              orders.map((o) => (
                <div key={o._id} style={card}>
                  <div style={orderCardContent}>
                    <div style={orderIconCircle}>
                      <span style={orderIcon}>📦</span>
                    </div>
                    <div style={orderInfo}>
                      <b style={serviceName}>{o.service?.name || "Unknown Service"}</b>
                      <p style={customerInfo}>
                        <span style={customerIcon}>👤</span>
                        Customer: <b>{o.customer?.name || "Unknown"}</b>
                      </p>
                      <div style={statusSelectRow}>
                        <span style={statusSelectLabel}>Status:</span>
                        <div style={selectWrapper}>
                          <select
                            style={statusSelect}
                            value={o.status}
                            onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                          >
                            <option value="pending">⏳ Pending</option>
                            <option value="inProgress">🔄 In Progress</option>
                            <option value="completed">✅ Completed</option>
                          </select>
                          <span style={selectArrow}>▼</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ===== SERVICES ===== */}
        {activeTab === "services" && (
          <div style={contentSection}>
            <div style={sectionHeader}>
              <span style={sectionIcon}>🛠️</span>
              <h3 style={sectionTitle}>Service Management</h3>
              <span style={countBadge}>{services.length} Total</span>
            </div>

            {/* Add Service Form */}
            <div style={addServiceCard}>
              <div style={formHeader}>
                <span style={formIcon}>➕</span>
                <h4 style={formTitle}>Add New Service</h4>
              </div>
              <div style={formGrid}>
                <div style={inputGroup}>
                  <label style={inputLabel}>
                    <span style={labelIcon}>🏷️</span>
                    Service Name
                  </label>
                  <input
                    style={input}
                    placeholder="e.g., House Cleaning"
                    value={newService.name}
                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  />
                </div>
                <div style={inputGroup}>
                  <label style={inputLabel}>
                    <span style={labelIcon}>💰</span>
                    Price
                  </label>
                  <input
                    style={input}
                    placeholder="e.g., 500"
                    type="number"
                    value={newService.price}
                    onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                  />
                </div>
                <div style={inputGroup}>
                  <label style={inputLabel}>
                    <span style={labelIcon}>📝</span>
                    Description
                  </label>
                  <input
                    style={input}
                    placeholder="Service description"
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  />
                </div>
                <div style={inputGroup}>
                  <label style={inputLabel}>
                    <span style={labelIcon}>📂</span>
                    Category
                  </label>
                  <input
                    style={input}
                    placeholder="e.g., Cleaning"
                    value={newService.category}
                    onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                  />
                </div>
              </div>
              <button 
                style={addServiceBtn} 
                onClick={addService}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(34, 197, 94, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(34, 197, 94, 0.3)";
                }}
              >
                <span style={btnIconLarge}>➕</span>
                Add Service
              </button>
            </div>

            {/* Services List */}
            {services.length === 0 ? (
              <EmptyState icon="🛠️" message="No services available" />
            ) : (
              services.map((s) => (
                <div key={s._id} style={serviceCard}>
                  <div style={serviceCardHeader}>
                    <div style={serviceIconCircle}>
                      <span style={serviceIconLarge}>🛠️</span>
                    </div>
                    <div style={serviceCardInfo}>
                      <b style={serviceCardName}>{s.name}</b>
                      <p style={serviceCardDesc}>{s.description}</p>
                      <div style={serviceMetaRow}>
                        <span style={priceTag}>
                          <span style={priceIcon}>💰</span>
                          Rs {s.price}
                        </span>
                        <span style={categoryTag}>
                          <span style={categoryIcon}>📂</span>
                          {s.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button 
                    style={deleteBtn} 
                    onClick={() => deleteService(s._id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 6px 20px rgba(239, 68, 68, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 15px rgba(239, 68, 68, 0.3)";
                    }}
                  >
                    <span style={btnIconSmall}>🗑️</span>
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ===== REUSABLE COMPONENTS ===== */
const Stat = ({ title, value, onClick, icon, color }) => (
  <div 
    style={{...statCard, borderColor: color + "40"}} 
    onClick={onClick}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-5px)";
      e.currentTarget.style.boxShadow = `0 10px 30px ${color}40`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.3)";
    }}
  >
    <div style={{...statIconCircle, background: color + "20", border: `2px solid ${color}40`}}>
      <span style={statIconLarge}>{icon}</span>
    </div>
    <h3 style={statTitle}>{title}</h3>
    <p style={{...statValue, color}}>{value}</p>
  </div>
);

const QuickAction = ({ icon, title, description, onClick }) => (
  <div 
    style={quickActionCard} 
    onClick={onClick}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-3px)";
      e.currentTarget.style.borderColor = "rgba(79, 124, 255, 0.5)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.borderColor = "rgba(148, 163, 184, 0.2)";
    }}
  >
    <span style={quickActionIcon}>{icon}</span>
    <h4 style={quickActionTitle}>{title}</h4>
    <p style={quickActionDesc}>{description}</p>
  </div>
);

const EmptyState = ({ icon, message }) => (
  <div style={emptyStateContainer}>
    <span style={emptyStateIcon}>{icon}</span>
    <p style={emptyStateText}>{message}</p>
  </div>
);

/* ===== ENHANCED STYLES ===== */
const page = {
  background: "linear-gradient(135deg, #0a0e1a 0%, #1a1f35 100%)",
  minHeight: "100vh",
  color: "white",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
};

const loadingPage = {
  ...page,
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const loadingSpinner = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1rem"
};

const spinnerIcon = {
  fontSize: "4rem",
  animation: "spin 2s linear infinite"
};

const loadingText = {
  fontSize: "1.2rem",
  color: "#94a3b8"
};

const container = {
  padding: "2rem",
  maxWidth: "1400px",
  margin: "0 auto"
};

const headerSection = {
  marginBottom: "2.5rem"
};

const titleGroup = {
  display: "flex",
  alignItems: "center",
  gap: "1rem"
};

const adminIconCircle = {
  width: "70px",
  height: "70px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, rgba(79, 124, 255, 0.2) 0%, rgba(59, 91, 219, 0.1) 100%)",
  border: "3px solid rgba(79, 124, 255, 0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 8px 25px rgba(79, 124, 255, 0.3)"
};

const adminIcon = {
  fontSize: "2.5rem"
};

const pageTitle = {
  fontSize: "2.5rem",
  fontWeight: "700",
  marginBottom: "0.25rem",
  background: "linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text"
};

const pageSubtitle = {
  color: "#94a3b8",
  fontSize: "1rem",
  margin: 0
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "1.5rem",
  marginBottom: "2rem"
};

const statCard = {
  background: "rgba(15, 23, 42, 0.8)",
  backdropFilter: "blur(10px)",
  padding: "2rem",
  borderRadius: "20px",
  border: "2px solid",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
  cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1rem"
};

const statIconCircle = {
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const statIconLarge = {
  fontSize: "2rem"
};

const statTitle = {
  fontSize: "1rem",
  fontWeight: "600",
  color: "#cbd5e1",
  margin: 0
};

const statValue = {
  fontSize: "2.5rem",
  fontWeight: "700",
  margin: 0
};

const tabs = {
  display: "flex",
  gap: "1rem",
  marginBottom: "2rem",
  flexWrap: "wrap"
};

const btn = {
  background: "rgba(15, 23, 42, 0.8)",
  color: "white",
  padding: "12px 20px",
  border: "2px solid rgba(148, 163, 184, 0.2)",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "0.95rem",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem"
};

const activeBtn = {
  ...btn,
  background: "linear-gradient(135deg, #4f7cff 0%, #3b5bdb 100%)",
  border: "2px solid rgba(79, 124, 255, 0.5)",
  boxShadow: "0 4px 15px rgba(79, 124, 255, 0.3)"
};

const tabIcon = {
  fontSize: "1.1rem"
};

const overviewContainer = {
  display: "flex",
  flexDirection: "column",
  gap: "2rem"
};

const welcomeCard = {
  background: "rgba(15, 23, 42, 0.8)",
  backdropFilter: "blur(10px)",
  padding: "3rem",
  borderRadius: "20px",
  border: "2px solid rgba(79, 124, 255, 0.2)",
  textAlign: "center",
  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.4)"
};

const welcomeIcon = {
  fontSize: "4rem",
  marginBottom: "1rem"
};

const welcomeTitle = {
  fontSize: "2rem",
  marginBottom: "1rem",
  color: "#e2e8f0"
};

const welcomeText = {
  fontSize: "1.1rem",
  color: "#94a3b8",
  margin: 0
};

const quickActionsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "1.5rem"
};

const quickActionCard = {
  background: "rgba(15, 23, 42, 0.6)",
  padding: "2rem",
  borderRadius: "16px",
  border: "2px solid rgba(148, 163, 184, 0.2)",
  cursor: "pointer",
  transition: "all 0.3s ease",
  textAlign: "center"
};

const quickActionIcon = {
  fontSize: "3rem",
  display: "block",
  marginBottom: "1rem"
};

const quickActionTitle = {
  fontSize: "1.2rem",
  fontWeight: "700",
  marginBottom: "0.5rem",
  color: "#e2e8f0"
};

const quickActionDesc = {
  fontSize: "0.95rem",
  color: "#94a3b8",
  margin: 0
};

const contentSection = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem"
};

const sectionHeader = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  marginBottom: "1rem",
  padding: "1rem",
  background: "rgba(15, 23, 42, 0.6)",
  borderRadius: "12px",
  border: "2px solid rgba(148, 163, 184, 0.2)"
};

const sectionIcon = {
  fontSize: "2rem"
};

const sectionTitle = {
  fontSize: "1.5rem",
  fontWeight: "700",
  color: "#e2e8f0",
  margin: 0,
  flex: 1
};

const countBadge = {
  padding: "0.5rem 1rem",
  background: "rgba(79, 124, 255, 0.2)",
  border: "1px solid rgba(79, 124, 255, 0.3)",
  borderRadius: "20px",
  fontSize: "0.9rem",
  fontWeight: "600",
  color: "#93c5fd"
};

const card = {
  background: "rgba(15, 23, 42, 0.8)",
  backdropFilter: "blur(10px)",
  padding: "1.5rem",
  borderRadius: "16px",
  border: "2px solid rgba(148, 163, 184, 0.1)",
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
  transition: "all 0.3s ease"
};

const cardHeader = {
  display: "flex",
  alignItems: "center",
  gap: "1rem"
};

const userIconCircle = {
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, rgba(79, 124, 255, 0.2) 0%, rgba(59, 91, 219, 0.1) 100%)",
  border: "2px solid rgba(79, 124, 255, 0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0
};

const vendorIconCircle = {
  ...userIconCircle,
  background: "linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(22, 163, 74, 0.1) 100%)",
  border: "2px solid rgba(34, 197, 94, 0.3)"
};

const userIconSmall = {
  fontSize: "1.5rem"
};

const cardInfo = {
  flex: 1
};

const cardName = {
  fontSize: "1.2rem",
  color: "#e2e8f0",
  marginBottom: "0.25rem",
  display: "block"
};

const cardEmail = {
  fontSize: "0.95rem",
  color: "#94a3b8",
  margin: 0,
  display: "flex",
  alignItems: "center",
  gap: "0.5rem"
};

const emailIcon = {
  fontSize: "0.9rem"
};

const statusRow = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  marginTop: "0.5rem"
};

const statusLabel = {
  fontSize: "0.9rem",
  color: "#94a3b8"
};

const approvedBadge = {
  padding: "0.4rem 0.8rem",
  background: "rgba(34, 197, 94, 0.2)",
  border: "1px solid rgba(34, 197, 94, 0.3)",
  borderRadius: "20px",
  fontSize: "0.85rem",
  fontWeight: "600",
  color: "#4ade80"
};

const suspendedBadge = {
  padding: "0.4rem 0.8rem",
  background: "rgba(239, 68, 68, 0.2)",
  border: "1px solid rgba(239, 68, 68, 0.3)",
  borderRadius: "20px",
  fontSize: "0.85rem",
  fontWeight: "600",
  color: "#f87171"
};

const approveBtn = {
  marginTop: "1rem",
  padding: "10px 16px",
  background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
  border: "none",
  borderRadius: "10px",
  color: "white",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  boxShadow: "0 4px 15px rgba(34, 197, 94, 0.3)"
};

const suspendBtn = {
  ...approveBtn,
  background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
  boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)"
};

const btnIconSmall = {
  fontSize: "1rem"
};

const orderCardContent = {
  display: "flex",
  gap: "1rem"
};

const orderIconCircle = {
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.1) 100%)",
  border: "2px solid rgba(245, 158, 11, 0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0
};

const orderIcon = {
  fontSize: "1.5rem"
};

const orderInfo = {
  flex: 1
};

const serviceName = {
  fontSize: "1.2rem",
  color: "#e2e8f0",
  marginBottom: "0.5rem",
  display: "block"
};

const customerInfo = {
  fontSize: "0.95rem",
  color: "#94a3b8",
  margin: "0 0 0.75rem 0",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem"
};

const customerIcon = {
  fontSize: "1rem"
};

const statusSelectRow = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem"
};

const statusSelectLabel = {
  fontSize: "0.95rem",
  color: "#cbd5e1",
  fontWeight: "600"
};

const selectWrapper = {
  position: "relative",
  flex: 1
};

const statusSelect = {
  width: "100%",
  padding: "10px 40px 10px 14px",
  background: "rgba(2, 6, 23, 0.6)",
  border: "2px solid rgba(148, 163, 184, 0.3)",
  color: "white",
  borderRadius: "10px",
  fontSize: "0.95rem",
  fontWeight: "500",
  cursor: "pointer",
  appearance: "none",
  outline: "none"
};

const selectArrow = {
  position: "absolute",
  right: "14px",
  top: "50%",
  transform: "translateY(-50%)",
  fontSize: "0.7rem",
  color: "#94a3b8",
  pointerEvents: "none"
};

const addServiceCard = {
  background: "rgba(15, 23, 42, 0.8)",
  backdropFilter: "blur(10px)",
  padding: "2rem",
  borderRadius: "20px",
  border: "2px solid rgba(79, 124, 255, 0.2)",
  marginBottom: "2rem",
  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.4)"
};

const formHeader = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  marginBottom: "1.5rem"
};

const formIcon = {
  fontSize: "1.8rem"
};

const formTitle = {
  fontSize: "1.5rem",
  fontWeight: "700",
  color: "#e2e8f0",
  margin: 0
};

const formGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "1rem",
  marginBottom: "1.5rem"
};

const inputGroup = {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem"
};

const inputLabel = {
  fontSize: "0.9rem",
  fontWeight: "600",
  color: "#cbd5e1",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem"
};

const labelIcon = {
  fontSize: "1rem"
};

const input = {
  width: "100%",
  padding: "12px 14px",
  background: "rgba(2, 6, 23, 0.6)",
  border: "2px solid rgba(148, 163, 184, 0.2)",
  color: "white",
  borderRadius: "10px",
  fontSize: "0.95rem",
  outline: "none",
  transition: "all 0.3s ease"
};

const addServiceBtn = {
  width: "100%",
  padding: "14px",
  background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
  border: "none",
  borderRadius: "12px",
  color: "white",
  fontWeight: "700",
  fontSize: "1.05rem",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
  boxShadow: "0 4px 15px rgba(34, 197, 94, 0.3)",
  transition: "all 0.3s ease"
};

const btnIconLarge = {
  fontSize: "1.3rem"
};

const serviceCard = {
  ...card,
  display: "flex",
  flexDirection: "column",
  gap: "1rem"
};

const serviceCardHeader = {
  display: "flex",
  gap: "1rem",
  alignItems: "flex-start"
};

const serviceIconCircle = {
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(124, 58, 237, 0.1) 100%)",
  border: "2px solid rgba(139, 92, 246, 0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0
};

const serviceIconLarge = {
  fontSize: "2rem"
};

const serviceCardInfo = {
  flex: 1
};

const serviceCardName = {
  fontSize: "1.3rem",
  color: "#e2e8f0",
  marginBottom: "0.5rem",
  display: "block"
};

const serviceCardDesc = {
  fontSize: "0.95rem",
  color: "#94a3b8",
  lineHeight: "1.6",
  marginBottom: "0.75rem"
};

const serviceMetaRow = {
  display: "flex",
  gap: "1rem",
  flexWrap: "wrap"
};

const priceTag = {
  padding: "0.5rem 1rem",
  background: "rgba(34, 197, 94, 0.15)",
  border: "1px solid rgba(34, 197, 94, 0.3)",
  borderRadius: "20px",
  fontSize: "0.95rem",
  fontWeight: "600",
  color: "#4ade80",
  display: "flex",
  alignItems: "center",
  gap: "0.4rem"
};

const priceIcon = {
  fontSize: "1rem"
};

const categoryTag = {
  padding: "0.5rem 1rem",
  background: "rgba(139, 92, 246, 0.15)",
  border: "1px solid rgba(139, 92, 246, 0.3)",
  borderRadius: "20px",
  fontSize: "0.95rem",
  fontWeight: "600",
  color: "#a78bfa",
  display: "flex",
  alignItems: "center",
  gap: "0.4rem"
};

const categoryIcon = {
  fontSize: "1rem"
};

const deleteBtn = {
  padding: "10px 16px",
  background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
  border: "none",
  borderRadius: "10px",
  color: "white",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  alignSelf: "flex-start",
  boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)"
};

const emptyStateContainer = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "4rem 2rem",
  background: "rgba(15, 23, 42, 0.6)",
  borderRadius: "16px",
  border: "2px dashed rgba(148, 163, 184, 0.3)"
};

const emptyStateIcon = {
  fontSize: "4rem",
  opacity: 0.5,
  marginBottom: "1rem"
};

const emptyStateText = {
  fontSize: "1.1rem",
  color: "#64748b",
  margin: 0
};