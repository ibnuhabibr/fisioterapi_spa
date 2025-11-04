import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import DetailKunjungan from "./pages/DetailKunjungan.jsx";
import Kunjungan from "./pages/Kunjungan.jsx";
import Laporan from "./pages/Laporan.jsx";
import Login from "./pages/Login.jsx";
import MasterLayanan from "./pages/MasterLayanan.jsx";
import MasterPasien from "./pages/MasterPasien.jsx";
import MasterPegawai from "./pages/MasterPegawai.jsx";
import NotFound from "./pages/NotFound.jsx";
import Pengaturan from "./pages/Pengaturan.jsx";
import Transaksi from "./pages/Transaksi.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="pasien" element={<MasterPasien />} />
        <Route path="pegawai" element={<MasterPegawai />} />
        <Route path="layanan" element={<MasterLayanan />} />
        <Route path="kunjungan" element={<Kunjungan />} />
        <Route path="kunjungan/:visitId" element={<DetailKunjungan />} />
        <Route path="transaksi" element={<Transaksi />} />
        <Route path="laporan" element={<Laporan />} />
        <Route path="pengaturan" element={<Pengaturan />} />
        <Route path="login" element={<Login />} />
        <Route path="404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
