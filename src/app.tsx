import React, { useCallback, useMemo, useReducer, useState } from 'react';
import ReactDOM from 'react-dom';
import { DragPayload } from './calculation/DragPayload';
import { Edge } from './calculation/Edge';
import { Node } from './calculation/Node';
import { ControlPanel } from './components/ControlPanel';
import { EdgeView } from './components/EdgeView';
import { NodeView } from './components/NodeView';
import { Stage } from './components/Stage';
import { SCALE_X, SCALE_Y } from './constants';
import { ActionType } from './redux/actions';
import { initialState, reducer } from './redux/reducer';

const noop = () => {};

const App: React.FunctionComponent<{}> = () => {
  const [draggingNode, setDraggingNode] = useState<Node | null>(null);
  const [dragging, setDragging] = useState(false);
  const [{ nodes, edges, selectedId }, dispatch] = useReducer(reducer, initialState);
  const nodesById = useMemo(() => createLookupTable(nodes), [nodes]);

  const handleClear = useCallback(() => {
    dispatch({ type: ActionType.GRAPH_CLEAR });
  }, []);

  const handleAdd = useCallback(() => {
    dispatch({ type: ActionType.NODE_ADD });
  }, []);

  const handleClickNode = useCallback(
    (node: Node, event: React.MouseEvent) => {
      if (event.ctrlKey || event.metaKey) {
        dispatch({ type: ActionType.EDGE_ADD, payload: { start: selectedId, end: node.id } });
      } else {
        dispatch({ type: ActionType.GRAPH_SELECT, payload: { id: node.id } });
      }
    },
    [selectedId],
  );

  const handleClickEdge = useCallback((edge: Edge) => {
    dispatch({ type: ActionType.GRAPH_SELECT, payload: { id: edge.id } });
  }, []);

  const handleDoubleClick = useCallback((node: Node) => {
    const newText = prompt('text');
    if (newText !== null) {
      const newNode = { ...node, text: newText };
      dispatch({ type: ActionType.NODE_UPDATE, payload: { node: newNode } });
    }
  }, []);

  const handleDeselect = useCallback(() => {
    dispatch({ type: ActionType.GRAPH_DESELECT });
  }, []);

  const handleRemove = useCallback(() => {
    dispatch({ type: ActionType.GRAPH_REMOVE });
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
    [draggingNode],
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
    <div className="App" onClick={handleDeselect}>
      <ControlPanel
        onAdd={handleAdd}
        onRemove={handleRemove}
        onClear={handleClear}
        canRemove={selectedId !== null}
      />
      <Stage>
        {edges.map(edge => (
          <EdgeView
            key={edge.id}
            edge={edge}
            startNode={nodesById[edge.start]}
            endNode={nodesById[edge.end]}
            selected={selectedId === edge.id}
            onClick={handleClickEdge}
          />
        ))}
        {nodes.map(node => (
          <NodeView
            key={node.id}
            node={node}
            selected={selectedId === node.id}
            onClick={handleClickNode}
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

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
