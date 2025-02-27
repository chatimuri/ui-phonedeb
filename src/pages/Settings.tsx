
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Moon, Sun } from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();
  // Mock state for settings - in a real app these would be persisted
  const [darkMode, setDarkMode] = useState(false);
  const [mgdl, setMgdl] = useState(true);
  const [notifications, setNotifications] = useState(true);
  
  return (
    <div className="app-container">
      <header className="app-header">
        <button 
          onClick={() => navigate(-1)} 
          className="text-app-text"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-medium">Settings</h1>
        <div className="w-5"></div>
      </header>

      <main className="app-content animate-fade-in">
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4">App Settings</h2>
          
          <div className="bg-white rounded-lg border border-app-secondary divide-y">
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center">
                {darkMode ? (
                  <Moon className="w-5 h-5 mr-3 text-app-primary" />
                ) : (
                  <Sun className="w-5 h-5 mr-3 text-app-primary" />
                )}
                <span>Dark Mode</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
                <div className="w-11 h-6 bg-app-secondary rounded-full peer peer-checked:bg-app-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
            
            <div className="p-4 flex justify-between items-center">
              <div>
                <span>Blood Sugar Unit</span>
                <p className="text-xs text-app-muted mt-1">
                  {mgdl ? "mg/dL (US)" : "mmol/L (International)"}
                </p>
              </div>
              <div className="flex border rounded-md overflow-hidden">
                <button 
                  className={`px-3 py-1 text-sm ${mgdl ? 'bg-app-primary text-white' : 'bg-app-secondary'}`}
                  onClick={() => setMgdl(true)}
                >
                  mg/dL
                </button>
                <button 
                  className={`px-3 py-1 text-sm ${!mgdl ? 'bg-app-primary text-white' : 'bg-app-secondary'}`}
                  onClick={() => setMgdl(false)}
                >
                  mmol/L
                </button>
              </div>
            </div>
            
            <div className="p-4 flex justify-between items-center">
              <div>
                <span>Notifications</span>
                <p className="text-xs text-app-muted mt-1">Remind you to check your blood sugar</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                />
                <div className="w-11 h-6 bg-app-secondary rounded-full peer peer-checked:bg-app-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4">About</h2>
          
          <div className="bg-white rounded-lg border border-app-secondary p-4">
            <h3 className="font-medium mb-2">Blood Sugar Tracker</h3>
            <p className="text-sm text-app-muted mb-3">Version 1.0.0</p>
            <p className="text-sm">A simple application to help you track and monitor your blood sugar levels.</p>
          </div>
        </div>
        
        <button className="w-full py-3 mt-4 bg-app-secondary text-app-text font-medium rounded-md">
          Clear All Data
        </button>
      </main>

      <footer className="app-footer">
        <div className="grid grid-cols-3 h-full">
          <div className="nav-item" onClick={() => navigate("/")}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span>Home</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/history")}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8v4l3 3"/>
              <circle cx="12" cy="12" r="10"/>
            </svg>
            <span>History</span>
          </div>
          <div className="nav-item active">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <span>Settings</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Settings;
