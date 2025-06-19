import React, { useState } from 'react';
import AgentPortal from './components/AgentPortal';
import DirectorDashboard from './components/DirectorDashboard';
import LoginForm from './components/LoginForm';
import AuthForm from './components/AuthForm';
import { SettingsProvider } from './contexts/SettingsContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Invoice } from './types';

function AppContent() {
  const [currentView, setCurrentView] = useState<'agent' | 'director-login' | 'director-dashboard'>('agent');
  const [allInvoices, setAllInvoices] = useState<Invoice[]>([]);
  const [loginError, setLoginError] = useState<string>('');
  
  const { isAuthenticated, loading } = useAuth();

  const handleDirectorLogin = () => {
    setCurrentView('director-login');
  };

  const handleLogin = (username: string, password: string) => {
    // Check credentials - Updated to use email "admin" and password "admin"
    if (username === 'admin' && password === 'admin') {
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

  // Handle invoice creation from agent portal
  const handleInvoiceCreated = (invoice: Invoice) => {
    setAllInvoices(prev => [...prev, invoice]);
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show director login form
  if (currentView === 'director-login') {
    return (
      <LoginForm 
        onLogin={handleLogin} 
        error={loginError}
        onBack={handleBackToAgent}
      />
    );
  }

  // Show director dashboard
  if (currentView === 'director-dashboard') {
    return (
      <DirectorDashboard 
        onLogout={handleLogoutDirector}
      />
    );
  }

  // Show authentication form if not authenticated
  if (!isAuthenticated) {
    return <AuthForm onDirectorLogin={handleDirectorLogin} />;
  }

  // Show agent portal (default view when authenticated)
  return (
    <div className="transition-colors duration-200">
      <AgentPortal />
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