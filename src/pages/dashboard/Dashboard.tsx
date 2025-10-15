import { Flex } from '@/components/elements/Flex.tsx';
import Performance from '@/pages/dashboard/components/Performance.tsx';
import { Link } from 'react-router-dom';
import banner01 from '@/assets/images/banner01.jpg';
import banner02 from '@/assets/images/banner02.jpg';
import banner03 from '@/assets/images/banner03.jpg';
import callcenter from '@/assets/images/callcenter.png';
import SalesComparison from '@/pages/dashboard/components/SalesComparison.tsx';
import DrugRank from '@/pages/dashboard/components/DrugRank.tsx';
import ItemShortage from '@/pages/dashboard/components/ItemShortage.tsx';
import CustomerVisit from '@/pages/dashboard/components/CustomerVisit.tsx';
import InOutStatus from '@/pages/dashboard/components/InOutStatus.tsx';
import FocusSalesStatus from '@/pages/dashboard/components/FocusSalesStatus.tsx';
import ClientBalance from '@/pages/dashboard/components/ClientBalance.tsx';
import { Header } from '@/pages/dashboard/layouts/Header.tsx';
import { Anchor } from '@/pages/dashboard/layouts/Anchor.tsx';
import Footer from '@/pages/dashboard/layouts/Footer.tsx';

const Dashboard = () => {
  return (
    <div className="page-layout">
      <Header />

      <Anchor />

      <Flex direction="column" gap={10}></Flex>

      <div
        style={
          {
            /*paddingBottom: 30*/
          }
        }
      >
        {/* 실적 통계 */}
        <div className="space-wrapper">
          <Performance />
        </div>

        <Link
          to="https://www.cresoty.co.kr/service/customer05.php"
          target="_blank"
        >
          <img src={banner01} alt="banner01" width="100%" />
        </Link>

        <Flex direction="column" className="space-wrapper">
          {/* 매출 비교 */}
          <SalesComparison />

          {/* 약품 순위 */}
          <DrugRank />
        </Flex>

        <Link
          to="https://www.cresoty.co.kr/service/customer06.php"
          target="_blank"
        >
          <img src={banner02} alt="banner01" width="100%" />
        </Link>

        <Flex direction="column" className="space-wrapper">
          {/* 재고 부족 주의 */}
          <ItemShortage />

          {/* 고객 방문 */}
          <CustomerVisit />
        </Flex>

        <Link
          to="https://www.cresoty.co.kr/service/customer10.php"
          target="_blank"
        >
          <img src={banner03} alt="banner01" width="100%" />
        </Link>

        <Flex direction="column" className="space-wrapper">
          {/* 입출고현황 */}
          <InOutStatus />

          {/* 집중매출현황 */}
          <FocusSalesStatus />

          {/* 거래처 잔액 */}
          <ClientBalance />

          <SalesComparison />
        </Flex>

        {/* 고객센터 */}
        {/*
        <img src={callcenter} alt="callcenter" width="100%" height="100%" />

        <Footer space />
        */}
      </div>
    </div>
  );
};

export default Dashboard;
