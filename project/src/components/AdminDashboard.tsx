import React, { useState } from 'react';
import { Plus, Edit, Trash2, Users, BarChart3, Calendar, Trophy, Eye, Clock } from 'lucide-react';
import { useElection } from '../context/ElectionContext';
import CreateElectionModal from './CreateElectionModal';
import ElectionResults from './ElectionResults';
import UserManagement from './UserManagement';

const AdminDashboard: React.FC = () => {
  const { elections, deleteElection, updateElectionStatus, votes } = useElection();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedElection, setSelectedElection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'elections' | 'results' | 'users'>('elections');

  const getElectionStats = (electionId: string) => {
    const electionVotes = votes.filter(v => v.electionId === electionId);
    return {
      totalVotes: electionVotes.length,
      participation: electionVotes.length // In a real app, this would be calculated against registered voters
    };
  };

  const handleStatusToggle = (electionId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    updateElectionStatus(electionId, newStatus);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
          <p className="text-gray-600 mt-1">Manage elections and view results</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Create Election</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Elections</p>
              <p className="text-2xl font-bold text-gray-900">{elections.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Elections</p>
              <p className="text-2xl font-bold text-gray-900">
                {elections.filter(e => e.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Votes</p>
              <p className="text-2xl font-bold text-gray-900">{votes.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('elections')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'elections'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Elections
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'results'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Results
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Users
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'elections' ? (
        <div className="space-y-6">
          {elections.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Elections Created</h3>
              <p className="text-gray-600 mb-6">Create your first election to get started.</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Election
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              {elections.map((election) => {
                const stats = getElectionStats(election.id);
                return (
                  <div key={election.id} className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Trophy className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{election.title}</h3>
                          <p className="text-sm text-gray-600">{election.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          election.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {election.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>End: {new Date(election.endDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{stats.totalVotes} votes cast</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <BarChart3 className="w-4 h-4" />
                        <span>{election.candidates.length} candidates</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusToggle(election.id, election.status)}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            election.status === 'active'
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {election.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => setSelectedElection(election.id)}
                          className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          <Eye className="w-4 h-4 inline mr-1" />
                          View Results
                        </button>
                      </div>
                      <button
                        onClick={() => deleteElection(election.id)}
                        className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 inline mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : activeTab === 'results' ? (
        <ElectionResults />
      ) : (
        <UserManagement />
      )}

      {/* Create Election Modal */}
      {showCreateModal && (
        <CreateElectionModal
          onClose={() => setShowCreateModal(false)}
          onElectionCreated={() => setShowCreateModal(false)}
        />
      )}

      {/* Results Modal */}
      {selectedElection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Election Results</h3>
              <button
                onClick={() => setSelectedElection(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <ElectionResults selectedElectionId={selectedElection} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;