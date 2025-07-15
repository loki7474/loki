import React from 'react';
import { BarChart3, Trophy, Users, TrendingUp } from 'lucide-react';
import { useElection } from '../context/ElectionContext';

interface ElectionResultsProps {
  selectedElectionId?: string;
}

const ElectionResults: React.FC<ElectionResultsProps> = ({ selectedElectionId }) => {
  const { elections, votes } = useElection();

  const getResults = (electionId: string) => {
    const election = elections.find(e => e.id === electionId);
    if (!election) return null;

    const electionVotes = votes.filter(v => v.electionId === electionId);
    const totalVotes = electionVotes.length;

    const candidateResults = election.candidates.map(candidate => {
      const candidateVotes = electionVotes.filter(v => v.candidateId === candidate.id).length;
      const percentage = totalVotes > 0 ? (candidateVotes / totalVotes) * 100 : 0;

      return {
        ...candidate,
        votes: candidateVotes,
        percentage: percentage.toFixed(1)
      };
    });

    // Sort by votes in descending order
    candidateResults.sort((a, b) => b.votes - a.votes);

    return {
      election,
      candidates: candidateResults,
      totalVotes
    };
  };

  const electionsToShow = selectedElectionId 
    ? elections.filter(e => e.id === selectedElectionId)
    : elections;

  if (electionsToShow.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">No Results Available</h3>
        <p className="text-gray-600">Create some elections to see results here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {electionsToShow.map(election => {
        const results = getResults(election.id);
        if (!results) return null;

        const { candidates, totalVotes } = results;
        const winner = candidates[0];

        return (
          <div key={election.id} className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{election.title}</h3>
                <p className="text-gray-600">{election.description}</p>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{totalVotes} votes</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  election.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {election.status}
                </span>
              </div>
            </div>

            {totalVotes > 0 && (
              <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Leading Candidate</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-yellow-900">{winner.name}</p>
                    <p className="text-sm text-yellow-700">{winner.party}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-yellow-900">{winner.percentage}%</p>
                    <p className="text-sm text-yellow-700">{winner.votes} votes</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 mb-4">Detailed Results</h4>
              {candidates.map((candidate, index) => (
                <div key={candidate.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-600">
                        #{index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900">{candidate.name}</p>
                        <p className="text-sm text-gray-600">{candidate.party}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{candidate.percentage}%</p>
                      <p className="text-sm text-gray-600">{candidate.votes} votes</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        index === 0 ? 'bg-blue-600' : 'bg-gray-400'
                      }`}
                      style={{ width: `${candidate.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {totalVotes === 0 && (
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>No votes have been cast yet for this election.</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ElectionResults;