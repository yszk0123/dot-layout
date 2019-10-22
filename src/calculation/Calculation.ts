import { generateId } from './generateId';
import { generateN } from './generateN';

const N = 100;

interface Item {
  id: string;
  x: number;
  y: number;
}

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Result {
  box: Box;
  items: Item[];
}

function repeat(n: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < n; i += 1) {
    result.push(i);
  }
  return result;
}

export function getItem(): Item {
  const id = generateId();
  const x = generateN(N);
  const y = generateN(N);
  return { id, x, y };
}

export function getItems(): Item[] {
  return repeat(5).map(() => getItem());
}

export function guessItem(items: Item[]): Item {
  const box0 = { x: 0, y: 0, w: 100, h: 100 };
  const box = calculateAvailableBox(box0, items);
  const id = generateId();
  const x = box.x + box.w / 2;
  const y = box.y + box.h / 2;
  return { id, x, y };
}

function calculateAvailableBox(box: Box, items: Item[]): Box {
  const w2 = box.w / 2;
  const h2 = box.h / 2;
  const cx = box.x + w2;
  const cy = box.y + h2;
  const lt: Result = { box: { x: box.x, y: box.y, w: w2, h: h2 }, items: [] };
  const rt: Result = { box: { x: cx, y: box.y, w: w2, h: h2 }, items: [] };
  const lb: Result = { box: { x: box.x, y: cy, w: w2, h: h2 }, items: [] };
  const rb: Result = { box: { x: cx, y: cy, w: w2, h: h2 }, items: [] };

  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    if (item.x <= cx) {
      if (item.y <= cy) {
        lt.items.push(item);
      } else {
        lb.items.push(item);
      }
    } else {
      if (item.y <= cy) {
        rt.items.push(item);
      } else {
        rb.items.push(item);
      }
    }
  }

  const min = sortByLength([lt, rt, lb, rb]);
  return isEmpty(min) || isSame(items, min.items)
    ? min.box
    : calculateAvailableBox(min.box, min.items);
}

function isSame(xs: Item[], ys: Item[]): boolean {
  return xs.length === ys.length && xs.every((x, i) => x === ys[i]);
}

function sortByLength(xs: Result[]): Result {
  return xs.slice(0).sort((x, y) => x.items.length - y.items.length)[0];
}

function isEmpty(r: Result): boolean {
  return r.items.length === 0;
}
