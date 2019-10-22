import { generate } from 'shortid';

export function generateId(): string {
  return generate();
}
