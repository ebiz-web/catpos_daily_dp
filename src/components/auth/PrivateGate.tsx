import { shallowEqual, useSelector } from 'react-redux';
import type { RootState } from '@/reducers/root.reducer.ts';
import { type ReactNode } from 'react';
import Login from '@/pages/auth/Login';
import { useParams } from 'react-router';
import { persistor } from '@/stores/store.ts';

interface Props {
  children: ReactNode;
}

const PrivateGate = ({ children }: Props) => {
  const common = useSelector((state: RootState) => state.common, shallowEqual);
  const taxno = useParams<{ taxno: string }>().taxno;
  const login = common.taxno === taxno;

  if (!login) {
    persistor.purge().finally();
  }

  return <>{login ? <>{children}</> : <Login />}</>;
};

export default PrivateGate;
