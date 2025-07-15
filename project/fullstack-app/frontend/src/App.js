import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ItemList from './components/ItemList';
import VotingForm from './components/VotingForm';
import AdminDashboard from './components/AdminDashboard';
import UserLoginForm from './components/UserLoginForm';
import AdminLoginForm from './components/AdminLoginForm';
// import ItemForm from './components/ItemForm';

// import LoginForm from './components/LoginForm';

function App() {
  const [user, setUser] = useState(null);
  return (
    <Router>
      <div>
        <h1>Fullstack App</h1>
        <Switch>
          <Route path="/" exact>
            <UserLoginForm setUser={setUser} />
          </Route>
          <Route path="/vote">
            {user && user.role === 'voter' ? <VotingForm /> : <UserLoginForm setUser={setUser} />}
          </Route>
          <Route path="/admin-login">
            <AdminLoginForm setUser={setUser} />
          </Route>
          <Route path="/admin">
            {user && user.role === 'admin' ? <AdminDashboard /> : <AdminLoginForm setUser={setUser} />}
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;