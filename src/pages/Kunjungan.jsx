import { useContext, useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  Modal,
  ProgressBar,
  Row,
  Table,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { GlobalContext } from "../context/GlobalState.jsx";

const initialVisitForm = {
  patientId: "",
  therapistId: "",
  serviceIds: [],
  scheduledAt: "",
  status: "Terjadwal",
  paymentStatus: "Belum Bayar",
  paymentMethod: "Transfer BCA", // 🆕 Default payment method untuk auto-transaction
  notes: "",
  progress: 0,
};

const statusOptions = ["Terjadwal", "Proses", "Selesai", "Batal"];
const paymentOptions = ["Belum Bayar", "DP 50%", "Lunas"];
const paymentMethodOptions = [
  "Transfer BCA",
  "Transfer Mandiri",
  "Cash",
  "Debit Card",
  "QRIS",
  "OVO",
  "GoPay",
  "ShopeePay",
]; // 🆕 Method pembayaran

const formatDateTime = (value) =>
  value
    ? new Date(value).toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "-";

const Kunjungan = () => {
  const { state, addVisit, updateVisit, deleteVisit } =
    useContext(GlobalContext);
  const { patients, employees, services, visits } = state;

  const [formData, setFormData] = useState(initialVisitForm);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const sortedVisits = useMemo(
    () =>
      [...visits].sort(
        (a, b) =>
          new Date(b.scheduledAt ?? 0).getTime() -
          new Date(a.scheduledAt ?? 0).getTime()
      ),
    [visits]
  );

  const totalAmount = useMemo(() => {
    if (!formData.serviceIds.length) return 0;
    return formData.serviceIds.reduce((sum, serviceId) => {
      const service = services.find((item) => item.id === serviceId);
      return service ? sum + service.price : sum;
    }, 0);
  }, [formData.serviceIds, services]);

  const getPatientName = (id) =>
    patients.find((patient) => patient.id === id)?.name ?? "-";
  const getTherapistName = (id) =>
    employees.find((employee) => employee.id === id)?.name ?? "-";
  const describeServices = (ids) =>
    ids
      .map(
        (serviceId) =>
          services.find((service) => service.id === serviceId)?.name ?? "-"
      )
      .join(", ");

  const handleChange = (event) => {
    const { name, value, type, checked, options } = event.target;
    if (type === "select-multiple") {
      const values = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);
      setFormData((prev) => ({ ...prev, [name]: values }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (
      !formData.patientId ||
      !formData.therapistId ||
      !formData.serviceIds.length
    ) {
      return;
    }

    addVisit({
      ...formData,
      total: totalAmount,
    });
    setFormData(initialVisitForm);
  };

  const openModal = (visit) => {
    setSelectedVisit(visit);
    setFormData({
      patientId: visit.patientId,
      therapistId: visit.therapistId,
      serviceIds: visit.serviceIds,
      scheduledAt: visit.scheduledAt?.slice(0, 16) ?? "",
      status: visit.status,
      paymentStatus: visit.paymentStatus,
      paymentMethod: visit.paymentMethod ?? "Transfer BCA", // 🆕 Load payment method
      notes: visit.notes ?? "",
      progress: visit.progress ?? 0,
    });
    setShowModal(true);
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    if (!selectedVisit) return;

    updateVisit(selectedVisit.id, {
      ...selectedVisit,
      ...formData,
      total: totalAmount,
    });
    setShowModal(false);
    setSelectedVisit(null);
    setFormData(initialVisitForm);
  };

  const resetForm = () => {
    setFormData(initialVisitForm);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm("Hapus jadwal kunjungan ini?");
    if (confirmed) {
      deleteVisit(id);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedVisit(null);
    setFormData(initialVisitForm);
  };

  return (
    <div className="d-flex flex-column gap-4 fade-in-up">
      <div>
        <div className="d-flex align-items-center gap-2 mb-2">
          <span style={{ fontSize: "2rem" }}>📅</span>
          <h2
            className="h3 fw-semibold mb-0"
            style={{
              background: "linear-gradient(135deg, #6f42c1 0%, #5a32a3 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Manajemen Kunjungan
          </h2>
        </div>
        <p className="text-muted mb-0">
          Jadwalkan sesi fisioterapi dan baby spa, pantau status pembayaran,
          serta progres program pasien.
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
                    Jadwalkan Kunjungan
                  </Card.Title>
                  <Card.Subtitle
                    className="text-muted mt-1"
                    style={{ fontSize: "0.85rem" }}
                  >
                    Pastikan data pasien dan layanan lengkap.
                  </Card.Subtitle>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <Form
                onSubmit={handleSubmit}
                className="d-flex flex-column gap-3"
              >
                <Form.Group controlId="visitPatient">
                  <Form.Label>Pasien</Form.Label>
                  <Form.Select
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Pilih pasien</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name} ({patient.membership})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group controlId="visitTherapist">
                  <Form.Label>Terapis</Form.Label>
                  <Form.Select
                    name="therapistId"
                    value={formData.therapistId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Pilih terapis</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name} ({employee.role})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group controlId="visitServices">
                  <Form.Label>Layanan</Form.Label>
                  <Form.Select
                    name="serviceIds"
                    multiple
                    value={formData.serviceIds}
                    onChange={handleChange}
                    required
                  >
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name} ({service.duration} menit)
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Tekan Ctrl/Cmd untuk memilih lebih dari satu layanan.
                  </Form.Text>
                </Form.Group>
                <Form.Group controlId="visitSchedule">
                  <Form.Label>Jadwal</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="scheduledAt"
                    value={formData.scheduledAt}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group controlId="visitStatus">
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="visitPaymentStatus">
                      <Form.Label>Status Pembayaran</Form.Label>
                      <Form.Select
                        name="paymentStatus"
                        value={formData.paymentStatus}
                        onChange={handleChange}
                      >
                        {paymentOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Text className="text-muted">
                        💡 <strong>Otomatis:</strong> Jika pilih DP/Lunas,
                        transaksi akan dibuat otomatis.
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  {/* 🆕 PAYMENT METHOD - Muncul jika ada pembayaran */}
                  {formData.paymentStatus !== "Belum Bayar" && (
                    <Col md={6}>
                      <Form.Group controlId="visitPaymentMethod">
                        <Form.Label>
                          <span className="text-danger">*</span> Metode
                          Pembayaran
                        </Form.Label>
                        <Form.Select
                          name="paymentMethod"
                          value={formData.paymentMethod}
                          onChange={handleChange}
                          required
                        >
                          {paymentMethodOptions.map((method) => (
                            <option key={method} value={method}>
                              {method}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Text className="text-info">
                          🏦 Pilih metode pembayaran yang digunakan pasien.
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  )}
                </Row>
                <Form.Group controlId="visitProgress">
                  <Form.Label>Progress Program (%)</Form.Label>
                  <Form.Range
                    name="progress"
                    value={formData.progress}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        progress: Number(event.target.value),
                      }))
                    }
                  />
                  <div className="text-muted">{formData.progress}% selesai</div>
                </Form.Group>
                <Form.Group controlId="visitNotes">
                  <Form.Label>Catatan</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Highlight fokus terapi di sesi ini"
                  />
                </Form.Group>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-muted">Total estimasi</span>
                    <div className="h5 fw-semibold mb-0">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        maximumFractionDigits: 0,
                      }).format(totalAmount)}
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-secondary"
                      type="button"
                      onClick={resetForm}
                    >
                      Reset
                    </Button>
                    <Button type="submit" variant="primary">
                      Simpan Jadwal
                    </Button>
                  </div>
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
                    <Card.Title className="h5 mb-0">
                      Daftar Kunjungan
                    </Card.Title>
                  </div>
                  <Card.Subtitle
                    className="text-muted mt-1"
                    style={{ fontSize: "0.85rem" }}
                  >
                    {sortedVisits.length} jadwal fisioterapi dan baby spa
                    tercatat.
                  </Card.Subtitle>
                </div>
                <Badge bg="primary" style={{ fontSize: "0.9rem" }}>
                  {
                    sortedVisits.filter((visit) => visit.status === "Terjadwal")
                      .length
                  }{" "}
                  terjadwal
                </Badge>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Jadwal</th>
                    <th>Pasien</th>
                    <th>Layanan</th>
                    <th>Status</th>
                    <th>Pembayaran</th>
                    <th className="text-end">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedVisits.map((visit) => (
                    <tr key={visit.id}>
                      <td>
                        <div className="fw-semibold">
                          {formatDateTime(visit.scheduledAt)}
                        </div>
                        <small className="text-muted">
                          {getTherapistName(visit.therapistId)}
                        </small>
                      </td>
                      <td>
                        <div className="fw-semibold">
                          {getPatientName(visit.patientId)}
                        </div>
                        <small className="text-muted">
                          Progress {visit.progress ?? 0}%
                        </small>
                        <ProgressBar
                          now={visit.progress ?? 0}
                          className="mt-2"
                          style={{ height: "6px" }}
                        />
                      </td>
                      <td>{describeServices(visit.serviceIds)}</td>
                      <td>
                        <Badge
                          bg={
                            visit.status === "Selesai"
                              ? "success"
                              : visit.status === "Proses"
                              ? "info"
                              : visit.status === "Batal"
                              ? "secondary"
                              : "warning"
                          }
                        >
                          {visit.status}
                        </Badge>
                      </td>
                      <td>
                        <Badge
                          bg={
                            visit.paymentStatus === "Lunas"
                              ? "success"
                              : visit.paymentStatus.includes("DP")
                              ? "info"
                              : "danger"
                          }
                        >
                          {visit.paymentStatus}
                        </Badge>
                        <div className="fw-semibold mt-1">
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0,
                          }).format(visit.total ?? 0)}
                        </div>
                      </td>
                      <td className="text-end">
                        <div className="d-inline-flex gap-2">
                          <Button
                            as={Link}
                            to={`/kunjungan/${visit.id}`}
                            variant="outline-primary"
                            size="sm"
                          >
                            Detail
                          </Button>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => openModal(visit)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(visit.id)}
                          >
                            Hapus
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!sortedVisits.length && (
                    <tr>
                      <td colSpan={6} className="text-center text-muted py-4">
                        Belum ada jadwal kunjungan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={closeModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Perbarui Kunjungan</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdate}>
          <Modal.Body className="d-flex flex-column gap-3">
            <Row className="g-3">
              <Col md={6}>
                <Form.Group controlId="editVisitPatient">
                  <Form.Label>Pasien</Form.Label>
                  <Form.Select
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleChange}
                    required
                  >
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="editVisitTherapist">
                  <Form.Label>Terapis</Form.Label>
                  <Form.Select
                    name="therapistId"
                    value={formData.therapistId}
                    onChange={handleChange}
                    required
                  >
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group controlId="editVisitServices">
              <Form.Label>Layanan</Form.Label>
              <Form.Select
                name="serviceIds"
                multiple
                value={formData.serviceIds}
                onChange={handleChange}
                required
              >
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group controlId="editVisitSchedule">
                  <Form.Label>Jadwal</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="scheduledAt"
                    value={formData.scheduledAt}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="editVisitStatus">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="editVisitPaymentStatus">
                  <Form.Label>Status Pembayaran</Form.Label>
                  <Form.Select
                    name="paymentStatus"
                    value={formData.paymentStatus}
                    onChange={handleChange}
                  >
                    {paymentOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    ⚠️ Edit manual, transaksi otomatis tidak dibuat ulang.
                  </Form.Text>
                </Form.Group>
              </Col>
              {/* 🆕 PAYMENT METHOD di Modal Edit */}
              {formData.paymentStatus !== "Belum Bayar" && (
                <Col md={3}>
                  <Form.Group controlId="editVisitPaymentMethod">
                    <Form.Label>Metode</Form.Label>
                    <Form.Select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleChange}
                    >
                      {paymentMethodOptions.map((method) => (
                        <option key={method} value={method}>
                          {method}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              )}
            </Row>
            <Form.Group controlId="editVisitProgress">
              <Form.Label>Progress Program (%)</Form.Label>
              <Form.Range
                name="progress"
                value={formData.progress}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    progress: Number(event.target.value),
                  }))
                }
              />
              <div className="text-muted">{formData.progress}% selesai</div>
            </Form.Group>
            <Form.Group controlId="editVisitNotes">
              <Form.Label>Catatan</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="notes"
                value={formData.notes}
                onChange={handleChange}
              />
            </Form.Group>
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-muted">Total estimasi</span>
              <strong>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumFractionDigits: 0,
                }).format(totalAmount)}
              </strong>
            </div>
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

export default Kunjungan;
