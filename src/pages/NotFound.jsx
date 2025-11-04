import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div
    className="d-flex justify-content-center align-items-center"
    style={{ minHeight: "60vh" }}
  >
    <Card
      className="shadow-sm border-0 text-center"
      style={{ maxWidth: "420px" }}
    >
      <Card.Body className="p-5">
        <h1 className="display-6 fw-semibold text-primary">404</h1>
        <p className="text-muted mb-4">
          Halaman yang Anda cari tidak ditemukan atau telah dipindahkan.
        </p>
        <Button as={Link} to="/" variant="primary">
          Kembali ke Dashboard
        </Button>
      </Card.Body>
    </Card>
  </div>
);

export default NotFound;
