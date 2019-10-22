import classNames from 'classnames';
import React, { useCallback, useMemo } from 'react';
import { Edge } from '../calculation/Edge';
import { Node } from '../calculation/Node';
import { Point } from '../calculation/Point';
import { NODE_RADIUS } from '../constants';

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
  const p = useMemo(() => calculateDirection(startNode, endNode), [startNode, endNode]);

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
        x1={startNode.x + p.x * NODE_RADIUS}
        y1={startNode.y + p.y * NODE_RADIUS}
        x2={endNode.x - p.x * NODE_RADIUS}
        y2={endNode.y - p.y * NODE_RADIUS}
        markerEnd="url(#arrow)"
        onClick={handleClick}
      />
    </>
  );
};

function calculateDirection(startNode: Node, endNode: Node): Point {
  let dx = endNode.x - startNode.x;
  let dy = endNode.y - startNode.y;
  const ln = Math.sqrt(dx * dx + dy * dy);
  dx /= ln;
  dy /= ln;
  return { x: dx, y: dy };
}
