import React, { useState, useEffect } from 'react';
import { Vote, Clock, CheckCircle, AlertCircle, Users, Trophy, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useElection } from '../context/ElectionContext';

const VotingInterface: React.FC = () => {
  const { user } = useAuth();
  const { elections, votes, castVote, hasVoted } = useElection();
  const [selectedElection, setSelectedElection] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const activeElections = elections.filter(e => e.status === 'active');
  const currentElection = selectedElection ? elections.find(e => e.id === selectedElection) : null;

  const handleVote = async () => {
    if (!selectedElection || !selectedCandidate || !user?.email) return;

    setLoading(true);
    try {
      await castVote(selectedElection, selectedCandidate, user.email);
      setShowConfirmation(true);
      setSelectedCandidate(null);
    } catch (error) {
      console.error('Vote failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getVoteStatus = (electionId: string) => {
    return hasVoted(electionId, user?.email || '');
  };

  const getElectionResults = (electionId: string) => {
    const electionVotes = votes.filter(v => v.electionId === electionId);
    const results = electionVotes.reduce((acc, vote) => {
      acc[vote.candidateId] = (acc[vote.candidateId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return results;
  };

  if (activeElections.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Vote className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">No Active Elections</h3>
        <p className="text-gray-600">There are currently no elections available for voting.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center fade-in">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Vote Now</h2>
        <p className="text-gray-600">Select an election below to cast your vote</p>
      </div>

      {/* Elections List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {activeElections.map((election) => {
          const voted = getVoteStatus(election.id);
          const results = getElectionResults(election.id);
          const totalVotes = Object.values(results).reduce((sum, count) => sum + count, 0);

          return (
            <div
              key={election.id}
              className={`vote-card bg-white rounded-xl shadow-sm border-2 p-6 cursor-pointer transition-all ${
                selectedElection === election.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${voted ? 'opacity-75' : ''}`}
              onClick={() => !voted && setSelectedElection(election.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{election.title}</h3>
                    <p className="text-sm text-gray-600">{election.description}</p>
                  </div>
                </div>
                {voted && (
                  <div className="flex items-center space-x-1 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Voted</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Ends: {new Date(election.endDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{totalVotes} votes cast</span>
                </div>
              </div>

              {voted && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">
                    ✓ You have successfully voted in this election
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Voting Interface */}
      {selectedElection && currentElection && !getVoteStatus(selectedElection) && (
        <div className="bg-white rounded-xl shadow-sm border p-8 slide-up">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{currentElection.title}</h3>
            <p className="text-gray-600">{currentElection.description}</p>
          </div>

          <div className="space-y-4 mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Select a Candidate:</h4>
            {currentElection.candidates.map((candidate) => (
              <div
                key={candidate.id}
                className={`candidate-card border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedCandidate === candidate.id
                    ? 'border-blue-500 bg-blue-50 selected'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedCandidate(candidate.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-gray-700">
                      {candidate.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900">{candidate.name}</h5>
                    <p className="text-sm text-gray-600">{candidate.party}</p>
                  </div>
                  {selectedCandidate === candidate.id && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setSelectedElection(null)}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleVote}
              disabled={!selectedCandidate || loading}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full loading-spinner"></div>
                  <span>Casting Vote...</span>
                </div>
              ) : (
                'Cast Vote'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 slide-up">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Vote Submitted!</h3>
              <p className="text-gray-600 mb-6">Your vote has been successfully recorded and cannot be changed.</p>
              <button
                onClick={() => setShowConfirmation(false)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VotingInterface;