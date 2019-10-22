export const TEXT_PLAIN = 'text/plain';

export interface DropResult {
  readonly draggableIds: string[];
  readonly droppableId: string;
}

export interface FileDropResult {
  readonly dataTransfer: DataTransfer;
  readonly droppableId: string;
}
