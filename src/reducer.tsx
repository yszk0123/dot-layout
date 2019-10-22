import { Action, ActionType } from './actions';
import { generateNodes, guessNode } from './calculation/Calculation';
import { Edge } from './calculation/Edge';
import { generateId } from './calculation/generateId';
import { Node } from './calculation/Node';

interface State {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
}

export const initialState: State = {
  nodes: generateNodes(),
  edges: [],
  selectedNodeId: null,
};

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionType.CLEAR: {
      return { ...state, nodes: [], edges: [], selectedNodeId: null };
    }
    case ActionType.NODE_ADD: {
      const newNode = guessNode(state.nodes);
      return {
        ...state,
        nodes: [...state.nodes, newNode],
      };
    }
    case ActionType.NODE_REMOVE: {
      const newNodes = state.nodes.filter(node => node.id !== state.selectedNodeId);
      const newEdges = state.edges.filter(
        edge => edge.start !== state.selectedNodeId && edge.end !== state.selectedNodeId,
      );
      return { ...state, nodes: newNodes, edges: newEdges };
    }
    case ActionType.NODE_SELECT: {
      const { nodeId } = action.payload;
      return { ...state, selectedNodeId: nodeId };
    }
    case ActionType.NODE_UPDATE: {
      const { node } = action.payload;
      return { ...state, nodes: updateNode(state.nodes, node) };
    }
    case ActionType.NODE_DESELECT: {
      return { ...state, selectedNodeId: null };
    }
    case ActionType.EDGE_ADD: {
      const { start, end } = action.payload;
      if (start === null || start === end || hasEdgeByNodeIds(state.edges, start, end)) {
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

// function hasEdgeByNodeId(edges: Edge[], nodeId: string): boolean {
//   return !!edges.find(edge => edge.start === nodeId || edge.end === nodeId);
// }

function hasEdgeByNodeIds(edges: Edge[], nodeId1: string, nodeId2: string): boolean {
  return !!edges.find(
    edge =>
      (edge.start === nodeId1 && edge.end === nodeId2) ||
      (edge.start === nodeId2 && edge.end === nodeId1),
  );
}