import type { CSSProperties, ReactNode } from 'react';
import type { Properties } from 'csstype';

type FlexProps = {
  className?: string;
  fullWidth?: boolean;
  fitHeight?: boolean;
  direction?: Properties['flexDirection'];
  justify?: Properties['justifyContent'];
  align?: Properties['alignItems'];
  gap?: number;
  noGap?: boolean;
  children?: ReactNode;
  wrap?: boolean;
  action?: boolean;
  style?: CSSProperties;
};

export const Flex = ({
  className,
  fullWidth = false,
  fitHeight = false,
  direction = 'row',
  justify,
  align,
  gap = 10,
  noGap = false,
  children,
  wrap = false,
  action = false,
  style,
}: FlexProps) => {
  return (
    <div
      className={`${className || ''} ${action ? 'action-section' : ''}`.trim()}
      style={{
        width: fullWidth ? '100%' : undefined,
        height: fitHeight ? '100%' : undefined,
        display: 'flex',
        flexDirection: direction,
        justifyContent: justify,
        alignItems: align,
        gap: noGap ? undefined : `${gap}px`,
        flexWrap: wrap ? 'wrap' : 'nowrap',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
