import React, { useCallback, useState } from 'react';
import ReactDOM from 'react-dom';
import { generateNodes, guessNode } from './calculation/Calculation';
import { DragPayload } from './calculation/DragPayload';
import { Node } from './calculation/Node';
import { NodeView } from './components/NodeView';
import { Stage } from './components/Stage';
import { SCALE_X, SCALE_Y } from './constants';

const initialNodes = generateNodes();

const noop = () => {};

const App: React.FunctionComponent<{}> = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [draggingNode, setDraggingNode] = useState<Node | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleClear = useCallback(() => {
    setNodes([]);
  }, []);

  const handleAdd = useCallback(() => {
    const newNode = guessNode(nodes);
    setNodes([...nodes, newNode]);
  }, [nodes]);

  const handleRemove = useCallback(
    (id: string) => {
      const newNodes = nodes.filter(node => node.id !== id);
      setNodes(newNodes);
    },
    [nodes],
  );

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
    <div>
      <Stage>
        {nodes.map(node => (
          <NodeView
            key={node.id}
            node={node}
            onClick={() => handleRemove(node.id)}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          />
        ))}
        {dragging && draggingNode !== null && (
          <NodeView
            key={draggingNode.id}
            node={draggingNode}
            onClick={noop}
            onMouseDown={noop}
            onMouseUp={noop}
            onMouseMove={noop}
          />
        )}
      </Stage>
      <button onClick={handleAdd}>Add</button>
      <button onClick={handleClear}>Clear</button>
    </div>
  );
};

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

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
