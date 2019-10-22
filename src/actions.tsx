import { Node } from './calculation/Node';

export enum ActionType {
  CLEAR,
  NODE_ADD,
  NODE_REMOVE,
  NODE_UPDATE,
  NODE_SELECT,
  NODE_DESELECT,
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
      type: ActionType.NODE_REMOVE;
    }
  | {
      type: ActionType.NODE_UPDATE;
      payload: {
        node: Node;
      };
    }
  | {
      type: ActionType.NODE_SELECT;
      payload: {
        nodeId: string;
      };
    }
  | {
      type: ActionType.NODE_DESELECT;
    }
  | {
      type: ActionType.EDGE_ADD;
      payload: {
        start: string | null;
        end: string;
      };
    };
