import React, { useCallback, useState } from 'react';
import { useShallowArray } from '../hooks/useShallowArray';
import { TEXT_PLAIN } from './DragAndDropModel';

function stopPropagation(event: React.SyntheticEvent): void {
  event.stopPropagation();
}

interface Props {
  draggableIds: string[];
  previewRef?: React.RefObject<HTMLElement>;
}

export interface DraggableProps {
  draggable: boolean;
  onDragEnd: React.DragEventHandler;
  onDragStart: React.DragEventHandler;
  onMouseDown: React.MouseEventHandler;
}

interface Result {
  draggableProps: DraggableProps;
  isDragging: boolean;
}

export function useDraggable({ draggableIds: originalDraggableIds, previewRef }: Props): Result {
  const [isDragging, setIsDragging] = useState(false);

  const draggableIds = useShallowArray(originalDraggableIds);

  const handleDragStart = useCallback(
    (event: React.DragEvent) => {
      if (event.dataTransfer === null) {
        throw new Error('event.dataTransfer should not be null');
      }

      setIsDragging(true);
      event.dataTransfer.setData(TEXT_PLAIN, draggableIds.join(','));

      if (previewRef !== undefined && previewRef.current !== null) {
        event.dataTransfer.setDragImage(previewRef.current, 0, 0);
      }
    },
    [draggableIds, previewRef],
  );

  const handleDragEnd = useCallback((event: React.DragEvent) => {
    if (event.dataTransfer === null) {
      throw new Error('event.dataTransfer should not be null');
    }
    setIsDragging(false);
    event.dataTransfer.clearData(TEXT_PLAIN);
  }, []);

  const draggableProps: DraggableProps = {
    draggable: true,
    onDragEnd: handleDragEnd,
    onDragStart: handleDragStart,
    onMouseDown: stopPropagation,
  };

  return {
    draggableProps,
    isDragging,
  };
}
