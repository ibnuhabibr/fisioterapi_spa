import { useContext, useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import { GlobalContext } from "../context/GlobalState.jsx";

const emptyService = {
  name: "",
  category: "",
  duration: 60,
  price: 0,
  description: "",
  active: true,
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const MasterLayanan = () => {
  const { state, addService, updateService, deleteService } =
    useContext(GlobalContext);
  const [formData, setFormData] = useState(emptyService);
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const services = useMemo(
    () =>
      [...state.services].sort((a, b) =>
        a.category.localeCompare(b.category, "id-ID", { sensitivity: "base" })
      ),
    [state.services]
  );

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.name.trim()) return;

    addService({
      ...formData,
      price: Number(formData.price) || 0,
      duration: Number(formData.duration) || 0,
    });
    setFormData(emptyService);
  };

  const openModal = (service) => {
    setSelectedService(service);
    setFormData({
      name: service.name,
      category: service.category,
      duration: service.duration,
      price: service.price,
      description: service.description ?? "",
      active: service.active,
    });
    setShowModal(true);
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    if (!selectedService) return;

    updateService(selectedService.id, {
      ...selectedService,
      ...formData,
      price: Number(formData.price) || 0,
      duration: Number(formData.duration) || 0,
    });
    setShowModal(false);
    setSelectedService(null);
    setFormData(emptyService);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm("Hapus layanan ini dari katalog?");
    if (confirmed) {
      deleteService(id);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedService(null);
    setFormData(emptyService);
  };

  return (
    <div className="d-flex flex-column gap-4 fade-in-up">
      <div>
        <div className="d-flex align-items-center gap-2 mb-2">
          <span style={{ fontSize: "2rem" }}>🛠️</span>
          <h2
            className="h3 fw-semibold mb-0"
            style={{
              background: "linear-gradient(135deg, #198754 0%, #146c43 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Master Layanan & Paket
          </h2>
        </div>
        <p className="text-muted mb-0">
          Kelola katalog layanan fisioterapi dan baby spa, lengkap dengan
          durasi, tarif, dan status aktif.
        </p>
      </div>

      <Row className="g-4">
        <Col xl={4}>
          <Card className="shadow-soft border-0 h-100">
            <Card.Header
              style={{
                background: "linear-gradient(180deg, #ffffff 0%, #fafbfc 100%)",
              }}
            >
              <div className="d-flex align-items-center gap-2">
                <span style={{ fontSize: "1.3rem" }}>➕</span>
                <div>
                  <Card.Title className="h5 mb-0">Tambah Layanan</Card.Title>
                  <Card.Subtitle
                    className="text-muted mt-1"
                    style={{ fontSize: "0.85rem" }}
                  >
                    Atur layanan baru untuk ditawarkan.
                  </Card.Subtitle>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <Form
                onSubmit={handleSubmit}
                className="d-flex flex-column gap-3"
              >
                <Form.Group controlId="serviceName">
                  <Form.Label>Nama Layanan</Form.Label>
                  <Form.Control
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Contoh: Baby Spa Signature"
                    required
                  />
                </Form.Group>
                <Form.Group controlId="serviceCategory">
                  <Form.Label>Kategori</Form.Label>
                  <Form.Control
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Baby Spa / Fisioterapi / Terapi Wicara"
                    required
                  />
                </Form.Group>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group controlId="serviceDuration">
                      <Form.Label>Durasi (menit)</Form.Label>
                      <Form.Control
                        type="number"
                        min={15}
                        step={5}
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="servicePrice">
                      <Form.Label>Harga (IDR)</Form.Label>
                      <Form.Control
                        type="number"
                        min={0}
                        step={5000}
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group controlId="serviceDescription">
                  <Form.Label>Deskripsi</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Highlight manfaat layanan"
                  />
                </Form.Group>
                <Form.Check
                  type="switch"
                  id="serviceActive"
                  name="active"
                  label="Layanan aktif dan dapat dipesan"
                  checked={formData.active}
                  onChange={handleChange}
                />
                <div className="d-grid">
                  <Button type="submit" variant="primary">
                    Simpan Layanan
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={8}>
          <Card className="shadow-soft border-0">
            <Card.Header
              style={{
                background: "linear-gradient(180deg, #ffffff 0%, #fafbfc 100%)",
              }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="d-flex align-items-center gap-2">
                    <span style={{ fontSize: "1.3rem" }}>📋</span>
                    <Card.Title className="h5 mb-0">Katalog Layanan</Card.Title>
                  </div>
                  <Card.Subtitle
                    className="text-muted mt-1"
                    style={{ fontSize: "0.85rem" }}
                  >
                    {services.length} layanan tersedia.
                  </Card.Subtitle>
                </div>
                <Badge bg="success" style={{ fontSize: "0.9rem" }}>
                  {services.filter((service) => service.active).length} aktif
                </Badge>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Layanan</th>
                    <th>Kategori</th>
                    <th>Durasi</th>
                    <th>Tarif</th>
                    <th>Status</th>
                    <th className="text-end">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service.id}>
                      <td>
                        <div className="fw-semibold">{service.name}</div>
                        <small className="text-muted">
                          {service.description}
                        </small>
                      </td>
                      <td>{service.category}</td>
                      <td>{service.duration} menit</td>
                      <td>{formatCurrency(service.price)}</td>
                      <td>
                        <Badge bg={service.active ? "success" : "secondary"}>
                          {service.active ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </td>
                      <td className="text-end">
                        <div className="d-inline-flex gap-2">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => openModal(service)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(service.id)}
                          >
                            Hapus
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!services.length && (
                    <tr>
                      <td colSpan={6} className="text-center text-muted py-4">
                        Belum ada layanan terdaftar.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={closeModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Perbarui Layanan</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdate}>
          <Modal.Body className="d-flex flex-column gap-3">
            <Form.Group controlId="editServiceName">
              <Form.Label>Nama Layanan</Form.Label>
              <Form.Control
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="editServiceCategory">
              <Form.Label>Kategori</Form.Label>
              <Form.Control
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group controlId="editServiceDuration">
                  <Form.Label>Durasi (menit)</Form.Label>
                  <Form.Control
                    type="number"
                    min={15}
                    step={5}
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="editServicePrice">
                  <Form.Label>Harga (IDR)</Form.Label>
                  <Form.Control
                    type="number"
                    min={0}
                    step={5000}
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group controlId="editServiceDescription">
              <Form.Label>Deskripsi</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Check
              type="switch"
              id="editServiceActive"
              name="active"
              label="Layanan aktif"
              checked={formData.active}
              onChange={handleChange}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={closeModal}>
              Batal
            </Button>
            <Button type="submit" variant="primary">
              Simpan Perubahan
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default MasterLayanan;
