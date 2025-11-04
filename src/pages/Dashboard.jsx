import { useCallback, useContext, useMemo } from "react";
import {
  Badge,
  Card,
  Col,
  ListGroup,
  ProgressBar,
  Row,
  Table,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { GlobalContext } from "../context/GlobalState.jsx";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDateTime = (isoString) =>
  new Date(isoString).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });

const Dashboard = () => {
  const { state } = useContext(GlobalContext);
  const { patients, employees, visits, transactions, meta } = state;

  const stats = useMemo(() => {
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${now.getMonth() + 1}`;

    // Hitung pendapatan bulan ini dari transaksi yang sudah dibayar (Lunas atau DP)
    const incomeThisMonth = transactions
      .filter((trx) => {
        const issuedDate = new Date(trx.issuedAt);
        const isSameMonth =
          issuedDate.getFullYear() === now.getFullYear() &&
          issuedDate.getMonth() === now.getMonth();
        const isPaid = ["lunas", "dp"].includes(trx.status.toLowerCase());
        return isSameMonth && isPaid;
      })
      .reduce((total, trx) => total + trx.amount, 0);

    const therapistCount = employees.filter(
      (emp) =>
        emp.role.toLowerCase().includes("fisioterapis") ||
        (emp.specialization ?? "").toLowerCase().includes("terapi")
    ).length;

    const activeVisits = visits.filter((visit) => visit.status !== "Selesai");
    const completionRate = visits.length
      ? Math.round(
          visits.reduce((total, visit) => total + (visit.progress ?? 0), 0) /
            visits.length
        )
      : 0;

    const outstanding = visits.filter((visit) =>
      ["belum bayar", "dp 50%"].includes(visit.paymentStatus.toLowerCase())
    );

    return {
      monthKey,
      incomeThisMonth,
      therapistCount,
      completionRate,
      outstanding,
      activeVisits,
    };
  }, [employees, transactions, visits]);

  const upcomingVisits = useMemo(
    () =>
      [...visits]
        .filter((visit) => visit.status.toLowerCase() === "terjadwal")
        .sort(
          (a, b) =>
            new Date(a.scheduledAt).getTime() -
            new Date(b.scheduledAt).getTime()
        )
        .slice(0, 5),
    [visits]
  );

  const recentTransactions = useMemo(
    () =>
      [...transactions]
        .sort(
          (a, b) =>
            new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime()
        )
        .slice(0, 5),
    [transactions]
  );

  const getPatientName = useCallback(
    (id) =>
      patients.find((patient) => patient.id === id)?.name ?? "Tidak diketahui",
    [patients]
  );

  const getTherapistName = useCallback(
    (id) =>
      employees.find((employee) => employee.id === id)?.name ??
      "Tidak diketahui",
    [employees]
  );

  return (
    <div className="d-flex flex-column gap-4 fade-in-up">
      <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-2">
            <span style={{ fontSize: "2rem" }}>📊</span>
            <h1
              className="display-6 fw-semibold mb-0"
              style={{
                background: "linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Dashboard Klinik
            </h1>
          </div>
          <p className="text-muted mb-0">
            Selamat datang kembali,{" "}
            <strong>{meta?.activeUser?.name ?? "Admin"}</strong>! Pantau
            performa klinik dan aktivitas terbaru di sini.
          </p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <Badge
            bg="primary"
            className="px-3 py-2"
            style={{ fontSize: "0.9rem" }}
          >
            📅 {stats.monthKey}
          </Badge>
          <Badge
            bg="success"
            className="px-3 py-2"
            style={{ fontSize: "0.9rem" }}
          >
            ✅ {stats.activeVisits.length} Jadwal Aktif
          </Badge>
        </div>
      </div>

      <Row className="g-4">
        <Col xl={3} md={6}>
          <Card className="h-100 shadow-soft border-0 stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="bg-primary bg-opacity-10 p-3 rounded-3">
                  <span style={{ fontSize: "1.8rem" }}>👥</span>
                </div>
              </div>
              <p
                className="text-muted mb-1 text-uppercase"
                style={{
                  fontSize: "0.75rem",
                  letterSpacing: "0.5px",
                  fontWeight: "600",
                }}
              >
                Total Pasien Aktif
              </p>
              <h2
                className="fw-bold mb-2"
                style={{ fontSize: "2.5rem", color: "#0d6efd" }}
              >
                {patients.length}
              </h2>
              <div className="d-flex align-items-center gap-1">
                <span style={{ color: "#198754", fontSize: "1.2rem" }}>↗</span>
                <small className="text-success fw-medium">
                  +4 pasien bulan ini
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} md={6}>
          <Card className="h-100 shadow-soft border-0 stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="bg-success bg-opacity-10 p-3 rounded-3">
                  <span style={{ fontSize: "1.8rem" }}>💰</span>
                </div>
              </div>
              <p
                className="text-muted mb-1 text-uppercase"
                style={{
                  fontSize: "0.75rem",
                  letterSpacing: "0.5px",
                  fontWeight: "600",
                }}
              >
                Pendapatan Bulan Ini
              </p>
              <h2
                className="fw-bold mb-2"
                style={{ fontSize: "2rem", color: "#198754" }}
              >
                {formatCurrency(stats.incomeThisMonth)}
              </h2>
              <small className="text-muted">Total transaksi berhasil</small>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} md={6}>
          <Card className="h-100 shadow-soft border-0 stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="bg-info bg-opacity-10 p-3 rounded-3">
                  <span style={{ fontSize: "1.8rem" }}>👨‍⚕️</span>
                </div>
              </div>
              <p
                className="text-muted mb-1 text-uppercase"
                style={{
                  fontSize: "0.75rem",
                  letterSpacing: "0.5px",
                  fontWeight: "600",
                }}
              >
                Tenaga Terapis
              </p>
              <h2
                className="fw-bold mb-2"
                style={{ fontSize: "2.5rem", color: "#0dcaf0" }}
              >
                {stats.therapistCount}
              </h2>
              <small className="text-muted">
                Dari {employees.length} pegawai aktif
              </small>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} md={6}>
          <Card className="h-100 shadow-soft border-0 stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="bg-warning bg-opacity-10 p-3 rounded-3">
                  <span style={{ fontSize: "1.8rem" }}>📈</span>
                </div>
              </div>
              <p
                className="text-muted mb-1 text-uppercase"
                style={{
                  fontSize: "0.75rem",
                  letterSpacing: "0.5px",
                  fontWeight: "600",
                }}
              >
                Progress Program Terapi
              </p>
              <div className="d-flex align-items-center gap-3 mb-2">
                <h2
                  className="fw-bold mb-0"
                  style={{ fontSize: "2.5rem", color: "#ffc107" }}
                >
                  {stats.completionRate}%
                </h2>
              </div>
              <ProgressBar
                now={stats.completionRate}
                style={{ height: "8px" }}
                className="mb-2"
              />
              <small className="text-muted">
                Rata-rata progress semua kunjungan
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col xl={8}>
          <Card className="shadow-soft border-0 h-100">
            <Card.Header
              className="d-flex justify-content-between align-items-center"
              style={{
                background: "linear-gradient(180deg, #ffffff 0%, #fafbfc 100%)",
              }}
            >
              <div>
                <div className="d-flex align-items-center gap-2">
                  <span style={{ fontSize: "1.3rem" }}>📅</span>
                  <Card.Title className="h5 mb-0">
                    Kunjungan Mendatang
                  </Card.Title>
                </div>
                <Card.Subtitle
                  className="text-muted mt-1"
                  style={{ fontSize: "0.85rem" }}
                >
                  5 jadwal terdekat yang perlu disiapkan tim
                </Card.Subtitle>
              </div>
              <Link
                to="/kunjungan"
                className="btn btn-outline-primary btn-sm"
                style={{ borderRadius: "10px" }}
              >
                Lihat Semua →
              </Link>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Jadwal</th>
                    <th>Pasien</th>
                    <th>Terapis</th>
                    <th>Status</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingVisits.map((visit) => (
                    <tr key={visit.id}>
                      <td>
                        <Link
                          to={`/kunjungan/${visit.id}`}
                          className="fw-semibold text-decoration-none"
                        >
                          {formatDateTime(visit.scheduledAt)}
                        </Link>
                      </td>
                      <td>{getPatientName(visit.patientId)}</td>
                      <td>{getTherapistName(visit.therapistId)}</td>
                      <td>
                        <Badge
                          bg={
                            visit.paymentStatus.toLowerCase() === "lunas"
                              ? "success"
                              : visit.paymentStatus.toLowerCase().includes("dp")
                              ? "warning"
                              : "danger"
                          }
                        >
                          {visit.paymentStatus}
                        </Badge>
                      </td>
                      <td>{formatCurrency(visit.total)}</td>
                    </tr>
                  ))}
                  {!upcomingVisits.length && (
                    <tr>
                      <td colSpan={5} className="text-center py-4 text-muted">
                        Tidak ada jadwal mendatang.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={4}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <div>
                <Card.Title className="h5 mb-0">Notifikasi</Card.Title>
                <Card.Subtitle className="text-muted">
                  Informasi penting untuk hari ini
                </Card.Subtitle>
              </div>
              <Badge bg="primary">{meta.notifications.length}</Badge>
            </Card.Header>
            <Card.Body className="p-0">
              <ListGroup variant="flush">
                {meta.notifications.map((notification) => (
                  <ListGroup.Item key={notification.id} className="py-3">
                    <div className="d-flex justify-content-between">
                      <span
                        className={`badge bg-${notification.severity} text-uppercase`}
                      >
                        {notification.severity}
                      </span>
                      <small className="text-muted">
                        {new Date(notification.createdAt).toLocaleString(
                          "id-ID",
                          {
                            dateStyle: "short",
                            timeStyle: "short",
                          }
                        )}
                      </small>
                    </div>
                    <p className="mb-0 mt-2 text-muted">
                      {notification.message}
                    </p>
                  </ListGroup.Item>
                ))}
                {!meta.notifications.length && (
                  <ListGroup.Item className="text-center text-muted py-4">
                    Tidak ada notifikasi terbaru.
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col xl={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-white">
              <Card.Title className="h5 mb-0">Pendapatan Terbaru</Card.Title>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Invoice</th>
                    <th>Pasien</th>
                    <th>Nominal</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="fw-semibold">{transaction.reference}</td>
                      <td>{getPatientName(transaction.patientId)}</td>
                      <td>{formatCurrency(transaction.amount)}</td>
                      <td>
                        <Badge
                          bg={
                            transaction.status.toLowerCase() === "lunas"
                              ? "success"
                              : transaction.status.toLowerCase() === "dp"
                              ? "warning"
                              : "secondary"
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {!recentTransactions.length && (
                    <tr>
                      <td colSpan={4} className="text-center py-4 text-muted">
                        Belum ada transaksi tercatat.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-white">
              <Card.Title className="h5 mb-0">Status Pembayaran</Card.Title>
              <Card.Subtitle className="text-muted">
                {stats.outstanding.length} kunjungan membutuhkan tindak lanjut
                pembayaran.
              </Card.Subtitle>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {stats.outstanding.map((visit) => (
                  <ListGroup.Item key={visit.id} className="py-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="mb-1">
                          {getPatientName(visit.patientId)}
                        </h6>
                        <small className="text-muted">
                          {formatDateTime(visit.scheduledAt)} &middot;{" "}
                          {getTherapistName(visit.therapistId)}
                        </small>
                      </div>
                      <Badge bg="danger" pill>
                        {visit.paymentStatus}
                      </Badge>
                    </div>
                  </ListGroup.Item>
                ))}
                {!stats.outstanding.length && (
                  <ListGroup.Item className="text-center text-muted py-4">
                    Semua pembayaran telah lunas.
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
