import React, { useState } from 'react';
import AgentPortal from './components/AgentPortal';
import DirectorDashboard from './components/DirectorDashboard';
import LoginForm from './components/LoginForm';
import AuthForm from './components/AuthForm';
import { SettingsProvider } from './contexts/SettingsContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppContent() {
  const [currentView, setCurrentView] = useState<'agent' | 'director-login' | 'director-dashboard'>('agent');
  const [loginError, setLoginError] = useState<string>('');
  
  const { isAuthenticated, loading } = useAuth();

  const handleDirectorLogin = () => {
    setCurrentView('director-login');
  };

  const handleLogin = (username: string, password: string) => {
    // Check credentials
    if (username === 'moussab' && password === 'moussab123') {
      setCurrentView('director-dashboard');
      setLoginError('');
    } else {
      setLoginError('Invalid username or password. Please try again.');
    }
  };

  const handleBackToAgent = () => {
    setCurrentView('agent');
    setLoginError('');
  };

  const handleLogoutDirector = () => {
    setCurrentView('agent');
    setLoginError('');
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show authentication form if not authenticated
  if (!isAuthenticated) {
    return <AuthForm />;
  }

  return (
    <div className="transition-colors duration-200">
      {/* Show director login form */}
      {currentView === 'director-login' && (
        <LoginForm 
          onLogin={handleLogin} 
          error={loginError}
          onBack={handleBackToAgent}
        />
      )}

      {/* Show director dashboard */}
      {currentView === 'director-dashboard' && (
        <DirectorDashboard 
          onLogout={handleLogoutDirector}
        />
      )}

      {/* Show agent portal (default view) */}
      {currentView === 'agent' && (
        <AgentPortal 
          onDirectorLogin={handleDirectorLogin}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SettingsProvider>
  );
}

export default App;