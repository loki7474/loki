import React, { useEffect, useState } from 'react';
import { getItems, addItem } from '../api/items';

function ItemList() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getItems()
      .then(setItems)
      .catch(err => setError(err.message));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const newItem = await addItem({ name, value: Number(value) });
      setItems([...items, newItem]);
      setName('');
      setValue('');
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Items</h2>
      {error && <div style={{color: 'red'}}>{error}</div>}
      <ul>
        {items.map(item => (
          <li key={item._id}>{item.name}: {item.value}</li>
        ))}
      </ul>
      <form onSubmit={handleAdd}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Value"
          type="number"
          required
        />
        <button type="submit">Add Item</button>
      </form>
    </div>
  );
}

export default ItemList;
