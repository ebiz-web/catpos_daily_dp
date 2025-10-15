import { Flex } from '@/components/elements/Flex.tsx';
import type { CSSProperties } from 'react';

interface Props {
  color?: CSSProperties['color'];
  space?: boolean;
}

const Footer = ({ color, space = false }: Props) => (
  <Flex
    direction="column"
    gap={3}
    className={space ? 'space-wrapper' : ''}
    style={{ fontSize: 12, color: color ?? '' }}
  >
    <span>
      (주)크레소티&nbsp;&nbsp;&nbsp;&nbsp;대표이사
      박경애&nbsp;&nbsp;&nbsp;&nbsp;사업자번호 201-81-82695
    </span>

    <span>
      대표전화 1588-7599&nbsp;&nbsp;&nbsp;&nbsp;이메일 webmaster@cresoty.co.kr
    </span>

    <span>
      주소 서울특별시 영등포구 양산로 43, 1008호 (양평동3가, 우림이비즈센터)
    </span>

    <span>Copyright 2025 © Cresoty Co., Ltd. All right reserved.</span>
  </Flex>
);

export default Footer;
