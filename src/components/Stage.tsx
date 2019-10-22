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
      {children}
    </svg>
  );
};
