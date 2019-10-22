import classNames from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import { DragPayload } from '../calculation/DragPayload';
import { Node } from '../calculation/Node';
import { Point } from '../calculation/Point';

interface Props {
  node: Node;
  onClick: () => void;
  onMouseDown: (payload: DragPayload, event: React.MouseEvent) => void;
  onMouseUp: (payload: DragPayload) => void;
  onMouseMove: (payload: DragPayload) => void;
}

export const NodeView: React.FunctionComponent<Props> = ({
  node,
  onClick,
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

  return (
    <circle
      className={classNames({ dragging: startPoint })}
      cx={node.x}
      cy={node.y}
      r={1}
      onClick={onClick}
      onMouseDown={handleMouseDown}
    />
  );
};
