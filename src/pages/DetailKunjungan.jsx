import { useContext, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Form,
  ListGroup,
  Modal,
  Row,
} from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GlobalContext } from "../context/GlobalState.jsx";

const statusOptions = ["Terjadwal", "Proses", "Selesai", "Batal"];
const paymentOptions = ["Belum Bayar", "DP 50%", "Lunas"];

const formatCurrency = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const formatDateTime = (value) =>
  new Date(value).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });

const DetailKunjungan = () => {
  const navigate = useNavigate();
  const { visitId } = useParams();
  const {
    state,
    updateVisit,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useContext(GlobalContext);

  const visit = state.visits.find((item) => item.id === visitId);
  const patient = state.patients.find((item) => item.id === visit?.patientId);
  const therapist = state.employees.find(
    (item) => item.id === visit?.therapistId
  );
  const services = useMemo(
    () =>
      visit
        ? visit.serviceIds
            .map((serviceId) =>
              state.services.find((service) => service.id === serviceId)
            )
            .filter(Boolean)
        : [],
    [state.services, visit]
  );
  const transactions = useMemo(
    () =>
      state.transactions.filter(
        (transaction) => transaction.visitId === visitId
      ),
    [state.transactions, visitId]
  );

  const [formData, setFormData] = useState({
    status: visit?.status ?? "Terjadwal",
    paymentStatus: visit?.paymentStatus ?? "Belum Bayar",
    progress: visit?.progress ?? 0,
    notes: visit?.notes ?? "",
  });

  const [transactionForm, setTransactionForm] = useState({
    amount: visit?.total ?? 0,
    method: "Transfer BCA",
    status: "Lunas",
    notes: "",
  });

  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  useEffect(() => {
    if (!visit) return;
    setFormData({
      status: visit.status,
      paymentStatus: visit.paymentStatus,
      progress: visit.progress ?? 0,
      notes: visit.notes ?? "",
    });
    setTransactionForm((prev) => ({
      ...prev,
      amount: visit.total ?? prev.amount ?? 0,
    }));
  }, [visit]);

  if (!visit) {
    return (
      <Alert variant="warning" className="shadow-sm border-0">
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
          <div>
            <Alert.Heading className="h5 mb-1">
              Kunjungan tidak ditemukan
            </Alert.Heading>
            <p className="mb-0 text-muted">
              Jadwal yang Anda cari mungkin telah dihapus.
            </p>
          </div>
          <Button as={Link} to="/kunjungan" variant="primary">
            Kembali ke daftar kunjungan
          </Button>
        </div>
      </Alert>
    );
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    updateVisit(visit.id, {
      ...visit,
      ...formData,
    });
  };

  const markAsCompleted = () => {
    updateVisit(visit.id, {
      ...visit,
      status: "Selesai",
      paymentStatus: "Lunas",
      progress: 100,
    });
  };

  const handleTransactionSubmit = (event) => {
    event.preventDefault();
    if (selectedTransaction) {
      updateTransaction(selectedTransaction.id, {
        ...selectedTransaction,
        ...transactionForm,
        amount: Number(transactionForm.amount) || 0,
      });
    } else {
      addTransaction({
        visitId: visit.id,
        patientId: visit.patientId,
        amount: Number(transactionForm.amount) || 0,
        method: transactionForm.method,
        status: transactionForm.status,
        notes: transactionForm.notes,
        reference: `INV-${new Date().getFullYear()}-${Math.floor(
          Math.random() * 900 + 100
        )}`,
      });
    }
    setShowTransactionModal(false);
    setSelectedTransaction(null);
    setTransactionForm({
      amount: visit.total ?? 0,
      method: "Transfer BCA",
      status: "Lunas",
      notes: "",
    });
  };

  const openTransactionModal = (transaction) => {
    if (transaction) {
      setSelectedTransaction(transaction);
      setTransactionForm({
        amount: transaction.amount,
        method: transaction.method,
        status: transaction.status,
        notes: transaction.notes ?? "",
      });
    } else {
      setSelectedTransaction(null);
      setTransactionForm({
        amount: visit.total ?? 0,
        method: "Transfer BCA",
        status: "Lunas",
        notes: "",
      });
    }
    setShowTransactionModal(true);
  };

  const handleDeleteTransaction = (id) => {
    const confirmed = window.confirm("Hapus transaksi ini?");
    if (confirmed) {
      deleteTransaction(id);
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
        <div>
          <h2 className="h3 fw-semibold mb-1 text-primary">Detail Kunjungan</h2>
          <p className="text-muted mb-0">
            Pantau progres terapi, transaksi, dan status pembayaran kunjungan
            ini.
          </p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" onClick={() => navigate(-1)}>
            Kembali
          </Button>
          <Button variant="success" onClick={markAsCompleted}>
            Tandai Selesai & Lunas
          </Button>
        </div>
      </div>

      <Row className="g-4">
        <Col xl={7}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-white">
              <Card.Title className="h5 mb-0">Informasi Pasien</Card.Title>
            </Card.Header>
            <Card.Body className="d-flex flex-column gap-3">
              <div className="d-flex flex-column flex-sm-row justify-content-between gap-3">
                <div>
                  <h3 className="h4 fw-semibold mb-1">{patient?.name}</h3>
                  <p className="text-muted mb-0">
                    Wali: {patient?.guardianName ?? "-"}
                  </p>
                </div>
                <Badge bg="primary" className="align-self-start">
                  {patient?.membership ?? "Reguler"}
                </Badge>
              </div>
              <Row className="g-3">
                <Col md={6}>
                  <div className="bg-light rounded-3 p-3">
                    <small className="text-muted d-block">Kontak</small>
                    <span className="fw-semibold">{patient?.phone ?? "-"}</span>
                    <small className="text-muted d-block mt-2">Alamat</small>
                    <span>{patient?.address ?? "-"}</span>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="bg-light rounded-3 p-3">
                    <small className="text-muted d-block">Terapis</small>
                    <span className="fw-semibold">
                      {therapist?.name ?? "-"}
                    </span>
                    <small className="text-muted d-block mt-2">
                      Spesialisasi
                    </small>
                    <span>{therapist?.specialization ?? "-"}</span>
                  </div>
                </Col>
              </Row>
              <div>
                <small className="text-muted d-block">Jadwal</small>
                <h4 className="h5 mb-0">{formatDateTime(visit.scheduledAt)}</h4>
              </div>
              <div>
                <small className="text-muted d-block">Layanan</small>
                <ListGroup variant="flush">
                  {services.map((service) => (
                    <ListGroup.Item key={service.id} className="px-0">
                      <div className="d-flex justify-content-between">
                        <span>{service.name}</span>
                        <span>{formatCurrency(service.price)}</span>
                      </div>
                      <small className="text-muted">
                        {service.duration} menit &middot; {service.category}
                      </small>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={5}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-white">
              <Card.Title className="h5 mb-0">Update Status</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form
                onSubmit={handleSubmit}
                className="d-flex flex-column gap-3"
              >
                <Form.Group controlId="visitStatus">
                  <Form.Label>Status Kunjungan</Form.Label>
                  <Form.Select
                    value={formData.status}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: event.target.value,
                      }))
                    }
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group controlId="visitPaymentStatus">
                  <Form.Label>Status Pembayaran</Form.Label>
                  <Form.Select
                    value={formData.paymentStatus}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        paymentStatus: event.target.value,
                      }))
                    }
                  >
                    {paymentOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group controlId="visitProgress">
                  <Form.Label>Progress Program</Form.Label>
                  <Form.Range
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
                  <Form.Label>Catatan Evaluasi</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={formData.notes}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        notes: event.target.value,
                      }))
                    }
                    placeholder="Masukkan hasil evaluasi sesi dan rencana tindak lanjut."
                  />
                </Form.Group>
                <div className="d-grid">
                  <Button type="submit" variant="primary">
                    Simpan Pembaruan
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm border-0">
        <Card.Header className="bg-white d-flex justify-content-between align-items-center">
          <div>
            <Card.Title className="h5 mb-0">Transaksi Pembayaran</Card.Title>
            <Card.Subtitle className="text-muted">
              {transactions.length} transaksi terkait kunjungan ini.
            </Card.Subtitle>
          </div>
          <Button
            variant="outline-primary"
            onClick={() => openTransactionModal(null)}
          >
            Tambah Transaksi
          </Button>
        </Card.Header>
        <Card.Body className="p-0">
          <ListGroup variant="flush">
            {transactions.map((transaction) => (
              <ListGroup.Item key={transaction.id} className="py-3 px-4">
                <div className="d-flex flex-column flex-md-row justify-content-between gap-3 align-items-md-center">
                  <div>
                    <h6 className="mb-1">{transaction.reference}</h6>
                    <small className="text-muted">
                      {formatDateTime(transaction.issuedAt)} &middot;{" "}
                      {transaction.method}
                    </small>
                    <p className="mb-0 text-muted">
                      {transaction.notes || "Tidak ada catatan tambahan."}
                    </p>
                  </div>
                  <div className="text-md-end">
                    <h5 className="fw-semibold mb-1">
                      {formatCurrency(transaction.amount)}
                    </h5>
                    <Badge
                      bg={
                        transaction.status === "Lunas"
                          ? "success"
                          : transaction.status === "DP"
                          ? "warning"
                          : "secondary"
                      }
                    >
                      {transaction.status}
                    </Badge>
                    <div className="d-flex gap-2 mt-2 justify-content-md-end">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => openTransactionModal(transaction)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteTransaction(transaction.id)}
                      >
                        Hapus
                      </Button>
                    </div>
                  </div>
                </div>
              </ListGroup.Item>
            ))}
            {!transactions.length && (
              <ListGroup.Item className="py-4 text-center text-muted">
                Belum ada transaksi tercatat.
              </ListGroup.Item>
            )}
          </ListGroup>
        </Card.Body>
      </Card>

      <Modal
        show={showTransactionModal}
        onHide={() => setShowTransactionModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedTransaction ? "Edit Transaksi" : "Tambah Transaksi"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleTransactionSubmit}>
          <Modal.Body className="d-flex flex-column gap-3">
            <Form.Group controlId="transactionAmount">
              <Form.Label>Nominal (IDR)</Form.Label>
              <Form.Control
                type="number"
                min={0}
                step={5000}
                value={transactionForm.amount}
                onChange={(event) =>
                  setTransactionForm((prev) => ({
                    ...prev,
                    amount: Number(event.target.value),
                  }))
                }
                required
              />
            </Form.Group>
            <Form.Group controlId="transactionMethod">
              <Form.Label>Metode Pembayaran</Form.Label>
              <Form.Control
                value={transactionForm.method}
                onChange={(event) =>
                  setTransactionForm((prev) => ({
                    ...prev,
                    method: event.target.value,
                  }))
                }
                placeholder="Contoh: Transfer BCA / QRIS"
                required
              />
            </Form.Group>
            <Form.Group controlId="transactionStatus">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={transactionForm.status}
                onChange={(event) =>
                  setTransactionForm((prev) => ({
                    ...prev,
                    status: event.target.value,
                  }))
                }
              >
                <option value="Lunas">Lunas</option>
                <option value="DP">DP</option>
                <option value="Draft">Draft</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="transactionNotes">
              <Form.Label>Catatan</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={transactionForm.notes}
                onChange={(event) =>
                  setTransactionForm((prev) => ({
                    ...prev,
                    notes: event.target.value,
                  }))
                }
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-secondary"
              onClick={() => setShowTransactionModal(false)}
            >
              Batal
            </Button>
            <Button type="submit" variant="primary">
              Simpan
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default DetailKunjungan;
