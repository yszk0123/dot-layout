import React from 'react';
import { Button } from './Button';

export const ControlPanel: React.FunctionComponent<{
  onAdd: () => void;
  onRemove: () => void;
  onClear: () => void;
  onSave: () => void;
  onRandomize: () => void;
  canRemove: boolean;
}> = ({ onAdd, onRemove, onClear, onRandomize, onSave, canRemove }) => {
  return (
    <div className="ControlPanel">
      <Button className="ControlPanel__button" onClick={onAdd}>
        Add
      </Button>
      <Button className="ControlPanel__button" onClick={onRemove} disabled={!canRemove}>
        Remove
      </Button>
      <Button className="ControlPanel__button" onClick={onClear}>
        Clear
      </Button>
      <Button className="ControlPanel__button" onClick={onRandomize}>
        Randomize
      </Button>
      <Button className="ControlPanel__button" onClick={onSave}>
        Save
      </Button>
    </div>
  );
};
