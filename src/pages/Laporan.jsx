import { useContext, useMemo } from "react";
import {
  Badge,
  Card,
  Col,
  ListGroup,
  ProgressBar,
  Row,
  Table,
} from "react-bootstrap";
import { GlobalContext } from "../context/GlobalState.jsx";

const formatCurrency = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const Laporan = () => {
  const { state } = useContext(GlobalContext);
  const { patients, services, visits, transactions } = state;

  const metrics = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyTransactions = transactions.filter((transaction) => {
      const issued = new Date(transaction.issuedAt);
      return (
        issued.getMonth() === currentMonth &&
        issued.getFullYear() === currentYear
      );
    });

    const totalRevenue = monthlyTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );
    const paidRevenue = monthlyTransactions
      .filter((transaction) => transaction.status === "Lunas")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const outstandingRevenue = monthlyTransactions
      .filter((transaction) => transaction.status !== "Lunas")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const visitByStatus = visits.reduce(
      (acc, visit) => {
        acc[visit.status] = (acc[visit.status] ?? 0) + 1;
        return acc;
      },
      { Terjadwal: 0, Proses: 0, Selesai: 0, Batal: 0 }
    );

    const servicePerformance = services.map((service) => {
      const relatedVisits = visits.filter((visit) =>
        visit.serviceIds.includes(service.id)
      );
      return {
        id: service.id,
        name: service.name,
        totalSessions: relatedVisits.length,
        revenue: relatedVisits.reduce((sum, visit) => sum + visit.total, 0),
      };
    });

    const membershipCount = patients.reduce((acc, patient) => {
      acc[patient.membership] = (acc[patient.membership] ?? 0) + 1;
      return acc;
    }, {});

    const paymentStatus = visits.reduce((acc, visit) => {
      acc[visit.paymentStatus] = (acc[visit.paymentStatus] ?? 0) + 1;
      return acc;
    }, {});

    const avgProgress = visits.length
      ? Math.round(
          visits.reduce((sum, visit) => sum + (visit.progress ?? 0), 0) /
            visits.length
        )
      : 0;

    const lastActivities = [...visits]
      .sort((a, b) => new Date(b.updatedAt ?? 0) - new Date(a.updatedAt ?? 0))
      .slice(0, 6);

    return {
      totalRevenue,
      paidRevenue,
      outstandingRevenue,
      monthlyTransactions,
      visitByStatus,
      servicePerformance,
      membershipCount,
      paymentStatus,
      avgProgress,
      lastActivities,
    };
  }, [patients, services, visits, transactions]);

  const totalVisits = visits.length || 1;
  const serviceMaxSessions = Math.max(
    ...metrics.servicePerformance.map((item) => item.totalSessions || 0),
    1
  );

  return (
    <div className="d-flex flex-column gap-4">
      <div>
        <h2 className="h3 fw-semibold mb-1 text-primary">Laporan Klinik</h2>
        <p className="text-muted mb-0">
          Rekap performa finansial dan operasional klinik fisioterapi &amp; baby
          spa secara real time.
        </p>
      </div>

      <Row className="g-4">
        <Col xl={4} md={6}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <p className="text-muted mb-1">Total Revenue Bulan Ini</p>
              <h3 className="fw-bold mb-1">
                {formatCurrency(metrics.totalRevenue)}
              </h3>
              <small className="text-success fw-medium">
                {formatCurrency(metrics.paidRevenue)} telah dibayar
              </small>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={4} md={6}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <p className="text-muted mb-1">Tagihan Menunggu Pembayaran</p>
              <h3 className="fw-bold mb-1">
                {formatCurrency(metrics.outstandingRevenue)}
              </h3>
              <small className="text-muted">
                {metrics.monthlyTransactions.length} transaksi tercatat
              </small>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={4} md={12}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <p className="text-muted mb-1">Rata-rata Progress Program</p>
              <h3 className="fw-bold mb-2">{metrics.avgProgress}%</h3>
              <ProgressBar
                now={metrics.avgProgress}
                style={{ height: "8px" }}
              />
              <small className="text-muted">
                Progress rata-rata seluruh kunjungan terdaftar
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col xl={8}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <div>
                <Card.Title className="h5 mb-0">Kinerja Layanan</Card.Title>
                <Card.Subtitle className="text-muted">
                  Performa masing-masing layanan terhadap pendapatan.
                </Card.Subtitle>
              </div>
              <Badge bg="primary">{services.length} layanan</Badge>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Layanan</th>
                    <th>Sesi</th>
                    <th>Kontribusi</th>
                    <th>Pendapatan</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.servicePerformance.map((service) => (
                    <tr key={service.id}>
                      <td>{service.name}</td>
                      <td>{service.totalSessions} sesi</td>
                      <td style={{ minWidth: "200px" }}>
                        <ProgressBar
                          now={
                            (service.totalSessions / serviceMaxSessions) * 100
                          }
                          label={`${Math.round(
                            (service.totalSessions / totalVisits) * 100
                          )}%`}
                        />
                      </td>
                      <td>{formatCurrency(service.revenue)}</td>
                    </tr>
                  ))}
                  {!metrics.servicePerformance.length && (
                    <tr>
                      <td colSpan={4} className="text-center text-muted py-4">
                        Belum ada data layanan.
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
            <Card.Header className="bg-white">
              <Card.Title className="h5 mb-0">Distribusi Membership</Card.Title>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {Object.entries(metrics.membershipCount).map(
                  ([membership, count]) => (
                    <ListGroup.Item
                      key={membership}
                      className="px-0 d-flex justify-content-between align-items-center"
                    >
                      <span>{membership}</span>
                      <Badge bg="secondary">{count} pasien</Badge>
                    </ListGroup.Item>
                  )
                )}
                {!Object.keys(metrics.membershipCount).length && (
                  <ListGroup.Item className="px-0 text-muted">
                    Belum ada data membership.
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col xl={5}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-white">
              <Card.Title className="h5 mb-0">Status Kunjungan</Card.Title>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush" className="gap-2">
                {Object.entries(metrics.visitByStatus).map(
                  ([status, count]) => (
                    <ListGroup.Item
                      key={status}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <span>{status}</span>
                      <Badge
                        bg={
                          status === "Selesai"
                            ? "success"
                            : status === "Terjadwal"
                            ? "primary"
                            : status === "Proses"
                            ? "info"
                            : "secondary"
                        }
                      >
                        {count}
                      </Badge>
                    </ListGroup.Item>
                  )
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={7}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-white">
              <Card.Title className="h5 mb-0">
                Status Pembayaran Kunjungan
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {Object.entries(metrics.paymentStatus).map(
                  ([status, count]) => (
                    <ListGroup.Item key={status} className="px-0">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{status}</strong>
                          <div className="text-muted small">
                            {Math.round((count / totalVisits) * 100)}% dari
                            total kunjungan
                          </div>
                        </div>
                        <Badge
                          bg={
                            status.toLowerCase() === "lunas"
                              ? "success"
                              : status.toLowerCase().includes("dp")
                              ? "info"
                              : "danger"
                          }
                        >
                          {count} kunjungan
                        </Badge>
                      </div>
                      <ProgressBar
                        now={(count / totalVisits) * 100}
                        className="mt-2"
                      />
                    </ListGroup.Item>
                  )
                )}
                {!Object.keys(metrics.paymentStatus).length && (
                  <ListGroup.Item className="px-0 text-muted">
                    Belum ada data pembayaran.
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm border-0">
        <Card.Header className="bg-white">
          <Card.Title className="h5 mb-0">Aktivitas Terbaru</Card.Title>
          <Card.Subtitle className="text-muted">
            Catatan update progres dan status kunjungan
          </Card.Subtitle>
        </Card.Header>
        <Card.Body className="p-0">
          <ListGroup variant="flush">
            {metrics.lastActivities.map((visit) => {
              const patient = patients.find(
                (item) => item.id === visit.patientId
              );
              const therapist = state.employees.find(
                (item) => item.id === visit.therapistId
              );
              return (
                <ListGroup.Item key={visit.id} className="py-3 px-4">
                  <div className="d-flex flex-column flex-lg-row justify-content-between gap-2">
                    <div>
                      <strong>{patient?.name ?? "-"}</strong>
                      <div className="text-muted small">
                        {new Date(
                          visit.updatedAt ?? visit.createdAt
                        ).toLocaleString("id-ID", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </div>
                      <div className="mt-2 text-muted">
                        {visit.notes || "Tidak ada catatan tambahan."}
                      </div>
                    </div>
                    <div className="text-lg-end">
                      <Badge className="me-2" bg="primary">
                        {therapist?.name ?? "-"}
                      </Badge>
                      <Badge
                        bg={visit.status === "Selesai" ? "success" : "warning"}
                      >
                        {visit.status}
                      </Badge>
                      <div className="mt-2 fw-semibold">
                        {formatCurrency(visit.total)}
                      </div>
                    </div>
                  </div>
                </ListGroup.Item>
              );
            })}
            {!metrics.lastActivities.length && (
              <ListGroup.Item className="py-4 text-center text-muted">
                Belum ada aktivitas terbaru.
              </ListGroup.Item>
            )}
          </ListGroup>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Laporan;
