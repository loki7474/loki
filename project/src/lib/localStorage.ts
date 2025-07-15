// Local storage service for voting system data
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'voter';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OTPCode {
  id: string;
  email: string;
  otp_code: string;
  expires_at: string;
  is_used: boolean;
  created_at: string;
}

export interface Election {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'inactive' | 'completed';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Candidate {
  id: string;
  election_id: string;
  name: string;
  party: string;
  created_at: string;
}

export interface Vote {
  id: string;
  election_id: string;
  candidate_id: string;
  voter_email: string;
  created_at: string;
}

class LocalStorageService {
  private getStorageKey(table: string): string {
    return `voting_system_${table}`;
  }

  private getData<T>(table: string): T[] {
    const data = localStorage.getItem(this.getStorageKey(table));
    return data ? JSON.parse(data) : [];
  }

  private setData<T>(table: string, data: T[]): void {
    localStorage.setItem(this.getStorageKey(table), JSON.stringify(data));
  }

  // Initialize with default data
  initializeData(): void {
    // Initialize users if not exists
    if (!localStorage.getItem(this.getStorageKey('users'))) {
      const defaultUsers: User[] = [
        {
          id: '1',
          email: 'admin@example.com',
          role: 'admin',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          email: 'voter1@example.com',
          role: 'voter',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          email: 'voter2@example.com',
          role: 'voter',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '4',
          email: 'voter3@example.com',
          role: 'voter',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      this.setData('users', defaultUsers);
    }

    // Initialize elections if not exists
    if (!localStorage.getItem(this.getStorageKey('elections'))) {
      const defaultElections: Election[] = [
        {
          id: 'election-1',
          title: 'Student Council President 2024',
          description: 'Vote for your next student council president',
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          created_by: '1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      this.setData('elections', defaultElections);
    }

    // Initialize candidates if not exists
    if (!localStorage.getItem(this.getStorageKey('candidates'))) {
      const defaultCandidates: Candidate[] = [
        {
          id: 'candidate-1',
          election_id: 'election-1',
          name: 'Alice Johnson',
          party: 'Progressive Student Alliance',
          created_at: new Date().toISOString()
        },
        {
          id: 'candidate-2',
          election_id: 'election-1',
          name: 'Bob Smith',
          party: 'Student Unity Party',
          created_at: new Date().toISOString()
        },
        {
          id: 'candidate-3',
          election_id: 'election-1',
          name: 'Carol Davis',
          party: 'Independent',
          created_at: new Date().toISOString()
        }
      ];
      this.setData('candidates', defaultCandidates);
    }

    // Initialize empty arrays for other tables
    if (!localStorage.getItem(this.getStorageKey('otp_codes'))) {
      this.setData('otp_codes', []);
    }
    if (!localStorage.getItem(this.getStorageKey('votes'))) {
      this.setData('votes', []);
    }
  }

  // Generic CRUD operations
  getAll<T>(table: string): T[] {
    return this.getData<T>(table);
  }

  getById<T extends { id: string }>(table: string, id: string): T | null {
    const data = this.getData<T>(table);
    return data.find(item => item.id === id) || null;
  }

  getByField<T>(table: string, field: string, value: any): T[] {
    const data = this.getData<T>(table);
    return data.filter(item => (item as any)[field] === value);
  }

  insert<T extends { id: string }>(table: string, item: T): T {
    const data = this.getData<T>(table);
    data.push(item);
    this.setData(table, data);
    return item;
  }

  update<T extends { id: string }>(table: string, id: string, updates: Partial<T>): T | null {
    const data = this.getData<T>(table);
    const index = data.findIndex(item => item.id === id);
    if (index !== -1) {
      data[index] = { ...data[index], ...updates };
      this.setData(table, data);
      return data[index];
    }
    return null;
  }

  delete<T extends { id: string }>(table: string, id: string): boolean {
    const data = this.getData<T>(table);
    const index = data.findIndex(item => item.id === id);
    if (index !== -1) {
      data.splice(index, 1);
      this.setData(table, data);
      return true;
    }
    return false;
  }

  // Specialized methods
  findUser(email: string): User | null {
    const users = this.getData<User>('users');
    return users.find(user => user.email.toLowerCase() === email.toLowerCase() && user.is_active) || null;
  }

  hasVoted(electionId: string, voterEmail: string): boolean {
    const votes = this.getData<Vote>('votes');
    return votes.some(vote => 
      vote.election_id === electionId && 
      vote.voter_email.toLowerCase() === voterEmail.toLowerCase()
    );
  }

  getElectionVotes(electionId: string): Vote[] {
    const votes = this.getData<Vote>('votes');
    return votes.filter(vote => vote.election_id === electionId);
  }

  getCandidatesByElection(electionId: string): Candidate[] {
    const candidates = this.getData<Candidate>('candidates');
    return candidates.filter(candidate => candidate.election_id === electionId);
  }

  // Clean up expired OTPs
  cleanupExpiredOTPs(): void {
    const otps = this.getData<OTPCode>('otp_codes');
    const now = new Date().toISOString();
    const validOTPs = otps.filter(otp => otp.expires_at > now && !otp.is_used);
    this.setData('otp_codes', validOTPs);
  }
}

export const localStorageService = new LocalStorageService();