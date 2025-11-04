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
import { Link } from "react-router-dom";
import { GlobalContext } from "../context/GlobalState.jsx";

const initialTransaction = {
  visitId: "",
  patientId: "",
  amount: 0,
  method: "Transfer BCA",
  status: "Lunas",
  notes: "",
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const Transaksi = () => {
  const { state, addTransaction, updateTransaction, deleteTransaction } =
    useContext(GlobalContext);
  const { visits, patients, transactions } = state;

  const [formData, setFormData] = useState(initialTransaction);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const sortedTransactions = useMemo(
    () =>
      [...transactions].sort(
        (a, b) =>
          new Date(b.issuedAt ?? 0).getTime() -
          new Date(a.issuedAt ?? 0).getTime()
      ),
    [transactions]
  );

  const getPatientName = (id) =>
    patients.find((patient) => patient.id === id)?.name ?? "-";
  const getVisitReference = (visitId) =>
    visits.find((visit) => visit.id === visitId);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "visitId") {
      const visit = getVisitReference(value);
      setFormData((prev) => ({
        ...prev,
        visitId: value,
        patientId: visit?.patientId ?? prev.patientId,
        amount: visit?.total ?? prev.amount,
      }));
      return;
    }
    if (name === "amount") {
      setFormData((prev) => ({ ...prev, amount: Number(value) }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.visitId || !formData.patientId) return;

    addTransaction({
      ...formData,
      amount: Number(formData.amount) || 0,
      reference: `INV-${new Date().getFullYear()}-${Math.floor(
        Math.random() * 900 + 100
      )}`,
    });
    setFormData(initialTransaction);
  };

  const openModal = (transaction) => {
    setSelectedTransaction(transaction);
    setFormData({
      visitId: transaction.visitId,
      patientId: transaction.patientId,
      amount: transaction.amount,
      method: transaction.method,
      status: transaction.status,
      notes: transaction.notes ?? "",
    });
    setShowModal(true);
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    if (!selectedTransaction) return;

    updateTransaction(selectedTransaction.id, {
      ...selectedTransaction,
      ...formData,
      amount: Number(formData.amount) || 0,
    });
    setShowModal(false);
    setSelectedTransaction(null);
    setFormData(initialTransaction);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm("Hapus transaksi ini dari pencatatan?");
    if (confirmed) {
      deleteTransaction(id);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTransaction(null);
    setFormData(initialTransaction);
  };

  return (
    <div className="d-flex flex-column gap-4">
      <div>
        <h2 className="h3 fw-semibold mb-1 text-primary">
          Transaksi & Pembayaran
        </h2>
        <p className="text-muted mb-0">
          Kelola pencatatan invoice dan status pembayaran untuk setiap kunjungan
          pasien.
        </p>
      </div>

      <Row className="g-4">
        <Col xl={4}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-white">
              <Card.Title className="h5 mb-0">Catat Transaksi</Card.Title>
              <Card.Subtitle className="text-muted">
                Hubungkan transaksi dengan jadwal kunjungan.
              </Card.Subtitle>
            </Card.Header>
            <Card.Body>
              <Form
                onSubmit={handleSubmit}
                className="d-flex flex-column gap-3"
              >
                <Form.Group controlId="transactionVisit">
                  <Form.Label>Kunjungan</Form.Label>
                  <Form.Select
                    name="visitId"
                    value={formData.visitId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Pilih kunjungan</option>
                    {visits.map((visit) => {
                      const visitPatient = patients.find(
                        (patient) => patient.id === visit.patientId
                      );
                      return (
                        <option key={visit.id} value={visit.id}>
                          {visit.id} &mdash; {visitPatient?.name ?? "-"} (
                          {new Date(visit.scheduledAt).toLocaleDateString(
                            "id-ID"
                          )}
                          )
                        </option>
                      );
                    })}
                  </Form.Select>
                </Form.Group>
                <Form.Group controlId="transactionPatient">
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
                        {patient.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group controlId="transactionAmount">
                  <Form.Label>Nominal (IDR)</Form.Label>
                  <Form.Control
                    type="number"
                    min={0}
                    step={5000}
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="transactionMethod">
                  <Form.Label>Metode Pembayaran</Form.Label>
                  <Form.Control
                    name="method"
                    value={formData.method}
                    onChange={handleChange}
                    placeholder="Contoh: Transfer BCA / QRIS / Tunai"
                    required
                  />
                </Form.Group>
                <Form.Group controlId="transactionStatus">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
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
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Informasi tambahan keterangan pembayaran"
                  />
                </Form.Group>
                <div className="d-grid">
                  <Button type="submit" variant="primary">
                    Simpan Transaksi
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
                <Card.Title className="h5 mb-0">Daftar Transaksi</Card.Title>
                <Card.Subtitle className="text-muted">
                  {sortedTransactions.length} transaksi tercatat.
                </Card.Subtitle>
              </div>
              <Button
                as={Link}
                to="/laporan"
                variant="outline-primary"
                size="sm"
              >
                Lihat Laporan
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Invoice</th>
                    <th>Pasien</th>
                    <th>Nominal</th>
                    <th>Metode</th>
                    <th>Status</th>
                    <th className="text-end">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>
                        <div className="fw-semibold">
                          {transaction.reference}
                        </div>
                        <small className="text-muted">
                          {new Date(transaction.issuedAt).toLocaleString(
                            "id-ID",
                            {
                              dateStyle: "medium",
                              timeStyle: "short",
                            }
                          )}
                        </small>
                      </td>
                      <td>{getPatientName(transaction.patientId)}</td>
                      <td>{formatCurrency(transaction.amount)}</td>
                      <td>{transaction.method}</td>
                      <td>
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
                      </td>
                      <td className="text-end">
                        <div className="d-inline-flex gap-2">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => openModal(transaction)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(transaction.id)}
                          >
                            Hapus
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!sortedTransactions.length && (
                    <tr>
                      <td colSpan={6} className="text-center text-muted py-4">
                        Belum ada transaksi tercatat.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Transaksi</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdate}>
          <Modal.Body className="d-flex flex-column gap-3">
            <Form.Group controlId="editTransactionVisit">
              <Form.Label>Kunjungan</Form.Label>
              <Form.Select
                name="visitId"
                value={formData.visitId}
                onChange={handleChange}
                required
              >
                {visits.map((visit) => (
                  <option key={visit.id} value={visit.id}>
                    {visit.id}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="editTransactionPatient">
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
            <Form.Group controlId="editTransactionAmount">
              <Form.Label>Nominal (IDR)</Form.Label>
              <Form.Control
                type="number"
                min={0}
                step={5000}
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="editTransactionMethod">
              <Form.Label>Metode Pembayaran</Form.Label>
              <Form.Control
                name="method"
                value={formData.method}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="editTransactionStatus">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Lunas">Lunas</option>
                <option value="DP">DP</option>
                <option value="Draft">Draft</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="editTransactionNotes">
              <Form.Label>Catatan</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="notes"
                value={formData.notes}
                onChange={handleChange}
              />
            </Form.Group>
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

export default Transaksi;
