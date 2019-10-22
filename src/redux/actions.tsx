import { Node } from '../calculation/Node';
import { Stage } from '../calculation/Stage';
import { State } from '../calculation/State';

export enum ActionType {
  APP_LOAD,
  APP_RANDOMIZE,
  GRAPH_CLEAR,
  NODE_ADD,
  GRAPH_REMOVE,
  NODE_UPDATE,
  GRAPH_SELECT,
  GRAPH_DESELECT,
  EDGE_ADD,
}

export type Action =
  | {
      type: ActionType.APP_LOAD;
      payload: { state: State };
    }
  | {
      type: ActionType.APP_RANDOMIZE;
      payload: { stage: Stage };
    }
  | {
      type: ActionType.GRAPH_CLEAR;
    }
  | {
      type: ActionType.NODE_ADD;
      payload: { stage: Stage };
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
