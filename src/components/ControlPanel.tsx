import React from 'react';

export const ControlPanel: React.FunctionComponent<{
  onAdd: () => void;
  onRemove: () => void;
  onClear: () => void;
  canRemove: boolean;
}> = ({ onAdd, onRemove, onClear, canRemove }) => {
  return (
    <div className="ControlPanel">
      <button onClick={onAdd}>Add</button>
      <button onClick={onRemove} disabled={!canRemove}>
        Remove
      </button>
      <button onClick={onClear}>Clear</button>
    </div>
  );
};
