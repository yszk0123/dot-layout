import { Dispatch, useCallback } from 'react';
import { KeyCode } from '../calculation/Keyboard';
import { Action, ActionType } from '../redux/actions';
import { useGlobalKeyboard } from './useGlobalKeyboard';

interface Options {
  dispatch: Dispatch<Action>;
  onSave: () => void;
}

export function useGlobalKeyboardShortcut({ dispatch, onSave }: Options) {
  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.code === KeyCode.KEY_A) {
        dispatch({ type: ActionType.NODE_ADD });
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
    [dispatch, onSave],
  );

  useGlobalKeyboard({ onKeyDown });
}
