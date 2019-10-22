import classNames from 'classnames';
import React, { useCallback } from 'react';
import { Edge } from '../calculation/Edge';
import { Node } from '../calculation/Node';

interface Props {
  edge: Edge;
  startNode: Node;
  endNode: Node;
  selected: boolean;
  onClick: (event: React.MouseEvent) => void;
}

export const EdgeView: React.FunctionComponent<Props> = ({
  startNode,
  endNode,
  selected,
  onClick,
}) => {
  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      onClick(event);
    },
    [onClick],
  );

  return (
    <>
      <line
        className={classNames('EdgeView', { 'EdgeView--selected': selected })}
        x1={startNode.x}
        y1={startNode.y}
        x2={endNode.x}
        y2={endNode.y}
        onClick={handleClick}
      />
    </>
  );
};
