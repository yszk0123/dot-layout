import { STORAGE_STATE_KEY, STORAGE_STATE_VERSION } from '../constants';
import { State } from './State';

interface Data {
  version: number;
  data: State;
}

export function save(state: State): void {
  const serializedState = serialize(state);
  localStorage.setItem(STORAGE_STATE_KEY, serializedState);
}

export function load(): State | null {
  const serializedData = localStorage.getItem(STORAGE_STATE_KEY);
  return deserialize(serializedData);
}

function serialize(state: State): string {
  const data: Data = { version: STORAGE_STATE_VERSION, data: state };
  return JSON.stringify(data);
}

function deserialize(serializedData: string | null): State | null {
  try {
    if (serializedData === null) {
      return null;
    }

    const deserializedData = JSON.parse(serializedData);
    if (!validate(deserializedData)) {
      return null;
    }

    return deserializedData.data;
  } catch (error) {
    return null;
  }
}

function validate(data: any): data is Data {
  return data != null && typeof data === 'object' && data.version === STORAGE_STATE_VERSION;
}
