import React, { createContext, useContext, useState, useEffect } from 'react';
import { ElectionService, Election as DBElection, Candidate as DBCandidate, Vote as DBVote } from '../services/electionService';

interface Candidate extends DBCandidate {
}

interface Election extends Omit<DBElection, 'start_date' | 'end_date'> {
  candidates: Candidate[];
  startDate: string;
  endDate: string;
}

interface Vote extends DBVote {
}

interface ElectionContextType {
  elections: Election[];
  votes: Vote[];
  createElection: (electionData: Omit<Election, 'id' | 'startDate' | 'status'>) => Promise<void>;
  deleteElection: (electionId: string) => void;
  updateElectionStatus: (electionId: string, status: Election['status']) => void;
  castVote: (electionId: string, candidateId: string, voterEmail: string) => Promise<void>;
  hasVoted: (electionId: string, voterEmail: string) => boolean;
}

const ElectionContext = createContext<ElectionContextType | undefined>(undefined);

export const useElection = () => {
  const context = useContext(ElectionContext);
  if (!context) {
    throw new Error('useElection must be used within an ElectionProvider');
  }
  return context;
};

export const ElectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [elections, setElections] = useState<Election[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);

  useEffect(() => {
    loadElections();
    loadVotes();
  }, []);

  const loadElections = async () => {
    try {
      const dbElections = await ElectionService.getElections();
      const electionsWithCandidates = await Promise.all(
        dbElections.map(async (election) => {
          const candidates = await ElectionService.getCandidates(election.id);
          return {
            ...election,
            candidates,
            startDate: election.start_date,
            endDate: election.end_date
          };
        })
      );
      setElections(electionsWithCandidates);
    } catch (error) {
      console.error('Error loading elections:', error);
    }
  };

  const loadVotes = async () => {
    try {
      const dbVotes = await ElectionService.getAllVotes();
      const formattedVotes = dbVotes.map(vote => ({
        ...vote,
        electionId: vote.election_id,
        candidateId: vote.candidate_id,
        voterId: vote.voter_email,
        timestamp: vote.created_at
      }));
      setVotes(formattedVotes);
    } catch (error) {
      console.error('Error loading votes:', error);
    }
  };

  const createElection = async (electionData: Omit<Election, 'id' | 'startDate' | 'status'>) => {
    try {
      const dbElectionData = {
        title: electionData.title,
        description: electionData.description,
        start_date: new Date().toISOString(),
        end_date: electionData.endDate,
        status: 'active' as const,
        created_by: 'current-user-id' // In real app, get from auth context
      };

      const candidates = electionData.candidates.map(c => ({
        name: c.name,
        party: c.party
      }));

      const newElection = await ElectionService.createElection(dbElectionData, candidates);
      if (newElection) {
        await loadElections();
      }
    } catch (error) {
      console.error('Error creating election:', error);
    }
  };

  const deleteElection = async (electionId: string) => {
    try {
      const success = await ElectionService.deleteElection(electionId);
      if (success) {
        await loadElections();
        await loadVotes();
      }
    } catch (error) {
      console.error('Error deleting election:', error);
    }
  };

  const updateElectionStatus = async (electionId: string, status: Election['status']) => {
    try {
      const success = await ElectionService.updateElectionStatus(electionId, status);
      if (success) {
        await loadElections();
      }
    } catch (error) {
      console.error('Error updating election status:', error);
    }
  };

  const castVote = async (electionId: string, candidateId: string, voterEmail: string) => {
    try {
      // Check if user has already voted
      const alreadyVoted = await ElectionService.hasVoted(electionId, voterEmail);
      if (alreadyVoted) {
        throw new Error('You have already voted in this election');
      }

      const success = await ElectionService.castVote(electionId, candidateId, voterEmail);
      if (success) {
        await loadVotes();
      } else {
        throw new Error('Failed to cast vote');
      }
    } catch (error) {
      console.error('Error casting vote:', error);
      throw error;
    }
  };

  const hasVoted = (electionId: string, voterEmail: string) => {
    return votes.some(v => v.electionId === electionId && v.voterId === voterEmail);
  };

  const value = {
    elections,
    votes,
    createElection,
    deleteElection,
    updateElectionStatus,
    castVote,
    hasVoted
  };

  return <ElectionContext.Provider value={value}>{children}</ElectionContext.Provider>;
};