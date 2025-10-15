interface Props {
  rotate?: number;
  size?: number;
}

export const IconArrow = ({ rotate = 0, size = 32 }: Props) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    transform={`rotate(${rotate})`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M24 20C24 22.2091 22.2091 24 20 24L4 24C1.79086 24 1.56562e-07 22.2091 3.49691e-07 20L1.74846e-06 4C1.94158e-06 1.79086 1.79086 -1.94158e-06 4 -1.74846e-06L20 -3.49691e-07C22.2091 -1.56562e-07 24 1.79086 24 4L24 20Z" />
    <path
      d="M13 16L9 12L13 8"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
