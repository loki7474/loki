import React, { useState, useEffect } from 'react';
import { Vote, Shield, Users, BarChart3, Settings, LogOut, Mail, Lock, CheckCircle } from 'lucide-react';
import LoginForm from './components/LoginForm';
import VotingInterface from './components/VotingInterface';
import AdminDashboard from './components/AdminDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ElectionProvider } from './context/ElectionContext';
import { localStorageService } from './lib/localStorage';
import './App.css';

function AppContent() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'vote' | 'admin'>('vote');

  // Initialize local storage data on app start
  useEffect(() => {
    localStorageService.initializeData();
  }, []);

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <Vote className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SecureVote</h1>
                <p className="text-sm text-gray-500">Online Voting System</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Verified: {user.email}</span>
                </div>
              </div>
              
              {user.role === 'admin' && (
                <div className="flex rounded-lg bg-gray-100 p-1">
                  <button
                    onClick={() => setActiveTab('vote')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                      activeTab === 'vote'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Users className="w-4 h-4 inline mr-1" />
                    Vote
                  </button>
                  <button
                    onClick={() => setActiveTab('admin')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                      activeTab === 'admin'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Settings className="w-4 h-4 inline mr-1" />
                    Admin
                  </button>
                </div>
              )}
              
              <button
                onClick={logout}
                className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'vote' ? <VotingInterface /> : <AdminDashboard />}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ElectionProvider>
        <AppContent />
      </ElectionProvider>
    </AuthProvider>
  );
}

export default App;