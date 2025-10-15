import { useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { type AppDispatch, persistor } from '@/stores/store.ts';
import { useEffect, useState } from 'react';
import { updateCommon } from '@/reducers/common.slice.ts';
import { Flex } from '@/components/elements/Flex.tsx';
import {
  Button,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import logo from '@/assets/images/logo.png';
import Footer from '@/pages/dashboard/layouts/Footer.tsx';
import { IconPasswordShow } from '@/assets/icons/IconPasswordShow.tsx';
import { IconPasswordHide } from '@/assets/icons/IconPasswordHide.tsx';

const Login = () => {
  const params = useParams<{ taxno: string }>().taxno!;
  const dispatch = useDispatch<AppDispatch>();

  const [pwd, setPwd] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [showPwd, setShowPwd] = useState<boolean>(false);

  useEffect(() => {
    persistor.purge().finally();
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);

    const keyword = params?.substring(params.length - 5);

    if (pwd === keyword) {
      dispatch(updateCommon({ taxno: params }));
      setError(true);
    } else {
      setError(true);
    }

    setIsLoading(false);
  };

  return (
    <Flex
      direction="column"
      justify="space-between"
      className="login-container"
    >
      <Flex justify="end" fullWidth>
        <img src={logo} width={120} alt="logo" />
      </Flex>
      <Flex direction="column">
        <Typography sx={{ fontSize: 48, fontWeight: 900, color: 'white' }}>
          로그인
        </Typography>
        <span style={{ color: '#ffffff66', fontSize: 18 }}>
          로그인 하시고 <b>결산리포트</b>를 확인해 보세요
        </span>
      </Flex>
      <Flex direction="column" justify="center" gap={20} fullWidth>
        <div>
          <Typography variant="xxxl" color="white">
            비밀번호
          </Typography>
          <TextField
            type={showPwd ? 'text' : 'password'}
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            error={error}
            helperText={error && '비밀번호가 일치하지 않습니다.'}
            placeholder="사업자번호 뒷 5자리 입력"
            fullWidth
            sx={{ height: 64 }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPwd((prev) => !prev)}>
                      {showPwd ? <IconPasswordHide /> : <IconPasswordShow />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </div>
        <Button
          variant="contained"
          color="secondary"
          loading={isLoading}
          onClick={handleLogin}
          sx={{ height: 64 }}
        >
          로그인
        </Button>
        <Divider sx={{ borderColor: '#ffffff33', margin: '10px 0' }} />
        <Flex direction="column" align="center" justify="center">
          <Typography sx={{ color: 'white' }}>
            로그인에 문제가 있으신가요?
          </Typography>
          <Typography sx={{ color: '#ffffff66' }}>문의하기</Typography>
        </Flex>
      </Flex>

      <Footer color="#ffffff66" />
    </Flex>
  );
};

export default Login;
