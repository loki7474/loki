import React, { useState } from 'react';
import { Plus, X, Calendar, Users } from 'lucide-react';
import { useElection } from '../context/ElectionContext';

interface CreateElectionModalProps {
  onClose: () => void;
  onElectionCreated: () => void;
}

const CreateElectionModal: React.FC<CreateElectionModalProps> = ({ onClose, onElectionCreated }) => {
  const { createElection } = useElection();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [endDate, setEndDate] = useState('');
  const [candidates, setCandidates] = useState([{ name: '', party: '' }]);
  const [loading, setLoading] = useState(false);

  const addCandidate = () => {
    setCandidates([...candidates, { name: '', party: '' }]);
  };

  const removeCandidate = (index: number) => {
    setCandidates(candidates.filter((_, i) => i !== index));
  };

  const updateCandidate = (index: number, field: 'name' | 'party', value: string) => {
    const updated = [...candidates];
    updated[index][field] = value;
    setCandidates(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validCandidates = candidates.filter(c => c.name.trim() && c.party.trim());
      
      if (validCandidates.length < 2) {
        alert('Please add at least 2 candidates');
        return;
      }

      await createElection({
        title,
        description,
        endDate,
        candidates: validCandidates.map(c => ({
          id: `candidate_${Date.now()}_${Math.random()}`,
          name: c.name,
          party: c.party
        }))
      });

      onElectionCreated();
    } catch (error) {
      console.error('Failed to create election:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Create New Election</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Election Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Student Council Election 2024"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of the election..."
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Candidates
              </label>
              <button
                type="button"
                onClick={addCandidate}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Candidate</span>
              </button>
            </div>

            <div className="space-y-4">
              {candidates.map((candidate, index) => (
                <div key={index} className="flex space-x-3 items-center">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={candidate.name}
                      onChange={(e) => updateCandidate(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Candidate name"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={candidate.party}
                      onChange={(e) => updateCandidate(index, 'party', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Party/Position"
                      required
                    />
                  </div>
                  {candidates.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCandidate(index)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating...' : 'Create Election'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateElectionModal;