import { Tab, Tabs, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

const anchorTabs = [
  { label: '실적통계', id: 'chart-performance' },
  { label: '매출 비교', id: 'chart-comparison' },
  { label: '약품 순위', id: 'chart-drug-rank' },
  { label: '재고 부족 주의', id: 'chart-item-shortage' },
  { label: '고객 방문', id: 'chart-customer-visit' },
  { label: '입출고현황', id: 'chart-inout-status' },
  { label: '집중매출현황', id: 'chart-focus-sales' },
  { label: '거래처 잔액', id: 'chart-client-balance' },
] as const;

export const Anchor = () => {
  const [loc, setLoc] = useState<number>(0);

  const handleLoc = (_: React.SyntheticEvent, value: number) => {
    setLoc(value);

    const el = document.getElementById(anchorTabs[value].id);
    const container = document.querySelector('.page-layout');

    if (el && container) {
      const anchorEl = document.querySelector('#anchor-tabs') as HTMLElement;
      const anchorOffset = anchorEl?.offsetHeight + 10;
      const elementPosition =
        el.getBoundingClientRect().top + container.scrollTop;
      const offsetPosition = elementPosition - anchorOffset;

      container.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = anchorTabs.findIndex(
              (item) => item.id === entry.target.id,
            );
            if (index !== -1) setLoc(index);
          }
        });
      },
      { threshold: 0.3 },
    );

    anchorTabs.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      id="anchor-tabs"
      style={{
        paddingInline: 20,
        position: 'sticky',
        top: 0,
        zIndex: 999,
        backgroundColor: 'white',
      }}
    >
      <Tabs value={loc} onChange={handleLoc} variant="scrollable">
        {anchorTabs.map((item, index) => (
          <Tab
            key={item.id}
            value={index}
            label={
              <Typography
                variant="lg"
                color={index === loc ? 'primary' : 'info'}
              >
                {item.label}
              </Typography>
            }
          />
        ))}
      </Tabs>
    </div>
  );
};
