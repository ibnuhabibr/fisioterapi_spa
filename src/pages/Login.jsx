import { useContext, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { GlobalContext } from "../context/GlobalState.jsx";

const Login = () => {
  const { state, setActiveUser, addNotification } = useContext(GlobalContext);
  const [formData, setFormData] = useState({
    email: state.meta.activeUser?.email ?? "admin@fisiomed.id",
    password: "",
    name: state.meta.activeUser?.name ?? "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const displayName = formData.name || "Administrator Shift";
    setActiveUser({
      id: "ADM-" + Math.floor(Math.random() * 900 + 100),
      name: displayName,
      role: "Administrator",
      email: formData.email,
    });
    addNotification(`Shift ${displayName} dimulai.`, "info");
    setFormData((prev) => ({ ...prev, password: "" }));
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center fade-in-up"
      style={{ minHeight: "60vh" }}
    >
      <Card
        className="shadow-soft border-0"
        style={{ maxWidth: "420px", width: "100%" }}
      >
        <Card.Body className="p-5">
          <div className="text-center mb-4">
            <img
              src="/logo.png"
              alt="FisioMed Logo"
              style={{ height: "80px", width: "auto", marginBottom: "1rem" }}
            />
            <h2 className="h4 fw-semibold mb-2" style={{
              background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Login Petugas</h2>
            <p className="text-muted mb-0">
              Aktifkan sesi shift untuk mencatat kunjungan dan transaksi.
            </p>
          </div>
          <Form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <Form.Group controlId="loginName">
              <Form.Label>Nama Petugas</Form.Label>
              <Form.Control
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Contoh: Reno Dwipa"
                required
              />
            </Form.Group>
            <Form.Group controlId="loginEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="petugas@fisiomed.id"
                required
              />
            </Form.Group>
            <Form.Group controlId="loginPassword">
              <Form.Label>Kode Akses</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Masukkan kode shift"
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100">
              Mulai Shift
            </Button>
          </Form>
          <Row className="mt-4">
            <Col>
              <small className="text-muted">
                Terakhir aktif:{" "}
                {state.meta.activeUser?.lastLogin
                  ? new Date(state.meta.activeUser.lastLogin).toLocaleString(
                      "id-ID",
                      {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }
                    )
                  : "Belum pernah login"}
              </small>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
