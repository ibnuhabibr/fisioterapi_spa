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
    <div className="d-flex flex-column gap-4 fade-in-up">
      <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-2">
            <span style={{ fontSize: '2rem' }}>⚙️</span>
            <h2 className="h3 fw-semibold mb-0" style={{
              background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Pengaturan Sistem
            </h2>
          </div>
          <p className="text-muted mb-0">
            Sesuaikan profil klinik, preferensi otomatisasi, dan pengingat
            pasien.
          </p>
        </div>
        <Button
          variant="danger"
          size="lg"
          onClick={handleReset}
          className="d-flex align-items-center gap-2"
          style={{
            boxShadow: '0 4px 12px rgba(220, 53, 69, 0.3)'
          }}
        >
          🔄 Reset ke Data Awal
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

      <Card className="shadow-soft border-0 border-start border-info border-4">
        <Card.Body className="p-4">
          <div className="d-flex align-items-start gap-3">
            <div className="bg-info bg-opacity-10 p-3 rounded-3">
              <span style={{ fontSize: '2rem' }}>ℹ️</span>
            </div>
            <div className="flex-grow-1">
              <h5 className="fw-semibold mb-2">Tentang Reset Data</h5>
              <p className="text-muted mb-3">
                Fitur <strong>"Reset ke Data Awal"</strong> akan mengembalikan semua data sistem
                ke kondisi awal (seed data) yang berisi contoh data pasien, pegawai, layanan,
                kunjungan, dan transaksi.
              </p>
              <div className="alert alert-warning mb-3">
                <strong>⚠️ Peringatan:</strong> Semua data yang telah Anda tambahkan atau ubah
                akan <strong>dihapus permanen</strong> dan tidak dapat dikembalikan.
              </div>
              <div className="bg-light p-3 rounded">
                <p className="mb-2"><strong>Data yang akan direset:</strong></p>
                <ul className="mb-2">
                  <li>✓ 4 Pasien contoh</li>
                  <li>✓ 4 Pegawai/Terapis</li>
                  <li>✓ 4 Layanan fisioterapi & baby spa</li>
                  <li>✓ 4 Kunjungan dengan berbagai status</li>
                  <li>✓ 4 Transaksi (Oktober & November 2025)</li>
                  <li>✓ Pengaturan klinik default</li>
                  <li>✓ Notifikasi sistem</li>
                </ul>
                <p className="text-muted mb-0 small">
                  <strong>💡 Tip:</strong> Gunakan fitur ini jika data production Anda sudah tidak sinkron
                  dengan data development, atau jika Anda ingin memulai dari awal dengan data bersih.
                </p>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Pengaturan;
