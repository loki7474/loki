import { localStorageService, Election, Candidate, Vote } from '../lib/localStorage';

export type { Election, Candidate, Vote } from '../lib/localStorage';

export class ElectionService {
  // Get all elections
  static async getElections(): Promise<Election[]> {
    try {
      return localStorageService.getAll<Election>('elections');
    } catch (error) {
      console.error('Error fetching elections:', error);
      return [];
    }
  }

  // Get candidates for an election
  static async getCandidates(electionId: string): Promise<Candidate[]> {
    try {
      return localStorageService.getCandidatesByElection(electionId);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      return [];
    }
  }

  // Create election with candidates
  static async createElection(
    electionData: Omit<Election, 'id' | 'created_at' | 'updated_at'>,
    candidates: Omit<Candidate, 'id' | 'election_id' | 'created_at'>[]
  ): Promise<Election | null> {
    try {
      // Create election
      const newElection: Election = {
        ...electionData,
        id: `election_${Date.now()}_${Math.random()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const createdElection = localStorageService.insert('elections', newElection);

      // Create candidates
      candidates.forEach((candidate, index) => {
        const newCandidate: Candidate = {
          ...candidate,
          id: `candidate_${Date.now()}_${index}_${Math.random()}`,
          election_id: createdElection.id,
          created_at: new Date().toISOString()
        };
        localStorageService.insert('candidates', newCandidate);
      });

      return createdElection;
    } catch (error) {
      console.error('Error creating election:', error);
      return null;
    }
  }

  // Update election status
  static async updateElectionStatus(
    electionId: string,
    status: Election['status']
  ): Promise<boolean> {
    try {
      const updated = localStorageService.update<Election>('elections', electionId, { 
        status, 
        updated_at: new Date().toISOString() 
      });
      return !!updated;
    } catch (error) {
      console.error('Error updating election status:', error);
      return false;
    }
  }

  // Delete election
  static async deleteElection(electionId: string): Promise<boolean> {
    try {
      // Delete associated candidates
      const candidates = localStorageService.getCandidatesByElection(electionId);
      candidates.forEach(candidate => {
        localStorageService.delete('candidates', candidate.id);
      });

      // Delete associated votes
      const votes = localStorageService.getElectionVotes(electionId);
      votes.forEach(vote => {
        localStorageService.delete('votes', vote.id);
      });

      // Delete election
      return localStorageService.delete('elections', electionId);
    } catch (error) {
      console.error('Error deleting election:', error);
      return false;
    }
  }

  // Cast vote
  static async castVote(
    electionId: string,
    candidateId: string,
    voterEmail: string
  ): Promise<boolean> {
    try {
      // Check if user has already voted
      if (localStorageService.hasVoted(electionId, voterEmail)) {
        throw new Error('User has already voted in this election');
      }

      const newVote: Vote = {
        id: `vote_${Date.now()}_${Math.random()}`,
        election_id: electionId,
        candidate_id: candidateId,
        voter_email: voterEmail.toLowerCase(),
        created_at: new Date().toISOString()
      };

      localStorageService.insert('votes', newVote);
      console.log('Vote cast successfully:', newVote);
      return true;
    } catch (error) {
      console.error('Error casting vote:', error);
      return false;
    }
  }

  // Check if user has voted
  static async hasVoted(electionId: string, voterEmail: string): Promise<boolean> {
    try {
      return localStorageService.hasVoted(electionId, voterEmail);
    } catch (error) {
      console.error('Error checking vote status:', error);
      return false;
    }
  }

  // Get votes for an election
  static async getVotes(electionId: string): Promise<Vote[]> {
    try {
      return localStorageService.getElectionVotes(electionId);
    } catch (error) {
      console.error('Error fetching votes:', error);
      return [];
    }
  }

  // Get all votes (for admin)
  static async getAllVotes(): Promise<Vote[]> {
    try {
      return localStorageService.getAll<Vote>('votes');
    } catch (error) {
      console.error('Error fetching all votes:', error);
      return [];
    }
  }
}