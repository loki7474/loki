# Frontend Documentation

## Overview

This is the frontend part of the fullstack application built with React. It interacts with the backend API to perform various operations.

## Getting Started

To get started with the frontend, follow these steps:

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd fullstack-app/frontend
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Run the application**:
   ```
   npm start
   ```

   This will start the development server and open the application in your default web browser.

## Folder Structure

- `src/`: Contains the source code for the React application.
  - `App.js`: The main component that sets up routing and layout.
  - `components/`: Contains reusable React components.
  - `api/`: Contains functions for making API calls to the backend.

## API Integration

The frontend communicates with the backend through the following API endpoints:

- `GET /items`: Fetches a list of items.
- `POST /items`: Creates a new item.
- `PUT /items/:id`: Updates an existing item.
- `DELETE /items/:id`: Deletes an item.

## Components

- **ItemList**: Displays a list of items fetched from the backend.
- **ItemForm**: A form for creating and updating items.

## Contributing

If you would like to contribute to this project, please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License.