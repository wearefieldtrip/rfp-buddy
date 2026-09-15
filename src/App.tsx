import { Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { ProtectedRoute } from './features/auth/ProtectedRoute';
import { DashboardPage } from './features/dashboard/DashboardPage';

function App() {
  return (
    <AppShell>
      <ProtectedRoute>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
        </Routes>
      </ProtectedRoute>
    </AppShell>
  );
}

export default App;
