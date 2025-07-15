import React, { useState } from 'react';
import { Mail, Lock, Shield, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthService } from '../services/authService';

const LoginForm: React.FC = () => {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [emailExists, setEmailExists] = useState(false);
  const { login } = useAuth();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Check if email exists in database
      const exists = await AuthService.checkEmailExists(email);
      
      if (!exists) {
        setError('Email not found. Please contact administrator to register your email.');
        return;
      }

      setEmailExists(true);

      // Generate and send OTP
      const otp = await AuthService.generateOTP(email);
      const emailSent = await AuthService.sendOTPEmail(email, otp);

      if (emailSent) {
        setOtpSent(true);
        setStep('otp');
        setTimeLeft(300); // 5 minutes
        
        // Start countdown
        const timer = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError('Failed to send OTP. Please try again.');
      }
      
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Verify OTP with database
      const user = await AuthService.verifyOTP(email, otp);
      
      if (user) {
        const userData = {
          id: user.id,
          email: user.email,
          role: user.role,
          verified: true,
          voterId: user.id
        };
        login(userData);
      } else {
        setError('Invalid or expired OTP. Please try again.');
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setLoading(true);
    setError('');
    try {
      // Generate and send new OTP
      const newOtp = await AuthService.generateOTP(email);
      const emailSent = await AuthService.sendOTPEmail(email, newOtp);

      if (emailSent) {
        setTimeLeft(300);
        setOtpSent(true);
        
        // Restart countdown
        const timer = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError('Failed to resend OTP. Please try again.');
      }
    } catch (err) {
      console.error('Resend OTP error:', err);
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8 fade-in">
          <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">SecureVote</h1>
          <p className="text-gray-600 mt-2">Secure Online Voting System</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 slide-up">
          {step === 'email' ? (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Login to Vote</h2>
                <p className="text-gray-600 mt-2">Enter your email to receive an OTP</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full loading-spinner"></div>
                    <span>Sending OTP...</span>
                  </div>
                ) : (
                  'Send OTP'
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Enter OTP</h2>
                <p className="text-gray-600 mt-2">We've sent a 6-digit code to {email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  6-Digit Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center tracking-widest font-mono text-lg"
                    placeholder="000000"
                    maxLength={6}
                    required
                  />
                </div>
              </div>

              {timeLeft > 0 && (
                <div className="flex items-center justify-center space-x-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">OTP expires in {formatTime(timeLeft)}</span>
                </div>
              )}

              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full loading-spinner"></div>
                    <span>Verifying...</span>
                  </div>
                ) : (
                  'Verify & Login'
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={resendOtp}
                  disabled={loading || timeLeft > 0}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {timeLeft > 0 ? 'Resend OTP in progress' : 'Resend OTP'}
                </button>
              </div>
            </form>
          )}

          {/* Demo Instructions */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Demo Users:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• admin@example.com (Admin)</li>
              <li>• voter1@example.com (Voter)</li>
              <li>• voter2@example.com (Voter)</li>
              <li>• voter3@example.com (Voter)</li>
            </ul>
            <p className="text-xs text-blue-700 mt-2">OTP will be shown in browser console</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;