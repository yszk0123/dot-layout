import React, { useCallback, useMemo, useState } from 'react';
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

const initialNodes = generateNodes();
const initialEdges: Edge[] = [];

const noop = () => {};

const App: React.FunctionComponent<{}> = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [draggingNode, setDraggingNode] = useState<Node | null>(null);
  const [dragging, setDragging] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const nodesById = useMemo(() => createLookupTable(nodes), [nodes]);

  const handleClear = useCallback(() => {
    setNodes([]);
  }, []);

  const handleAdd = useCallback(() => {
    const newNode = guessNode(nodes);
    setNodes([...nodes, newNode]);
  }, [nodes]);

  const handleClick = useCallback(
    (node: Node, event: React.MouseEvent) => {
      if (event.ctrlKey || event.metaKey) {
        if (
          selectedNodeId !== null &&
          selectedNodeId !== node.id &&
          !hasEdgeByNodeIds(edges, selectedNodeId, node.id)
        ) {
          const newEdge = { id: generateId(), start: selectedNodeId, end: node.id };
          setEdges([...edges, newEdge]);
        }
      } else {
        setSelectedNodeId(node.id);
      }
    },
    [edges, selectedNodeId],
  );

  const handleDoubleClick = useCallback(
    (node: Node, event: React.MouseEvent) => {
      const newText = prompt('text');
      if (newText !== null) {
        const newNode = { ...node, text: newText };
        setNodes(updateNode(nodes, newNode));
      }
    },
    [edges, selectedNodeId, nodes],
  );

  const handleDeselect = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  const handleRemove = useCallback(() => {
    const newNodes = nodes.filter(node => node.id !== selectedNodeId);
    const newEdges = edges.filter(
      edge => edge.start !== selectedNodeId && edge.end !== selectedNodeId,
    );
    setNodes(newNodes);
    setEdges(newEdges);
  }, [nodes, edges, selectedNodeId]);

  const handleMouseDown = useCallback(({ node }: DragPayload) => {
    setDraggingNode(node);
  }, []);

  const handleMouseUp = useCallback(
    (_: DragPayload) => {
      if (draggingNode !== null) {
        setNodes(updateNode(nodes, draggingNode));
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
