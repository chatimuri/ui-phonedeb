
import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, ChevronRight, Activity, TrendingUp, 
  TrendingDown, Bell, User, Users
} from "lucide-react";
import { useBloodSugar } from "@/context/BloodSugarContext";
import { BLOOD_SUGAR_THRESHOLDS } from "@/types";

const Home = () => {
  const navigate = useNavigate();
  const { readings, userProfile, reminders } = useBloodSugar();
  
  // Get the most recent reading
  const latestReading = readings.length > 0 
    ? readings[readings.length - 1] 
    : null;
  
  // Calculate recent trends
  const recentReadings = readings.slice(-5);
  const hasHighReadings = recentReadings.some(r => r.status === "high");
  const hasLowReadings = recentReadings.some(r => r.status === "low");
  
  // Count notifications (abnormal readings + medication reminders)
  const abnormalReadings = readings.filter(r => r.status !== "normal").length;
  const notificationCount = abnormalReadings + reminders.length;

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-app-primary">
            {userProfile.name.charAt(0)}
          </div>
          <div className="ml-2">
            <p className="text-sm font-medium">{userProfile.name}</p>
          </div>
        </div>
        <div className="flex">
          <button 
            className="relative mr-1"
            onClick={() => navigate("/notifications")}
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-app-text" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-app-danger text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>
          <button
            onClick={() => navigate("/settings")}
            aria-label="Settings"
          >
            <User className="w-5 h-5 text-app-text" />
          </button>
        </div>
      </header>

      <main className="app-content">
        <section className="mb-6 relative p-4 bg-app-primary/10 rounded-xl animate-fade-in">
          <h2 className="text-lg font-medium mb-2">Latest Reading</h2>
          
          {latestReading ? (
            <div className="relative">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-xs text-app-muted mb-1">Value</p>
                  <p className={`text-xl font-semibold ${
                    latestReading.status === "high" ? "text-app-danger" : 
                    latestReading.status === "low" ? "text-app-warning" : 
                    "text-app-success"
                  }`}>
                    {latestReading.value}
                    <span className="text-xs text-app-muted ml-1">mg/dL</span>
                  </p>
                </div>
                
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-xs text-app-muted mb-1">Date</p>
                  <p className="text-sm font-semibold">{latestReading.date}</p>
                </div>
                
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-xs text-app-muted mb-1">Time</p>
                  <p className="text-sm font-semibold">{latestReading.time}</p>
                </div>
              </div>
              
              <div className="mt-3 flex justify-between">
                <div className="text-xs text-app-muted">
                  <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                    latestReading.status === "high" ? "bg-app-danger" : 
                    latestReading.status === "low" ? "bg-app-warning" : 
                    "bg-app-success"
                  }`}></span>
                  {latestReading.status === "high" ? "High" : 
                   latestReading.status === "low" ? "Low" : 
                   "Normal"}
                </div>
                <button 
                  className="text-xs font-medium text-app-primary"
                  onClick={() => navigate(`/detail/${latestReading.id}`)}
                >
                  See Details
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-app-muted mb-2">No readings recorded yet</p>
              <button
                className="text-sm text-app-primary font-medium"
                onClick={() => navigate("/entry")}
              >
                Add Your First Reading
              </button>
            </div>
          )}
        </section>
        
        <section className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Quick Actions</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              className="bg-white flex flex-col items-center justify-center p-4 rounded-xl border border-app-secondary shadow-sm animate-fade-in"
              style={{ animationDelay: "0.1s" }}
              onClick={() => navigate("/entry")}
            >
              <div className="w-10 h-10 rounded-full bg-app-primary/10 flex items-center justify-center mb-2">
                <Plus className="w-5 h-5 text-app-primary" />
              </div>
              <span className="text-sm font-medium">New Reading</span>
            </button>
            
            <button
              className="bg-white flex flex-col items-center justify-center p-4 rounded-xl border border-app-secondary shadow-sm animate-fade-in"
              style={{ animationDelay: "0.2s" }}
              onClick={() => navigate("/history")}
            >
              <div className="w-10 h-10 rounded-full bg-app-primary/10 flex items-center justify-center mb-2">
                <Activity className="w-5 h-5 text-app-primary" />
              </div>
              <span className="text-sm font-medium">History</span>
            </button>
          </div>
        </section>
        
        <section className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Recent Trends</h2>
            <button
              className="text-sm text-app-primary font-medium flex items-center"
              onClick={() => navigate("/history")}
            >
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          
          <div className="space-y-3">
            {readings.length === 0 ? (
              <div className="bg-white rounded-lg p-4 text-center border border-app-secondary">
                <p className="text-app-muted">No trend data available yet</p>
              </div>
            ) : (
              <>
                <div className={`bg-white p-4 rounded-lg border shadow-sm flex items-center ${
                  hasHighReadings ? "border-app-danger/30" : "border-app-secondary"
                } animate-fade-in`} style={{ animationDelay: "0.1s" }}>
                  <div className={`w-8 h-8 rounded-full ${
                    hasHighReadings ? "bg-app-danger/10" : "bg-app-secondary/20"
                  } flex items-center justify-center mr-3`}>
                    <TrendingUp className={`w-4 h-4 ${
                      hasHighReadings ? "text-app-danger" : "text-app-muted"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">High Readings</h3>
                    <p className="text-sm text-app-muted">
                      {hasHighReadings 
                        ? "You've had high readings recently" 
                        : "No high readings recently"}
                    </p>
                  </div>
                  <span className={`text-xl font-semibold ${
                    hasHighReadings ? "text-app-danger" : "text-app-muted"
                  }`}>
                    {BLOOD_SUGAR_THRESHOLDS.HIGH}+
                  </span>
                </div>
                
                <div className={`bg-white p-4 rounded-lg border shadow-sm flex items-center ${
                  hasLowReadings ? "border-app-warning/30" : "border-app-secondary"
                } animate-fade-in`} style={{ animationDelay: "0.2s" }}>
                  <div className={`w-8 h-8 rounded-full ${
                    hasLowReadings ? "bg-app-warning/10" : "bg-app-secondary/20"
                  } flex items-center justify-center mr-3`}>
                    <TrendingDown className={`w-4 h-4 ${
                      hasLowReadings ? "text-app-warning" : "text-app-muted"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Low Readings</h3>
                    <p className="text-sm text-app-muted">
                      {hasLowReadings 
                        ? "You've had low readings recently" 
                        : "No low readings recently"}
                    </p>
                  </div>
                  <span className={`text-xl font-semibold ${
                    hasLowReadings ? "text-app-warning" : "text-app-muted"
                  }`}>
                    {BLOOD_SUGAR_THRESHOLDS.LOW}-
                  </span>
                </div>
              </>
            )}
          </div>
        </section>
        
        <section className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Care Options</h2>
          </div>
          
          <div className="space-y-3">
            <button
              className="w-full bg-white p-4 rounded-lg border border-app-secondary shadow-sm flex items-center animate-fade-in"
              style={{ animationDelay: "0.1s" }}
              onClick={() => navigate("/notifications")}
            >
              <div className="w-10 h-10 rounded-full bg-app-primary/10 flex items-center justify-center mr-3">
                <Bell className="w-5 h-5 text-app-primary" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium">Notifications</h3>
                <p className="text-sm text-app-muted">View alerts and reminders</p>
              </div>
              <ChevronRight className="w-5 h-5 text-app-muted" />
            </button>
            
            <button
              className="w-full bg-white p-4 rounded-lg border border-app-secondary shadow-sm flex items-center animate-fade-in"
              style={{ animationDelay: "0.2s" }}
              onClick={() => navigate("/caregiver-dashboard")}
            >
              <div className="w-10 h-10 rounded-full bg-app-primary/10 flex items-center justify-center mr-3">
                <Users className="w-5 h-5 text-app-primary" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium">Caregiver Dashboard</h3>
                <p className="text-sm text-app-muted">Share with your care team</p>
              </div>
              <ChevronRight className="w-5 h-5 text-app-muted" />
            </button>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <div className="grid grid-cols-3 h-full">
          <div className="nav-item active">
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
          <div className="nav-item" onClick={() => navigate("/settings")}>
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

export default Home;
