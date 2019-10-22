import React from 'react';
import {
  LOGICAL_HEIGHT,
  LOGICAL_MARGIN,
  LOGICAL_WIDTH,
  VISUAL_HEIGHT,
  VISUAL_WIDTH,
} from '../constants';

export const Stage: React.FunctionComponent<{}> = ({ children }) => {
  return (
    <svg
      className="Stage"
      width={VISUAL_WIDTH}
      height={VISUAL_HEIGHT}
      viewBox={`${-LOGICAL_MARGIN} ${-LOGICAL_MARGIN} ${LOGICAL_WIDTH +
        LOGICAL_MARGIN} ${LOGICAL_HEIGHT + LOGICAL_MARGIN}`}
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
