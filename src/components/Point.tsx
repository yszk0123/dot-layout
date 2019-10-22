import classNames from 'classnames';
import React from 'react';

export const Point: React.FunctionComponent<{
  id: string;
  x: number;
  y: number;
  onClick: () => void;
}> = ({ id, x, y, onClick }) => {
  const isDragging = false;
  return (
    <circle
      className={classNames({ dragging: isDragging })}
      cx={x}
      cy={y}
      r={1}
      onClick={onClick}
    />
  );
};
