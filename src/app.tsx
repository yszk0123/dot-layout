import React, { useCallback, useMemo, useReducer, useState } from 'react';
import ReactDOM from 'react-dom';
import { generateNodes, guessNode } from './calculation/Calculation';
import { DragPayload } from './calculation/DragPayload';
import { Edge } from './calculation/Edge';
import { generateId } from './calculation/generateId';
import { Node } from './calculation/Node';
import { EdgeView } from './components/EdgeView';
import { NodeView } from './components/NodeView';
import { Stage } from './components/Stage';
import { SCALE_X, SCALE_Y } from './constants';

const noop = () => {};

enum ActionType {
  CLEAR,
  NODE_ADD,
  NODE_REMOVE,
  NODE_UPDATE,
  NODE_SELECT,
  NODE_DESELECT,
  EDGE_ADD,
}

type Action =
  | { type: ActionType.CLEAR }
  | { type: ActionType.NODE_ADD }
  | { type: ActionType.NODE_REMOVE }
  | { type: ActionType.NODE_UPDATE; payload: { node: Node } }
  | { type: ActionType.NODE_SELECT; payload: { nodeId: string } }
  | { type: ActionType.NODE_DESELECT }
  | { type: ActionType.EDGE_ADD; payload: { start: string | null; end: string } };

interface State {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
}

function reducer(state: State, action: Action): State {
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

const initialState: State = {
  nodes: generateNodes(),
  edges: [],
  selectedNodeId: null,
};

const App: React.FunctionComponent<{}> = () => {
  const [draggingNode, setDraggingNode] = useState<Node | null>(null);
  const [dragging, setDragging] = useState(false);
  const [{ nodes, edges, selectedNodeId }, dispatch] = useReducer(reducer, initialState);
  const nodesById = useMemo(() => createLookupTable(nodes), [nodes]);

  const handleClear = useCallback(() => {
    dispatch({ type: ActionType.CLEAR });
  }, []);

  const handleAdd = useCallback(() => {
    dispatch({ type: ActionType.NODE_ADD });
  }, []);

  const handleClick = useCallback(
    (node: Node, event: React.MouseEvent) => {
      if (event.ctrlKey || event.metaKey) {
        dispatch({ type: ActionType.EDGE_ADD, payload: { start: selectedNodeId, end: node.id } });
      } else {
        dispatch({ type: ActionType.NODE_SELECT, payload: { nodeId: node.id } });
      }
    },
    [edges, selectedNodeId],
  );

  const handleDoubleClick = useCallback((node: Node) => {
    const newText = prompt('text');
    if (newText !== null) {
      const newNode = { ...node, text: newText };
      dispatch({ type: ActionType.NODE_UPDATE, payload: { node: newNode } });
    }
  }, []);

  const handleDeselect = useCallback(() => {
    dispatch({ type: ActionType.NODE_DESELECT });
  }, []);

  const handleRemove = useCallback(() => {
    dispatch({ type: ActionType.NODE_REMOVE });
  }, []);

  const handleMouseDown = useCallback(({ node }: DragPayload) => {
    setDraggingNode(node);
  }, []);

  const handleMouseUp = useCallback(
    (_: DragPayload) => {
      if (draggingNode !== null) {
        dispatch({ type: ActionType.NODE_UPDATE, payload: { node: draggingNode } });
        setDraggingNode(null);
        setDragging(false);
      }
    },
    [nodes, draggingNode],
  );

  const handleMouseMove = useCallback(
    (payload: DragPayload) => {
      if (draggingNode !== null) {
        const node = calculateDraggingNode(payload);
        if (!isEqual(node, payload.node)) {
          setDraggingNode(node);
          setDragging(true);
        }
      }
    },
    [draggingNode],
  );

  return (
    <div onClick={handleDeselect}>
      <Stage>
        {edges.map(edge => (
          <EdgeView
            key={edge.id}
            edge={edge}
            startNode={nodesById[edge.start]}
            endNode={nodesById[edge.end]}
            selected={false}
            onClick={noop}
          />
        ))}
        {nodes.map(node => (
          <NodeView
            key={node.id}
            node={node}
            selected={selectedNodeId === node.id}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          />
        ))}
        {dragging && draggingNode !== null && (
          <NodeView
            key={draggingNode.id}
            node={draggingNode}
            selected={false}
            onClick={noop}
            onDoubleClick={noop}
            onMouseDown={noop}
            onMouseUp={noop}
            onMouseMove={noop}
          />
        )}
      </Stage>
      <button onClick={handleAdd}>Add</button>
      <button onClick={handleRemove} disabled={selectedNodeId === null}>
        Remove
      </button>
      <button onClick={handleClear}>Clear</button>
    </div>
  );
};

function createLookupTable<T extends { id: string }>(values: T[]): Record<string, T> {
  const result: Record<string, T> = {};
  values.forEach(value => {
    result[value.id] = value;
  });
  return result;
}

function calculateDraggingNode({ node, start, current }: DragPayload): Node {
  const dx = (current.x - start.x) / SCALE_X;
  const dy = (current.y - start.y) / SCALE_Y;
  return { ...node, x: Math.floor(node.x + dx), y: Math.floor(node.y + dy) };
}

function isEqual(a: Node, b: Node): boolean {
  return a.id === b.id && a.x === b.x && a.y === b.y;
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

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
