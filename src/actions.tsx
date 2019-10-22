import { Node } from './calculation/Node';

export enum ActionType {
  CLEAR,
  NODE_ADD,
  GRAPH_REMOVE,
  NODE_UPDATE,
  GRAPH_SELECT,
  GRAPH_DESELECT,
  EDGE_ADD,
}

export type Action =
  | {
      type: ActionType.CLEAR;
    }
  | {
      type: ActionType.NODE_ADD;
    }
  | {
      type: ActionType.GRAPH_REMOVE;
    }
  | {
      type: ActionType.NODE_UPDATE;
      payload: {
        node: Node;
      };
    }
  | {
      type: ActionType.GRAPH_SELECT;
      payload: {
        id: string;
      };
    }
  | {
      type: ActionType.GRAPH_DESELECT;
    }
  | {
      type: ActionType.EDGE_ADD;
      payload: {
        start: string | null;
        end: string;
      };
    };
