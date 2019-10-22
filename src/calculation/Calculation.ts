import { LOGICAL_HEIGHT, LOGICAL_WIDTH } from '../constants';
import { generateId } from './generateId';
import { generateN } from './generateN';
import { Node } from './Node';

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Result {
  box: Box;
  nodes: Node[];
}

function repeat(n: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < n; i += 1) {
    result.push(i);
  }
  return result;
}

function generateNode(): Node {
  const id = generateId();
  const x = generateN(LOGICAL_WIDTH);
  const y = generateN(LOGICAL_HEIGHT);
  return { id, x, y, text: 'sample' };
}

export function generateNodes(): Node[] {
  return repeat(5).map(() => generateNode());
}

export function guessNode(nodes: Node[]): Node {
  const box0 = { x: 0, y: 0, w: LOGICAL_WIDTH, h: LOGICAL_HEIGHT };
  const box = calculateAvailableBox(box0, nodes);
  const id = generateId();
  const x = box.x + box.w / 2;
  const y = box.y + box.h / 2;
  return { id, x, y, text: '' };
}

function calculateAvailableBox(box: Box, nodes: Node[]): Box {
  if (nodes.length === 0) {
    return box;
  }

  const w2 = box.w / 2;
  const h2 = box.h / 2;
  const cx = box.x + w2;
  const cy = box.y + h2;
  const lt: Result = { box: { x: box.x, y: box.y, w: w2, h: h2 }, nodes: [] };
  const rt: Result = { box: { x: cx, y: box.y, w: w2, h: h2 }, nodes: [] };
  const lb: Result = { box: { x: box.x, y: cy, w: w2, h: h2 }, nodes: [] };
  const rb: Result = { box: { x: cx, y: cy, w: w2, h: h2 }, nodes: [] };

  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i];
    if (node.x <= cx) {
      if (node.y <= cy) {
        lt.nodes.push(node);
      } else {
        lb.nodes.push(node);
      }
    } else {
      if (node.y <= cy) {
        rt.nodes.push(node);
      } else {
        rb.nodes.push(node);
      }
    }
  }

  const min = sortByLength([lt, rt, lb, rb]);
  return isSame(nodes, min.nodes) ? min.box : calculateAvailableBox(min.box, min.nodes);
}

function isSame(xs: Node[], ys: Node[]): boolean {
  return xs.length === ys.length && xs.every((x, i) => x === ys[i]);
}

function sortByLength(xs: Result[]): Result {
  return xs.slice(0).sort((x, y) => x.nodes.length - y.nodes.length)[0];
}
