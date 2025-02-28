
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, User, Mail, Clock, Bell, ExternalLink } from "lucide-react";
import { useBloodSugar } from "@/context/BloodSugarContext";
import { toast } from "@/components/ui/use-toast";
import { BLOOD_SUGAR_THRESHOLDS } from "@/types";

const Settings = () => {
  const navigate = useNavigate();
  const { userProfile, updateUserProfile, reminders } = useBloodSugar();
  
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email || "");
  const [age, setAge] = useState(userProfile.age?.toString() || "");
  const [caregiverEmail, setCaregiverEmail] = useState(userProfile.caregiverEmail || "");
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    userProfile.notificationsEnabled !== undefined ? userProfile.notificationsEnabled : true
  );
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(
    userProfile.emailNotificationsEnabled !== undefined ? userProfile.emailNotificationsEnabled : true
  );
  const [shareToCaregivers, setShareToCaregivers] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateUserProfile({
      name,
      email: email || undefined,
      age: age ? parseInt(age) : undefined,
      caregiverEmail: caregiverEmail || undefined,
      notificationsEnabled,
      emailNotificationsEnabled
    });
    
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully."
    });
  };

  const navigateToCaregiverPortal = () => {
    navigate("/caregiver-login");
  };

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

      <main className="app-content pb-20">
        <form onSubmit={handleSubmit} className="animate-fade-in">
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-4">Profile Information</h2>
            
            <div className="input-group mb-4">
              <label className="input-label">Your Name</label>
              <div className="relative">
                <input
                  type="text"
                  className="input-field pl-9"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
                <User className="absolute left-3 top-3 w-4 h-4 text-app-muted" />
              </div>
            </div>
            
            <div className="input-group mb-4">
              <label className="input-label">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  className="input-field pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                />
                <Mail className="absolute left-3 top-3 w-4 h-4 text-app-muted" />
              </div>
            </div>
            
            <div className="input-group">
              <label className="input-label">Age</label>
              <input
                type="number"
                className="input-field"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Your age"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-4">Caregiver Settings</h2>
            
            <div className="input-group mb-4">
              <label className="input-label">Caregiver Email</label>
              <div className="relative">
                <input
                  type="email"
                  className="input-field pl-9"
                  value={caregiverEmail}
                  onChange={(e) => setCaregiverEmail(e.target.value)}
                  placeholder="Caregiver's email"
                />
                <Mail className="absolute left-3 top-3 w-4 h-4 text-app-muted" />
              </div>
              <p className="text-xs text-app-muted mt-1">
                Your caregiver will be notified about abnormal readings
              </p>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">Share Readings with Caregiver</p>
                <p className="text-xs text-app-muted">
                  Allow your caregiver to view your readings
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={shareToCaregivers}
                  onChange={() => setShareToCaregivers(!shareToCaregivers)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-app-primary"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">Email Alerts to Caregiver</p>
                <p className="text-xs text-app-muted">
                  Send email notifications for abnormal readings
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={emailNotificationsEnabled}
                  onChange={() => setEmailNotificationsEnabled(!emailNotificationsEnabled)}
                  disabled={!caregiverEmail}
                />
                <div className={`w-11 h-6 ${!caregiverEmail ? 'bg-gray-100' : 'bg-gray-200'} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-app-primary ${!caregiverEmail ? 'opacity-50' : ''}`}></div>
              </label>
            </div>
            
            <div className="mt-4">
              <button 
                type="button"
                onClick={navigateToCaregiverPortal}
                className="flex items-center justify-center w-full py-2 px-4 bg-app-secondary/20 text-app-primary rounded-lg"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Go to Caregiver Portal
              </button>
              <p className="text-xs text-app-muted mt-1 text-center">
                For caregivers to access the dedicated dashboard
              </p>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-4">Notifications</h2>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">Enable Notifications</p>
                <p className="text-xs text-app-muted">
                  Receive reminders and alerts
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notificationsEnabled}
                  onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-app-primary"></div>
              </label>
            </div>
            
            {reminders.length > 0 && notificationsEnabled && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Medication Reminders</p>
                <div className="space-y-2">
                  {reminders.map(med => (
                    <div key={med.id} className="flex items-center justify-between p-3 bg-white border border-app-secondary rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{med.name}</p>
                        <p className="text-xs text-app-muted">{med.dosage}</p>
                      </div>
                      <div className="flex items-center text-xs">
                        <Clock className="w-3 h-3 mr-1 text-app-muted" />
                        <span>{med.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-4">App Settings</h2>
            
            <div className="input-group mb-4">
              <label className="input-label">Units</label>
              <select className="select-field">
                <option value="mg/dL">mg/dL (US)</option>
                <option value="mmol/L">mmol/L (International)</option>
              </select>
            </div>
            
            <div className="input-group">
              <label className="input-label">Target Range</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-app-muted">Low</label>
                  <input
                    type="number"
                    className="input-field"
                    defaultValue={BLOOD_SUGAR_THRESHOLDS.LOW}
                    disabled
                  />
                </div>
                <div>
                  <label className="text-xs text-app-muted">High</label>
                  <input
                    type="number"
                    className="input-field"
                    defaultValue={BLOOD_SUGAR_THRESHOLDS.HIGH}
                    disabled
                  />
                </div>
              </div>
              <p className="text-xs text-app-muted mt-1">
                Default target range for blood sugar readings
              </p>
            </div>
          </div>
          
          <button type="submit" className="btn-primary">
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </button>
        </form>
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
