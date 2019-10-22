import { Node } from './Node';
import { Point } from './Point';

export interface DragPayload {
  node: Node;
  start: Point;
  current: Point;
}
