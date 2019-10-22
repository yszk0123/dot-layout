import React, { useCallback, useState } from 'react';
import { DropResult, FileDropResult, TEXT_PLAIN } from './DragAndDropModel';

function handleDragOver(event: React.DragEvent): void {
  event.preventDefault();
  event.stopPropagation();
}

interface Props {
  droppable: boolean;
  droppableId: string | null;
  isShallow: boolean;
  onDrop: (result: DropResult) => void;
  onFileDrop?: (result: FileDropResult) => void;
}

interface DroppableProps {
  onDragEnter: React.DragEventHandler;
  onDragLeave: React.DragEventHandler;
  onDragOver: React.DragEventHandler;
  onDrop: React.DragEventHandler;
}

interface Result {
  droppableProps: DroppableProps;
  isDropping: boolean;
}

export function useDroppable({
  droppableId,
  droppable,
  isShallow,
  onDrop,
  onFileDrop,
}: Props): Result {
  const [dropCount, setDropCount] = useState(0);

  const handleDragEnter = useCallback(
    (event: React.DragEvent) => {
      if (isShallow) {
        event.stopPropagation();
      }

      if (droppable) {
        setDropCount(c => c + 1);
      }
    },
    [droppable, isShallow],
  );

  const handleDragLeave = useCallback(
    (event: React.DragEvent) => {
      if (isShallow) {
        event.stopPropagation();
      }

      if (droppable) {
        setDropCount(c => c - 1);
      }
    },
    [droppable, isShallow],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      if (droppableId === null) {
        return;
      }

      setDropCount(0);

      if (isShallow) {
        event.stopPropagation();
      }

      if (!droppable) {
        return;
      }

      if (event.dataTransfer === null) {
        throw new Error('event.dataTransfer should not be null');
      }

      if (event.dataTransfer.types.includes('Files') && onFileDrop !== undefined) {
        onFileDrop({ droppableId, dataTransfer: event.dataTransfer });
        return;
      }

      const draggableIds = event.dataTransfer.getData(TEXT_PLAIN).split(',');
      if (draggableIds.length) {
        onDrop({ draggableIds, droppableId });
      }
    },
    [droppableId, droppable, isShallow, onFileDrop, onDrop],
  );

  const droppableProps: DroppableProps = {
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    onDragOver: handleDragOver,
    onDrop: handleDrop,
  };

  return {
    droppableProps,
    isDropping: dropCount > 0,
  };
}
