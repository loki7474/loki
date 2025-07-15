import { localStorageService, User, OTPCode } from '../lib/localStorage';

export type { User } from '../lib/localStorage';

export class AuthService {
  // Check if email exists in the database
  static async checkEmailExists(email: string): Promise<boolean> {
    try {
      const user = localStorageService.findUser(email);
      return !!user;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  }

  // Get user by email
  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      return localStorageService.findUser(email);
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  // Generate and store OTP
  static async generateOTP(email: string): Promise<string> {
    try {
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

      // Clean up expired OTPs
      localStorageService.cleanupExpiredOTPs();

      // Invalidate any existing OTPs for this email
      const existingOTPs = localStorageService.getByField<OTPCode>('otp_codes', 'email', email.toLowerCase());
      existingOTPs.forEach(otpRecord => {
        localStorageService.update('otp_codes', otpRecord.id, { is_used: true });
      });

      // Store new OTP
      const otpRecord: OTPCode = {
        id: `otp_${Date.now()}_${Math.random()}`,
        email: email.toLowerCase(),
        otp_code: otp,
        expires_at: expiresAt.toISOString(),
        is_used: false,
        created_at: new Date().toISOString()
      };

      localStorageService.insert('otp_codes', otpRecord);
      console.log(`🔐 OTP generated for ${email}: ${otp}`);
      return otp;
    } catch (error) {
      console.error('Error generating OTP:', error);
      throw new Error('Failed to generate OTP');
    }
  }

  // Verify OTP
  static async verifyOTP(email: string, otp: string): Promise<User | null> {
    try {
      // Clean up expired OTPs first
      localStorageService.cleanupExpiredOTPs();

      // Find valid OTP
      const otpRecords = localStorageService.getByField<OTPCode>('otp_codes', 'email', email.toLowerCase());
      const validOTP = otpRecords.find(record => 
        record.otp_code === otp && 
        !record.is_used && 
        new Date(record.expires_at) > new Date()
      );

      if (!validOTP) {
        return null; // Invalid or expired OTP
      }

      // Mark OTP as used
      localStorageService.update('otp_codes', validOTP.id, { is_used: true });

      // Get user data
      const user = await this.getUserByEmail(email);
      return user;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return null;
    }
  }

  // Send OTP via email (simulated)
  static async sendOTPEmail(email: string, otp: string): Promise<boolean> {
    try {
      // Simulate email sending
      console.log(`📧 Email sent to ${email}`);
      console.log(`Subject: SecureVote - Your OTP Code`);
      console.log(`Body: Your OTP code is: ${otp}`);
      console.log(`This code will expire in 5 minutes.`);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      console.error('Error sending OTP email:', error);
      return false;
    }
  }

  // Add new user (for admin purposes)
  static async addUser(email: string, role: 'admin' | 'voter' = 'voter'): Promise<User | null> {
    try {
      // Check if user already exists
      const existingUser = localStorageService.findUser(email);
      if (existingUser) {
        return null; // User already exists
      }

      const newUser: User = {
        id: `user_${Date.now()}_${Math.random()}`,
        email: email.toLowerCase(),
        role: role,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return localStorageService.insert('users', newUser);
    } catch (error) {
      console.error('Error adding user:', error);
      return null;
    }
  }

  // Get all users (for admin)
  static async getAllUsers(): Promise<User[]> {
    try {
      return localStorageService.getAll<User>('users');
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  }

  // Update user status
  static async updateUserStatus(userId: string, isActive: boolean): Promise<boolean> {
    try {
      const updated = localStorageService.update<User>('users', userId, { 
        is_active: isActive, 
        updated_at: new Date().toISOString() 
      });
      return !!updated;
    } catch (error) {
      console.error('Error updating user status:', error);
      return false;
    }
  }

  // Delete user
  static async deleteUser(userId: string): Promise<boolean> {
    try {
      return localStorageService.delete('users', userId);
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }
}