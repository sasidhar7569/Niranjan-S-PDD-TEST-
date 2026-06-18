import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, LogIn } from 'lucide-react';

// Temporary flag for testing APK without login
const SKIP_LOGIN = false;

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (SKIP_LOGIN) {
      localStorage.setItem('token', 'test_token');
      localStorage.setItem('user', JSON.stringify({ name: 'Test User', email: 'test@example.com' }));
      localStorage.setItem('userName', 'Test User');
      localStorage.setItem('role', 'student');
      
      const hasSetup = localStorage.getItem('targetCompanies');
      if (!hasSetup) {
        navigate('/setup', { replace: true });
      } else {
        navigate('/home', { replace: true });
      }
    }
  }, [navigate]);

  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('student');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (authMode === 'forgot') {
      alert('Password reset link sent to your email.');
      setAuthMode('login');
      return;
    }

    try {
      const url =
        authMode === 'login'
          ? `${import.meta.env.VITE_BACKEND_URL || 'http://10.141.95.184:5000'}/login`
          : `${import.meta.env.VITE_BACKEND_URL || 'http://10.141.95.184:5000'}/register`;

      const body =
        authMode === 'login'
          ? {
            email,
            password
          }
          : {
            name: fullName,
            email,
            password,
            role,
            college: role === 'student' ? 'ABC College' : '',
            department: role === 'student' ? 'CSE' : '',
            year: role === 'student' ? 4 : undefined,
            cgpa: role === 'student' ? 8.5 : undefined,
            skills: role === 'student' ? ['Java', 'React'] : []
          };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!data.success) {
        alert(data.message || 'Something went wrong');
        return;
      }

      if (authMode === 'login') {
        localStorage.removeItem('firstName');
        localStorage.removeItem('lastName');
        localStorage.removeItem('phone');
        localStorage.removeItem('profilePic');
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.data));
        localStorage.setItem('userName', data.data.name);
        localStorage.setItem('email', data.data.email);
        localStorage.setItem('role', data.role);

        if (data.role === 'admin') {
          navigate('/admin');
        } else {
          const hasSetup = localStorage.getItem('targetCompanies');
          let parsedSetup = [];
          if (hasSetup) {
            try { parsedSetup = JSON.parse(hasSetup); } catch(e) {}
          }
          if (!hasSetup || !Array.isArray(parsedSetup) || parsedSetup.length === 0) {
            navigate('/setup');
          } else {
            navigate('/home');
          }
        }
      } else {
        alert('Registration successful. Please login now.');
        setAuthMode('login');
        setPassword('');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Backend is not running. Start node server.cjs first.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4" style={{ background: 'var(--background-color)' }}>
      <div className="card w-full max-w-md p-8 shadow-xl bg-slate-800/80 border border-slate-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">PlacementPro</h1>
          <p className="text-secondary text-sm">
            {authMode === 'login'
              ? 'Welcome back! Please login to continue.'
              : authMode === 'register'
                ? 'Create an account to start your journey.'
                : 'Reset your password.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {authMode === 'register' && (
            <div className="form-group mb-0 relative">
              <label className="form-label text-sm text-secondary mb-1 block">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  className="form-input pl-10 w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group mb-0 relative">
            <label className="form-label text-sm text-secondary mb-1 block">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                className="form-input pl-10 w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2"
                placeholder="student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {authMode !== 'forgot' && (
            <div className="form-group mb-0 relative">
              <label className="form-label text-sm text-secondary mb-1 block">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  className="form-input pl-10 w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {authMode !== 'forgot' && (
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={role === 'student'}
                  onChange={() => setRole('student')}
                  className="accent-primary"
                />
                <span className="text-sm">Student</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={role === 'admin'}
                  onChange={() => setRole('admin')}
                  className="accent-primary"
                />
                <span className="text-sm">Admin</span>
              </label>
            </div>
          )}

          <button type="submit" className="btn-primary w-full py-3 mt-4 flex justify-center items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors">
            {authMode === 'login' ? (
              <>
                <LogIn size={20} /> Login
              </>
            ) : authMode === 'register' ? (
              <>
                <UserPlus size={20} /> Sign Up
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          {authMode === 'login' ? (
            <>
              <p className="text-secondary mb-2">
                Don&apos;t have an account?{' '}
                <span className="text-primary cursor-pointer hover:underline text-blue-400" onClick={() => setAuthMode('register')}>
                  Register
                </span>
              </p>
              <p>
                <span className="text-secondary cursor-pointer hover:underline hover:text-white" onClick={() => setAuthMode('forgot')}>
                  Forgot Password?
                </span>
              </p>
            </>
          ) : authMode === 'register' ? (
            <p className="text-secondary">
              Already have an account?{' '}
              <span className="text-primary cursor-pointer hover:underline text-blue-400" onClick={() => setAuthMode('login')}>
                Login
              </span>
            </p>
          ) : (
            <p className="text-secondary">
              Remember your password?{' '}
              <span className="text-primary cursor-pointer hover:underline text-blue-400" onClick={() => setAuthMode('login')}>
                Login
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;