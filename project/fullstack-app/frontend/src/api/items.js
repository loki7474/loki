// API functions to connect frontend to backend

export async function getItems() {
  const response = await fetch('http://localhost:5000/api/items');
  if (!response.ok) throw new Error('Failed to fetch items');
  return response.json();
}

export async function addItem(item) {
  const response = await fetch('http://localhost:5000/api/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!response.ok) throw new Error('Failed to add item');
  return response.json();
}
