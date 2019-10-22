import { Dispatch, useCallback } from 'react';
import { KeyCode } from '../calculation/Keyboard';
import { Action, ActionType } from '../redux/actions';
import { useGlobalKeyboard } from './useGlobalKeyboard';

interface Options {
  dispatch: Dispatch<Action>;
  onAdd: () => void;
  onSave: () => void;
}

export function useGlobalKeyboardShortcut({ dispatch, onAdd, onSave }: Options) {
  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.code === KeyCode.KEY_A) {
        onAdd();
      } else if (event.code === KeyCode.BACKSPACE) {
        dispatch({ type: ActionType.GRAPH_REMOVE });
      } else if (event.code === KeyCode.ESCAPE) {
        dispatch({ type: ActionType.GRAPH_DESELECT });
      } else if ((event.ctrlKey || event.metaKey) && event.code === KeyCode.KEY_S) {
        onSave();
      } else {
        return;
      }
      event.preventDefault();
    },
    [dispatch, onAdd, onSave],
  );

  useGlobalKeyboard({ onKeyDown });
}
