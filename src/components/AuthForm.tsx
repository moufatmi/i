import React, { useState } from 'react';
import { Plane, Mail, Lock, User, Building, Eye, EyeOff, ArrowLeft, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthFormProps {
  onBack?: () => void;
  onDirectorLogin?: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onBack, onDirectorLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('General');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn, signUp } = useAuth();

  const departments = ['General', 'International', 'Domestic', 'Corporate', 'Luxury'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) return;

    setLoading(true);
    setError('');

    try {
      let result;
      if (isLogin) {
        result = await signIn(email, password);
      } else {
        result = await signUp(email, password, name, department);
      }

      if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDirectorAccess = () => {
    if (onDirectorLogin) {
      onDirectorLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        {onBack && (
          <div className="mb-6">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </button>
          </div>
        )}

        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="bg-primary-500 p-4 rounded-2xl inline-block mb-4 shadow-lg" style={{ backgroundColor: '#03989e' }}>
            <Plane className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Agence de Voyage Agent Portal</h1>
          <p className="text-gray-600">
            {isLogin ? 'Sign in to your account' : 'Create your agent account'}
          </p>
        </div>

        {/* Director Access Button */}
        <div className="mb-6">
          <button
            onClick={handleDirectorAccess}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            <Shield className="h-5 w-5" />
            <span>Director Access</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gradient-to-br from-teal-50 via-white to-cyan-50 text-gray-500">
              Or continue as agent
            </span>
          </div>
        </div>

        {/* Auth Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Join Agence de Voyage'}
            </h2>
            <p className="text-gray-600">
              {isLogin 
                ? 'Enter your credentials to access your dashboard' 
                : 'Fill in your details to create your agent account'
              }
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      style={{ '--tw-ring-color': '#03989e' } as React.CSSProperties}
                      placeholder="Enter your full name"
                      required={!isLogin}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      style={{ '--tw-ring-color': '#03989e' } as React.CSSProperties}
                    >
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  style={{ '--tw-ring-color': '#03989e' } as React.CSSProperties}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  style={{ '--tw-ring-color': '#03989e' } as React.CSSProperties}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password || (!isLogin && !name)}
              className="w-full text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: '#03989e',
                opacity: loading || !email || !password || (!isLogin && !name) ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!loading && email && password && (isLogin || name)) {
                  e.currentTarget.style.backgroundColor = '#027a7f';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#03989e';
              }}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
                </>
              ) : (
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              )}
            </button>
          </form>

          {/* Toggle between login and signup */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="ml-2 font-medium transition-colors duration-200"
                style={{ color: '#03989e' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#027a7f';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#03989e';
                }}
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Demo Credentials for Login */}
          {isLogin && (
            <div className="mt-6 p-4 rounded-lg border" style={{ backgroundColor: '#f0fdfc', borderColor: '#99f6e4' }}>
              <h3 className="text-sm font-medium mb-2" style={{ color: '#164e63' }}>Demo Agent Account:</h3>
              <div className="text-sm space-y-1" style={{ color: '#155e75' }}>
                <p><span className="font-medium">Email:</span> test@moussab.com</p>
                <p><span className="font-medium">Password:</span> ana123</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            © 2025 Agence de Voyage.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;