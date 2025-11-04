import { useContext, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { GlobalContext } from "../context/GlobalState.jsx";

const Pengaturan = () => {
  const { state, updateSettings, resetToSeed } = useContext(GlobalContext);
  const [formData, setFormData] = useState(state.settings);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateSettings(formData);
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      "Kembalikan semua data ke kondisi awal (mock data)? Semua perubahan akan hilang."
    );
    if (confirmed) {
      resetToSeed();
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
        <div>
          <h2 className="h3 fw-semibold mb-1 text-primary">
            Pengaturan Sistem
          </h2>
          <p className="text-muted mb-0">
            Sesuaikan profil klinik, preferensi otomatisasi, dan pengingat
            pasien.
          </p>
        </div>
        <Button variant="outline-danger" onClick={handleReset}>
          Reset ke Data Awal
        </Button>
      </div>

      <Card className="shadow-sm border-0">
        <Card.Header className="bg-white">
          <Card.Title className="h5 mb-0">Profil Klinik</Card.Title>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
            <Row className="g-3">
              <Col md={6}>
                <Form.Group controlId="clinicName">
                  <Form.Label>Nama Klinik</Form.Label>
                  <Form.Control
                    name="clinicName"
                    value={formData.clinicName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="clinicPhone">
                  <Form.Label>Nomor Telepon</Form.Label>
                  <Form.Control
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group controlId="clinicEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="clinicOperatingHours">
                  <Form.Label>Jam Operasional</Form.Label>
                  <Form.Control
                    name="operatingHours"
                    value={formData.operatingHours}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group controlId="clinicAddress">
              <Form.Label>Alamat</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Row className="g-3">
              <Col md={4}>
                <Form.Check
                  type="switch"
                  id="autoAssignTherapist"
                  name="autoAssignTherapist"
                  label="Auto-assign terapis berdasarkan beban kerja"
                  checked={formData.autoAssignTherapist}
                  onChange={handleChange}
                />
              </Col>
              <Col md={4}>
                <Form.Check
                  type="switch"
                  id="sendDailySummary"
                  name="sendDailySummary"
                  label="Kirim ringkasan harian ke email admin"
                  checked={formData.sendDailySummary}
                  onChange={handleChange}
                />
              </Col>
              <Col md={4}>
                <Form.Check
                  type="switch"
                  id="whatsappReminder"
                  name="whatsappReminder"
                  label="Aktifkan pengingat WhatsApp untuk pasien"
                  checked={formData.whatsappReminder}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-2">
              <Button type="submit" variant="primary">
                Simpan Pengaturan
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Pengaturan;
