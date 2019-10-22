import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { DragPayload } from './calculation/DragPayload';
import { Edge } from './calculation/Edge';
import { Node } from './calculation/Node';
import { Stage } from './calculation/Stage';
import { load, save } from './calculation/Storage';
import { ControlPanel } from './components/ControlPanel';
import { EdgeView } from './components/EdgeView';
import { NodeView } from './components/NodeView';
import { StageView } from './components/StageView';
import { useGlobalKeyboardShortcut } from './hooks/useGlobalKeyboardShortcut';
import { useResize } from './hooks/useResize';
import { ActionType } from './redux/actions';
import { initialState, reducer } from './redux/reducer';

const noop = () => {};

const initialStage: Stage = { width: 1, height: 1 };

const App: React.FunctionComponent<{}> = () => {
  const stageContainerRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(initialStage);
  const [draggingNode, setDraggingNode] = useState<Node | null>(null);
  const [dragging, setDragging] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { nodes, edges, selectedId } = state;
  const nodesById = useMemo(() => createLookupTable(nodes), [nodes]);

  const handleClear = useCallback(() => {
    dispatch({ type: ActionType.GRAPH_CLEAR });
  }, []);

  const handleAdd = useCallback(() => {
    dispatch({ type: ActionType.NODE_ADD, payload: { stage } });
  }, [stage]);

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
    const newText = prompt('text', node.text);
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

  const handleSave = useCallback(() => {
    save(state);
  }, [state]);

  const handleRandomize = useCallback(() => {
    dispatch({ type: ActionType.APP_RANDOMIZE, payload: { stage } });
  }, [stage]);

  const handleResize = useCallback(() => {
    if (stageContainerRef.current === null) {
      return;
    }

    const { width, height } = stageContainerRef.current.getBoundingClientRect();
    setStage({ width, height });
  }, [stageContainerRef]);

  useEffect(() => {
    const loadedState = load();
    if (loadedState !== null) {
      dispatch({ type: ActionType.APP_LOAD, payload: { state: loadedState } });
    }
  }, []);

  useResize(handleResize);

  useEffect(handleResize, []);

  useGlobalKeyboardShortcut({
    dispatch,
    onAdd: handleAdd,
    onSave: handleSave,
  });

  return (
    <div className="App" onClick={handleDeselect}>
      <ControlPanel
        onAdd={handleAdd}
        onRemove={handleRemove}
        onClear={handleClear}
        onRandomize={handleRandomize}
        onSave={handleSave}
        canRemove={selectedId !== null}
      />
      <div className="StageContainer" ref={stageContainerRef}>
        <StageView stage={stage}>
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
        </StageView>
      </div>
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
  const dx = current.x - start.x;
  const dy = current.y - start.y;
  return { ...node, x: Math.floor(node.x + dx), y: Math.floor(node.y + dy) };
}

function isEqual(a: Node, b: Node): boolean {
  return a.id === b.id && a.x === b.x && a.y === b.y;
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
