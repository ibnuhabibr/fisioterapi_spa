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

const emptyPatientForm = {
  name: "",
  birthDate: "",
  guardianName: "",
  phone: "",
  address: "",
  membership: "Reguler",
  notes: "",
};

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("id-ID", { dateStyle: "medium" })
    : "-";

const MasterPasien = () => {
  const { state, addPatient, updatePatient, deletePatient } =
    useContext(GlobalContext);
  const [formData, setFormData] = useState(emptyPatientForm);
  const [editingPatient, setEditingPatient] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const patients = useMemo(
    () =>
      [...state.patients].sort(
        (a, b) =>
          new Date(b.updatedAt ?? b.createdAt ?? 0) -
          new Date(a.updatedAt ?? a.createdAt ?? 0)
      ),
    [state.patients]
  );

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = (event) => {
    event.preventDefault();
    if (!formData.name?.trim()) {
      return;
    }

    addPatient({
      ...formData,
      lastVisit: null,
    });
    setFormData(emptyPatientForm);
  };

  const openEditModal = (patient) => {
    setEditingPatient(patient);
    setFormData({
      name: patient.name,
      birthDate: patient.birthDate?.slice(0, 10) ?? "",
      guardianName: patient.guardianName ?? "",
      phone: patient.phone ?? "",
      address: patient.address ?? "",
      membership: patient.membership ?? "Reguler",
      notes: patient.notes ?? "",
    });
    setShowModal(true);
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    if (!editingPatient) return;

    updatePatient(editingPatient.id, {
      ...editingPatient,
      ...formData,
    });
    setEditingPatient(null);
    setShowModal(false);
    setFormData(emptyPatientForm);
  };

  const cancelEdit = () => {
    setEditingPatient(null);
    setShowModal(false);
    setFormData(emptyPatientForm);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Hapus data pasien ini?");
    if (confirmDelete) {
      deletePatient(id);
    }
  };

  return (
    <div className="d-flex flex-column gap-4 fade-in-up">
      <div>
        <div className="d-flex align-items-center gap-2 mb-2">
          <span style={{ fontSize: "2rem" }}>👥</span>
          <h2
            className="h3 fw-semibold mb-0"
            style={{
              background: "linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Master Data Pasien
          </h2>
        </div>
        <p className="text-muted mb-0">
          Kelola informasi pasien klinik, termasuk data wali, catatan medis, dan
          status membership.
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
                  <Card.Title className="h5 mb-0">
                    Tambah Pasien Baru
                  </Card.Title>
                  <Card.Subtitle
                    className="text-muted mt-1"
                    style={{ fontSize: "0.85rem" }}
                  >
                    Lengkapi data dasar pasien.
                  </Card.Subtitle>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <Form
                onSubmit={handleCreate}
                className="d-flex flex-column gap-3"
              >
                <Form.Group controlId="name">
                  <Form.Label>Nama Pasien</Form.Label>
                  <Form.Control
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Contoh: Clarissa Putri"
                    required
                  />
                </Form.Group>
                <Form.Group controlId="birthDate">
                  <Form.Label>Tanggal Lahir</Form.Label>
                  <Form.Control
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="guardianName">
                  <Form.Label>Nama Wali</Form.Label>
                  <Form.Control
                    name="guardianName"
                    value={formData.guardianName}
                    onChange={handleInputChange}
                    placeholder="Nama orang tua/wali"
                  />
                </Form.Group>
                <Form.Group controlId="phone">
                  <Form.Label>Nomor Kontak</Form.Label>
                  <Form.Control
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="0812-xxxx-xxxx"
                    required
                  />
                </Form.Group>
                <Form.Group controlId="address">
                  <Form.Label>Alamat</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Alamat domisili"
                  />
                </Form.Group>
                <Form.Group controlId="membership">
                  <Form.Label>Membership</Form.Label>
                  <Form.Select
                    name="membership"
                    value={formData.membership}
                    onChange={handleInputChange}
                  >
                    <option value="Reguler">Reguler</option>
                    <option value="Premium">Premium</option>
                    <option value="Corporate">Corporate</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group controlId="notes">
                  <Form.Label>Catatan Klinis</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Riwayat singkat terapi dan fokus utama"
                  />
                </Form.Group>
                <div className="d-grid">
                  <Button type="submit" variant="primary">
                    Simpan Pasien
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={8}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <div>
                <Card.Title className="h5 mb-0">Daftar Pasien</Card.Title>
                <Card.Subtitle className="text-muted">
                  Total {patients.length} pasien terdaftar dengan histori
                  kunjungan.
                </Card.Subtitle>
              </div>
              <Badge bg="primary">{patients.length} aktif</Badge>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Pasien</th>
                    <th>Kontak</th>
                    <th>Membership</th>
                    <th>Kunjungan Terakhir</th>
                    <th className="text-end">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient.id}>
                      <td>
                        <div className="fw-semibold">{patient.name}</div>
                        <small className="text-muted">
                          Wali: {patient.guardianName || "-"}
                        </small>
                      </td>
                      <td>
                        <div>{patient.phone}</div>
                        <small className="text-muted">{patient.address}</small>
                      </td>
                      <td>
                        <Badge
                          bg={
                            patient.membership === "Premium"
                              ? "warning"
                              : patient.membership === "Corporate"
                              ? "info"
                              : "secondary"
                          }
                        >
                          {patient.membership}
                        </Badge>
                      </td>
                      <td>
                        <div>{formatDate(patient.lastVisit)}</div>
                        <small className="text-muted">
                          {patient.notes || "Tidak ada catatan"}
                        </small>
                      </td>
                      <td className="text-end">
                        <div className="d-inline-flex gap-2">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => openEditModal(patient)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(patient.id)}
                          >
                            Hapus
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!patients.length && (
                    <tr>
                      <td colSpan={5} className="text-center text-muted py-4">
                        Belum ada data pasien.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={cancelEdit} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Perbarui Data Pasien</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdate}>
          <Modal.Body className="d-flex flex-column gap-3">
            <Row className="g-3">
              <Col md={6}>
                <Form.Group controlId="editName">
                  <Form.Label>Nama Pasien</Form.Label>
                  <Form.Control
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="editBirthDate">
                  <Form.Label>Tanggal Lahir</Form.Label>
                  <Form.Control
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="editGuardian">
                  <Form.Label>Nama Wali</Form.Label>
                  <Form.Control
                    name="guardianName"
                    value={formData.guardianName}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="editPhone">
                  <Form.Label>Nomor Kontak</Form.Label>
                  <Form.Control
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group controlId="editAddress">
              <Form.Label>Alamat</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="editMembership">
              <Form.Label>Membership</Form.Label>
              <Form.Select
                name="membership"
                value={formData.membership}
                onChange={handleInputChange}
              >
                <option value="Reguler">Reguler</option>
                <option value="Premium">Premium</option>
                <option value="Corporate">Corporate</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="editNotes">
              <Form.Label>Catatan Klinis</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={cancelEdit}>
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

export default MasterPasien;
