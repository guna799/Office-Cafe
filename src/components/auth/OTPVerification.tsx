import React, { useState, useEffect } from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface OTPVerificationProps {
  email: string;
  onBack: () => void;
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({ email, onBack }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const { verifyOTP, register, sendOTP, isLoading } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError('Please enter a 6-digit OTP');
      return;
    }

    const isValid = await verifyOTP(email, otp);
    if (isValid) {
      // Get registration data and complete registration
      const registrationData = localStorage.getItem('registrationData');
      if (registrationData) {
        const data = JSON.parse(registrationData);
        const success = await register(
          data.email,
          data.password,
          data.name,
          data.employeeId,
          data.department
        );
        
        if (success) {
          localStorage.removeItem('registrationData');
        } else {
          setError('Registration failed. Please try again.');
        }
      }
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  const handleResendOTP = async () => {
    setError('');
    const success = await sendOTP(email);
    if (success) {
      setTimeLeft(300);
      setOtp('');
    } else {
      setError('Failed to resend OTP. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
          <Shield className="h-8 w-8 text-orange-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
        <p className="text-gray-600">
          We've sent a 6-digit code to<br />
          <span className="font-medium">{email}</span>
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2 text-center">
            Enter Verification Code
          </label>
          <input
            id="otp"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="w-full px-4 py-4 text-center text-2xl font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent tracking-widest"
            placeholder="123456"
            maxLength={6}
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || otp.length !== 6}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
        >
          {isLoading ? 'Verifying...' : 'Verify & Create Account'}
        </button>
      </form>

      <div className="mt-6 text-center space-y-4">
        {timeLeft > 0 ? (
          <p className="text-gray-600">
            Code expires in <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
          </p>
        ) : (
          <button
            onClick={handleResendOTP}
            disabled={isLoading}
            className="text-orange-500 hover:text-orange-600 font-medium disabled:text-orange-300"
          >
            Resend Code
          </button>
        )}

        <button
          onClick={onBack}
          className="flex items-center justify-center w-full text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Registration
        </button>
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-800 text-sm text-center">
          <strong>Demo:</strong> Use code <span className="font-mono">123456</span> to verify
        </p>
      </div>
    </div>
  );
};