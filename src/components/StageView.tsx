import React from 'react';
import { Stage } from '../calculation/Stage';

interface Props {
  stage: Stage;
}

export const StageView: React.FunctionComponent<Props> = ({ children, stage }) => {
  return (
    <svg
      className="Stage"
      width={stage.width}
      height={stage.height}
      viewBox={`0 0 ${stage.width} ${stage.height}`}
    >
      <defs>
        {arrowMarker}
        {dotMarker}
      </defs>
      {children}
    </svg>
  );
};

/**
 * Arrow marker
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Element/marker
 */
const arrowMarker = (
  <marker
    id="arrow"
    viewBox="0 0 10 10"
    refX="5"
    refY="5"
    markerWidth="6"
    markerHeight="6"
    orient="auto-start-reverse"
  >
    <path d="M 0 0 L 10 5 L 0 10 z" />
  </marker>
);

/**
 * Dot marker
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Element/marker
 */
const dotMarker = (
  <marker id="dot" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5">
    <circle cx="5" cy="5" r="5" fill="red" />
  </marker>
);
