import { Edge } from './Edge';
import { Node } from './Node';
export interface State {
  nodes: Node[];
  edges: Edge[];
  selectedId: string | null;
}
