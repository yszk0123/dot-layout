import React, { useCallback, useState } from 'react';
import ReactDOM from 'react-dom';
import { getItems, guessItem } from './calculation/Calculation';
import { Point } from './components/Point';
import { Stage } from './components/Stage';

const initialItems = getItems();

const App: React.FunctionComponent<{}> = () => {
  const [items, setItems] = useState(initialItems);

  const handleAdd = useCallback(() => {
    const newItem = guessItem(items);
    setItems([...items, newItem]);
  }, [items]);

  const handleRemove = useCallback(
    (id: string) => {
      const newItems = items.filter(item => item.id !== id);
      setItems(newItems);
    },
    [items],
  );

  return (
    <div>
      <Stage>
        {items.map(item => (
          <Point
            key={item.id}
            id={item.id}
            x={item.x}
            y={item.y}
            onClick={() => handleRemove(item.id)}
          />
        ))}
      </Stage>
      <button onClick={handleAdd}>Add</button>
    </div>
  );
};

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
