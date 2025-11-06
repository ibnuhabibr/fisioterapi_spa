import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div
    className="d-flex justify-content-center align-items-center fade-in-up"
    style={{ minHeight: "60vh" }}
  >
    <Card
      className="shadow-soft border-0 text-center"
      style={{ maxWidth: "480px" }}
    >
      <Card.Body className="p-5">
        <div className="mb-4">
          <img
            src="/logo.png"
            alt="FisioMed Logo"
            style={{
              height: "60px",
              width: "auto",
              opacity: 0.7,
              marginBottom: "1rem",
            }}
          />
        </div>
        <div className="mb-4" style={{ fontSize: "5rem", lineHeight: 1 }}>
          😕
        </div>
        <h1
          className="display-4 fw-bold mb-3"
          style={{
            background: "linear-gradient(135deg, #dc3545 0%, #b02a37 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          404
        </h1>
        <h2 className="h5 fw-semibold mb-3">Halaman Tidak Ditemukan</h2>
        <p className="text-muted mb-4">
          Halaman yang Anda cari tidak ditemukan atau telah dipindahkan.
          <br />
          <small>
            Silakan kembali ke dashboard atau hubungi administrator.
          </small>
        </p>
        <div className="d-flex gap-2 justify-content-center">
          <Button as={Link} to="/" variant="primary" size="lg">
            🏠 Kembali ke Dashboard
          </Button>
          <Button
            as={Link}
            to="/pengaturan"
            variant="outline-secondary"
            size="lg"
          >
            ⚙️ Pengaturan
          </Button>
        </div>
      </Card.Body>
    </Card>
  </div>
);

export default NotFound;
