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

const emptyEmployee = {
  name: "",
  role: "",
  specialization: "",
  phone: "",
  email: "",
  status: "Aktif",
  certifications: "",
};

const MasterPegawai = () => {
  const { state, addEmployee, updateEmployee, deleteEmployee } =
    useContext(GlobalContext);
  const [formData, setFormData] = useState(emptyEmployee);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const employees = useMemo(
    () =>
      [...state.employees].sort(
        (a, b) => new Date(b.joinedAt ?? 0) - new Date(a.joinedAt ?? 0)
      ),
    [state.employees]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.name.trim()) return;

    addEmployee({
      ...formData,
      certifications: formData.certifications
        ? formData.certifications.split(",").map((item) => item.trim())
        : [],
    });
    setFormData(emptyEmployee);
  };

  const openModal = (employee) => {
    setSelectedEmployee(employee);
    setFormData({
      name: employee.name,
      role: employee.role,
      specialization: employee.specialization ?? "",
      phone: employee.phone ?? "",
      email: employee.email ?? "",
      status: employee.status ?? "Aktif",
      certifications: (employee.certifications ?? []).join(", "),
    });
    setShowModal(true);
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    if (!selectedEmployee) return;

    updateEmployee(selectedEmployee.id, {
      ...selectedEmployee,
      ...formData,
      certifications: formData.certifications
        ? formData.certifications.split(",").map((item) => item.trim())
        : [],
    });
    setShowModal(false);
    setSelectedEmployee(null);
    setFormData(emptyEmployee);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm("Hapus data pegawai ini?");
    if (confirmed) {
      deleteEmployee(id);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
    setFormData(emptyEmployee);
  };

  return (
    <div className="d-flex flex-column gap-4 fade-in-up">
      <div>
        <div className="d-flex align-items-center gap-2 mb-2">
          <span style={{ fontSize: "2rem" }}>👨‍⚕️</span>
          <h2
            className="h3 fw-semibold mb-0"
            style={{
              background: "linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Master Data Pegawai
          </h2>
        </div>
        <p className="text-muted mb-0">
          Kelola informasi pegawai, terapis, dan staff administrasi klinik.
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
                  <Card.Title className="h5 mb-0">Tambah Pegawai</Card.Title>
                  <Card.Subtitle
                    className="text-muted mt-1"
                    style={{ fontSize: "0.85rem" }}
                  >
                    Lengkapi profil pegawai atau terapis.
                  </Card.Subtitle>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <Form
                onSubmit={handleSubmit}
                className="d-flex flex-column gap-3"
              >
                <Form.Group controlId="employeeName">
                  <Form.Label>Nama Lengkap</Form.Label>
                  <Form.Control
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Contoh: dr. Maria Oktaviani"
                    required
                  />
                </Form.Group>
                <Form.Group controlId="employeeRole">
                  <Form.Label>Peran</Form.Label>
                  <Form.Control
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="Fisioterapis / Terapis Baby Spa / Administrasi"
                    required
                  />
                </Form.Group>
                <Form.Group controlId="employeeSpecialization">
                  <Form.Label>Spesialisasi</Form.Label>
                  <Form.Control
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    placeholder="Contoh: Neurologi Pediatrik"
                  />
                </Form.Group>
                <Form.Group controlId="employeePhone">
                  <Form.Label>Nomor Telepon</Form.Label>
                  <Form.Control
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0812-xxxx-xxxx"
                    required
                  />
                </Form.Group>
                <Form.Group controlId="employeeEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="nama@fisiomed.id"
                  />
                </Form.Group>
                <Form.Group controlId="employeeStatus">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Cuti">Cuti</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group controlId="employeeCertifications">
                  <Form.Label>Sertifikasi</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="certifications"
                    value={formData.certifications}
                    onChange={handleChange}
                    placeholder="Pisahkan dengan koma, contoh: STR, Bobath"
                  />
                </Form.Group>
                <div className="d-grid">
                  <Button type="submit" variant="primary">
                    Simpan Pegawai
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
                    <Card.Title className="h5 mb-0">Daftar Pegawai</Card.Title>
                  </div>
                  <Card.Subtitle
                    className="text-muted mt-1"
                    style={{ fontSize: "0.85rem" }}
                  >
                    {employees.length} pegawai terdaftar di sistem.
                  </Card.Subtitle>
                </div>
                <Badge bg="primary" style={{ fontSize: "0.9rem" }}>
                  {employees.filter((emp) => emp.status === "Aktif").length}{" "}
                  aktif
                </Badge>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Nama</th>
                    <th>Kontak</th>
                    <th>Spesialisasi</th>
                    <th>Status</th>
                    <th className="text-end">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id}>
                      <td>
                        <div className="fw-semibold">{employee.name}</div>
                        <small className="text-muted">{employee.role}</small>
                      </td>
                      <td>
                        <div>{employee.phone}</div>
                        <small className="text-muted">{employee.email}</small>
                      </td>
                      <td>
                        <div>{employee.specialization || "-"}</div>
                        <small className="text-muted">
                          {(employee.certifications ?? []).join(", ") ||
                            "Belum ada sertifikasi"}
                        </small>
                      </td>
                      <td>
                        <Badge
                          bg={
                            employee.status === "Aktif"
                              ? "success"
                              : employee.status === "Cuti"
                              ? "warning"
                              : "secondary"
                          }
                        >
                          {employee.status}
                        </Badge>
                      </td>
                      <td className="text-end">
                        <div className="d-inline-flex gap-2">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => openModal(employee)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(employee.id)}
                          >
                            Hapus
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!employees.length && (
                    <tr>
                      <td colSpan={5} className="text-center text-muted py-4">
                        Belum ada data pegawai.
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
          <Modal.Title>Perbarui Data Pegawai</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdate}>
          <Modal.Body className="d-flex flex-column gap-3">
            <Row className="g-3">
              <Col md={6}>
                <Form.Group controlId="editEmployeeName">
                  <Form.Label>Nama Lengkap</Form.Label>
                  <Form.Control
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="editEmployeeRole">
                  <Form.Label>Peran</Form.Label>
                  <Form.Control
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="editEmployeeSpecialization">
                  <Form.Label>Spesialisasi</Form.Label>
                  <Form.Control
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="editEmployeePhone">
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
            <Form.Group controlId="editEmployeeEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group controlId="editEmployeeStatus">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Cuti">Cuti</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="editEmployeeCertifications">
                  <Form.Label>Sertifikasi</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="certifications"
                    value={formData.certifications}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
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

export default MasterPegawai;
