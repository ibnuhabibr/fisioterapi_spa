import { useMemo } from "react";
import { Badge, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { NavLink, Outlet, useLocation } from "react-router-dom";

const Layout = () => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const location = useLocation();

  // Check if any master route is active
  const isMasterActive = ["/pasien", "/pegawai", "/layanan"].some(
    (path) => location.pathname === path
  );

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar
        expand="lg"
        sticky="top"
        className="shadow-sm border-bottom"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Container fluid className="px-4">
          <Navbar.Brand
            as={NavLink}
            to="/"
            className="fw-bold d-flex align-items-center gap-2"
            style={{ fontSize: "1.5rem", letterSpacing: "-0.5px" }}
          >
            <span
              style={{
                fontSize: "1.8rem",
                filter: "drop-shadow(0 2px 4px rgba(13, 110, 253, 0.3))",
              }}
            >
              🏥
            </span>
            <span>
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Fisio
              </span>
              <span className="text-secondary">Med</span>
            </span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="me-auto ms-lg-4 gap-1">
              <Nav.Link
                as={NavLink}
                to="/"
                end
                className={({ isActive }) =>
                  `fw-medium px-3 py-2 rounded ${
                    isActive
                      ? "text-primary bg-primary bg-opacity-10"
                      : "text-muted"
                  }`
                }
                style={({ isActive }) => ({
                  transition: "all 0.2s ease",
                  ...(isActive && {
                    boxShadow: "0 2px 8px rgba(13, 110, 253, 0.2)",
                  }),
                })}
              >
                📊 Dashboard
              </Nav.Link>

              <NavDropdown
                title={
                  <span
                    className={isMasterActive ? "text-primary" : "text-muted"}
                  >
                    📚 Master Data
                  </span>
                }
                id="master-dropdown"
                className={`fw-medium ${isMasterActive ? "active" : ""}`}
                style={{
                  ...(isMasterActive && {
                    backgroundColor: "rgba(13, 110, 253, 0.1)",
                    borderRadius: "0.375rem",
                  }),
                }}
              >
                <NavDropdown.Item
                  as={NavLink}
                  to="/pasien"
                  className="d-flex align-items-center gap-2"
                >
                  👥 Master Pasien
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={NavLink}
                  to="/pegawai"
                  className="d-flex align-items-center gap-2"
                >
                  👨‍⚕️ Master Pegawai
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={NavLink}
                  to="/layanan"
                  className="d-flex align-items-center gap-2"
                >
                  🛠️ Master Layanan
                </NavDropdown.Item>
              </NavDropdown>

              <Nav.Link
                as={NavLink}
                to="/kunjungan"
                className={({ isActive }) =>
                  `fw-medium px-3 py-2 rounded ${
                    isActive
                      ? "text-primary bg-primary bg-opacity-10"
                      : "text-muted"
                  }`
                }
                style={({ isActive }) => ({
                  transition: "all 0.2s ease",
                  ...(isActive && {
                    boxShadow: "0 2px 8px rgba(13, 110, 253, 0.2)",
                  }),
                })}
              >
                📅 Kunjungan
              </Nav.Link>

              <Nav.Link
                as={NavLink}
                to="/transaksi"
                className={({ isActive }) =>
                  `fw-medium px-3 py-2 rounded ${
                    isActive
                      ? "text-primary bg-primary bg-opacity-10"
                      : "text-muted"
                  }`
                }
                style={({ isActive }) => ({
                  transition: "all 0.2s ease",
                  ...(isActive && {
                    boxShadow: "0 2px 8px rgba(13, 110, 253, 0.2)",
                  }),
                })}
              >
                💳 Transaksi
              </Nav.Link>

              <Nav.Link
                as={NavLink}
                to="/laporan"
                className={({ isActive }) =>
                  `fw-medium px-3 py-2 rounded ${
                    isActive
                      ? "text-primary bg-primary bg-opacity-10"
                      : "text-muted"
                  }`
                }
                style={({ isActive }) => ({
                  transition: "all 0.2s ease",
                  ...(isActive && {
                    boxShadow: "0 2px 8px rgba(13, 110, 253, 0.2)",
                  }),
                })}
              >
                📈 Laporan
              </Nav.Link>

              <Nav.Link
                as={NavLink}
                to="/pengaturan"
                className={({ isActive }) =>
                  `fw-medium px-3 py-2 rounded ${
                    isActive
                      ? "text-primary bg-primary bg-opacity-10"
                      : "text-muted"
                  }`
                }
                style={({ isActive }) => ({
                  transition: "all 0.2s ease",
                  ...(isActive && {
                    boxShadow: "0 2px 8px rgba(13, 110, 253, 0.2)",
                  }),
                })}
              >
                ⚙️ Pengaturan
              </Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link as={NavLink} to="/login" className="fw-medium">
                <Badge
                  bg="primary"
                  pill
                  className="px-3 py-2 d-flex align-items-center gap-2"
                  style={{
                    background:
                      "linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)",
                    boxShadow: "0 2px 12px rgba(13, 110, 253, 0.4)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 16px rgba(13, 110, 253, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 12px rgba(13, 110, 253, 0.4)";
                  }}
                >
                  👤 <span className="d-none d-sm-inline">Shift Admin</span>
                </Badge>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main className="flex-grow-1">
        <Container fluid className="py-4 px-4">
          <Outlet />
        </Container>
      </main>

      <footer
        className="bg-white border-top py-4 mt-auto"
        style={{ boxShadow: "0 -2px 10px rgba(0,0,0,0.05)" }}
      >
        <Container fluid className="px-4">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2">
            <div className="d-flex align-items-center gap-2">
              <span style={{ fontSize: "1.2rem" }}>🏥</span>
              <small className="text-muted">
                &copy; {currentYear} <strong>FisioMed</strong> Klinik
                Fisioterapi &amp; Baby Spa. All rights reserved.
              </small>
            </div>
            <small className="text-muted">
              <Badge bg="secondary" className="me-2">
                v1.0.0
              </Badge>
              Sistem Rekam Medis
            </small>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default Layout;
