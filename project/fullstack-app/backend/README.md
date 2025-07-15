# Backend API Documentation

## Overview
This is the backend for the fullstack application, built using Node.js and Express. It connects to a database (MongoDB) and provides a set of API endpoints for the frontend to interact with.

## Setup Instructions

1. **Clone the repository**
   ```
   git clone <repository-url>
   cd fullstack-app/backend
   ```

2. **Install dependencies**
   ```
   npm install
   ```

3. **Set up the database**
   Ensure you have MongoDB installed and running. Update the database connection settings in `src/db/connection.js` if necessary.

4. **Start the server**
   ```
   npm start
   ```

   The server will run on `http://localhost:5000` by default.

## API Endpoints

### Items

- **GET /items**
  - Description: Retrieve a list of items.
  - Response: JSON array of items.

- **POST /items**
  - Description: Create a new item.
  - Request Body: JSON object representing the item.
  - Response: JSON object of the created item.

- **PUT /items/:id**
  - Description: Update an existing item by ID.
  - Request Body: JSON object with updated item data.
  - Response: JSON object of the updated item.

- **DELETE /items/:id**
  - Description: Delete an item by ID.
  - Response: JSON object confirming deletion.

## Usage Examples

### Fetching Items
```javascript
fetch('http://localhost:5000/items')
  .then(response => response.json())
  .then(data => console.log(data));
```

### Creating an Item
```javascript
fetch('http://localhost:5000/items', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ name: 'New Item', description: 'Item description' }),
})
.then(response => response.json())
.then(data => console.log(data));
```

## License
This project is licensed under the MIT License.