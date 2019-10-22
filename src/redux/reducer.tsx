import { generateNodes, guessNode } from '../calculation/Calculation';
import { Edge } from '../calculation/Edge';
import { generateId } from '../calculation/generateId';
import { Node } from '../calculation/Node';
import { State } from '../calculation/State';
import { Action, ActionType } from './actions';

export const initialState: State = {
  nodes: [],
  edges: [],
  selectedId: null,
};

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionType.APP_LOAD: {
      return action.payload.state;
    }
    case ActionType.APP_RANDOMIZE: {
      const { stage } = action.payload;
      const newState: State = {
        nodes: generateNodes(stage),
        edges: [],
        selectedId: null,
      };
      return newState;
    }
    case ActionType.GRAPH_CLEAR: {
      return { ...state, nodes: [], edges: [], selectedId: null };
    }
    case ActionType.GRAPH_REMOVE: {
      const newNodes = state.nodes.filter(node => node.id !== state.selectedId);
      const newEdges = state.edges.filter(
        edge =>
          edge.id !== state.selectedId &&
          edge.start !== state.selectedId &&
          edge.end !== state.selectedId,
      );
      return { ...state, nodes: newNodes, edges: newEdges };
    }
    case ActionType.GRAPH_SELECT: {
      const { id } = action.payload;
      return { ...state, selectedId: id };
    }
    case ActionType.GRAPH_DESELECT: {
      return { ...state, selectedId: null };
    }
    case ActionType.NODE_ADD: {
      const { stage } = action.payload;
      const newNode = guessNode(state.nodes, stage);
      return {
        ...state,
        nodes: [...state.nodes, newNode],
      };
    }
    case ActionType.NODE_UPDATE: {
      const { node } = action.payload;
      return { ...state, nodes: updateNode(state.nodes, node) };
    }
    case ActionType.EDGE_ADD: {
      const { start, end } = action.payload;
      if (
        start === null ||
        start === end ||
        !hasNodeById(state.nodes, start) ||
        !hasNodeById(state.nodes, end) ||
        hasEdgeByNodeIds(state.edges, start, end)
      ) {
        return state;
      }
      const newEdge = { id: generateId(), start, end };
      return {
        ...state,
        edges: [...state.edges, newEdge],
      };
    }
    default:
      return state;
  }
}

function updateNode(nodes: Node[], newNode: Node): Node[] {
  return nodes.map(node => (node.id === newNode.id ? newNode : node));
}

function hasNodeById(nodes: Node[], id: string): boolean {
  return !!nodes.find(node => node.id === id);
}

function hasEdgeByNodeIds(edges: Edge[], nodeId1: string, nodeId2: string): boolean {
  return !!edges.find(
    edge =>
      (edge.start === nodeId1 && edge.end === nodeId2) ||
      (edge.start === nodeId2 && edge.end === nodeId1),
  );
}
