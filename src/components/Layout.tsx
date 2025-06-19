import React, { useState } from 'react';
import { Plane, User, Settings, LogOut } from 'lucide-react';
import SettingsModal from './SettingsModal';
import { useSettings } from '../contexts/SettingsContext';
import { useTranslation } from '../utils/translations';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  userType: 'agent' | 'director';
  userName?: string;
  onLogout?: () => void;
  onSignOut?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title, 
  userType, 
  userName,
  onLogout,
  onSignOut
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { theme, language } = useSettings();
  const { t } = useTranslation(language);

  const handleSignOut = onSignOut || onLogout;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div 
                className="p-2 rounded-lg"
                style={{ 
                  backgroundColor: userType === 'director' ? '#7c3aed' : '#03989e'
                }}
              >
                <Plane className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Agence de Voyage</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full">
                  <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {userName || (userType === 'agent' ? 'Agent Portal' : 'Director Dashboard')}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {userType === 'agent' ? 'Travel Agent' : 'Director'}
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                title={t('settings')}
              >
                <Settings className="h-5 w-5" />
              </button>
              
              {handleSignOut && (
                <button 
                  onClick={handleSignOut}
                  className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  title={userType === 'director' ? 'Logout' : 'Sign Out'}
                >
                  <LogOut className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
};

export default Layout;