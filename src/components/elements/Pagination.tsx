import { initPage } from '@/interfaces/common.interface.ts';
import { Flex } from '../elements/Flex.tsx';
import { Button, Typography } from '@mui/material';
import { IconArrow } from '@/assets/icons/IconArrow.tsx';

interface Props {
  page: number;
  total: number;
  onChange: (page: number) => void;
}

const minPage = initPage.PAGE;
const pageBlockSize = 5;

const Pagination = ({ page, total, onChange }: Props) => {
  const totalPage = Math.ceil(total / pageBlockSize);
  const maxPage = totalPage > 0 ? totalPage : 1;
  const currentPage = Math.min(Math.max(page, minPage), maxPage);

  const pageBlockStart =
    Math.floor((currentPage - 1) / pageBlockSize) * pageBlockSize + 1;
  let pageBlockEnd = pageBlockStart + pageBlockSize - 1;

  if (pageBlockEnd > maxPage) {
    pageBlockEnd = maxPage;
  }

  let pages = [];

  for (let i = pageBlockStart; i <= pageBlockEnd; i++) {
    pages.push(i);
  }

  return (
    <Flex
      justify="space-between"
      align="center"
      noGap
      fullWidth
      className="pagination-section"
    >
      <Flex>
        <Button
          size="smallFit"
          variant="outlined"
          color="info"
          disabled={pageBlockStart === minPage}
          onClick={() => onChange(pageBlockStart - pageBlockSize)}
        >
          <IconArrow />
        </Button>
      </Flex>

      <Flex gap={5}>
        {pages.map((p) => (
          <Button
            key={p}
            variant={currentPage === p ? 'contained' : 'text'}
            color={currentPage === p ? 'primary' : 'info'}
            size="square"
            onClick={() => onChange(p)}
          >
            <Typography variant="xl">{p}</Typography>
          </Button>
        ))}
      </Flex>

      <Flex>
        <Button
          size="smallFit"
          variant="outlined"
          color="info"
          disabled={pageBlockEnd === maxPage}
          onClick={() => onChange(pageBlockEnd + 1)}
        >
          <IconArrow rotate={180} />
        </Button>
      </Flex>
    </Flex>
  );
};

export default Pagination;
