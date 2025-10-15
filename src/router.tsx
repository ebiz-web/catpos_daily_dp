import { createBrowserRouter } from 'react-router-dom';
import Dashboard from '@/pages/dashboard/Dashboard.tsx';
import PrivateGate from '@/components/auth/PrivateGate.tsx';

export const router = createBrowserRouter([
  {
    path: '/dashboard/:taxno',
    element: (
      <PrivateGate>
        <Dashboard />
      </PrivateGate>
    ),
  },
]);
