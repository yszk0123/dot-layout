import classNames from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import { DragPayload } from '../calculation/DragPayload';
import { Node } from '../calculation/Node';
import { Point } from '../calculation/Point';
import { NODE_RADIUS } from '../constants';

interface Props {
  node: Node;
  selected: boolean;
  onClick: (node: Node, event: React.MouseEvent) => void;
  onDoubleClick: (node: Node, event: React.MouseEvent) => void;
  onMouseDown: (payload: DragPayload, event: React.MouseEvent) => void;
  onMouseUp: (payload: DragPayload) => void;
  onMouseMove: (payload: DragPayload) => void;
}

export const NodeView: React.FunctionComponent<Props> = ({
  node,
  selected,
  onClick,
  onDoubleClick,
  onMouseDown,
  onMouseMove,
  onMouseUp,
}) => {
  const [startPoint, setStartPoint] = useState<Point | null>(null);

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      const point = { x: event.clientX, y: event.clientY };
      setStartPoint(point);
      const payload = { node, start: point, current: point };
      onMouseDown(payload, event);
    },
    [onMouseDown, node],
  );

  const handleMouseUp = useCallback(
    (event: MouseEvent) => {
      if (startPoint !== null) {
        const point = { x: event.clientX, y: event.clientY };
        const payload = { node, start: startPoint, current: point };
        setStartPoint(null);
        onMouseUp(payload);
      }
    },
    [onMouseUp, node, startPoint],
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (startPoint !== null) {
        const point = { x: event.clientX, y: event.clientY };
        const payload = { node, start: startPoint, current: point };
        onMouseMove(payload);
      }
    },
    [onMouseMove, node, startPoint],
  );

  useEffect(() => {
    document.body.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.body.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseUp]);

  useEffect(() => {
    if (startPoint === null) {
      return;
    }

    document.body.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.body.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove, startPoint]);

  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      onClick(node, event);
    },
    [onClick, node],
  );

  const handleDoubleClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      onDoubleClick(node, event);
    },
    [onDoubleClick, node],
  );

  return (
    <>
      <circle
        className={classNames('NodeView', { 'NodeView--selected': selected, dragging: startPoint })}
        cx={node.x}
        cy={node.y}
        r={NODE_RADIUS}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onMouseDown={handleMouseDown}
      />
      <Text x={node.x} y={node.y} text={node.text} />
    </>
  );
};

/**
 * HACK
 * @see https://stackoverflow.com/questions/4991171/auto-line-wrapping-in-svg-text
 */
const Text: React.FunctionComponent<{ x: number; y: number; text: string }> = ({ x, y, text }) => {
  return (
    <foreignObject
      className="NodeView__text"
      x={x - NODE_RADIUS}
      y={y - NODE_RADIUS}
      width={NODE_RADIUS * 2}
      height={NODE_RADIUS * 2}
    >
      <p className="NodeView__text-inner">{text}</p>
    </foreignObject>
  );

  // return (
  //   <text className="NodeView__text" textAnchor="middle" dominantBaseline="central" x={x} y={y}>
  //     {text}
  //   </text>
  // );
};
