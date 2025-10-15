import { createRoot } from 'react-dom/client';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import { theme } from './theme.ts';
import { router } from './router.tsx';
import './styles/global.scss';
import { Provider } from 'react-redux';
import { persistor, store } from '@/stores/store.ts';
import { PersistGate } from 'redux-persist/integration/react';

createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </PersistGate>
  </Provider>,
);
