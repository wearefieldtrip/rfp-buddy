import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { ProtectedRoute } from './features/auth/ProtectedRoute';
import { CreateRfpPage } from './features/rfps/CreateRfpPage';
import { RfpDetailPage } from './features/rfps/RfpDetailPage';
import { RfpListPage } from './features/rfps/RfpListPage';

function App() {
  return (
    <AppShell>
      <ProtectedRoute>
        <Routes>
          <Route path="/" element={<Navigate to="/rfps" replace />} />
          <Route path="/rfps" element={<RfpListPage />} />
          <Route path="/rfps/new" element={<CreateRfpPage />} />
          <Route path="/rfps/:id" element={<RfpDetailPage />} />
        </Routes>
      </ProtectedRoute>
    </AppShell>
  );
}

export default App;
