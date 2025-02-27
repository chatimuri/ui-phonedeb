
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { 
  CalendarIcon, 
  Clock, 
  PlusCircle, 
  Bell, 
  Activity, 
  Pill, 
  Dumbbell 
} from "lucide-react";
import { useBloodSugar } from "@/context/BloodSugarContext";
import { cn } from "@/lib/utils";

const Home = () => {
  const navigate = useNavigate();
  const { readings, loading, userProfile, reminders } = useBloodSugar();
  const [filter, setFilter] = useState<"all" | "high" | "low" | "normal">("all");
  
  const filteredReadings = readings.filter(reading => {
    if (filter === "all") return true;
    return reading.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "high":
        return "text-app-danger";
      case "low":
        return "text-app-warning";
      default:
        return "text-app-success";
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "high":
        return "bg-app-danger/10";
      case "low":
        return "bg-app-warning/10";
      default:
        return "bg-app-success/10";
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="text-xl font-semibold">Blood Sugar Tracker</h1>
        <button
          onClick={() => navigate("/entry")}
          className="text-app-primary"
          aria-label="Add new reading"
        >
          <PlusCircle className="w-6 h-6" />
        </button>
      </header>

      <main className="app-content">
        {/* Welcome section */}
        <div className="bg-gradient-to-r from-app-primary/10 to-app-primary/5 p-4 rounded-xl mb-6 animate-fade-in">
          <h2 className="text-lg font-medium mb-1">Welcome, {userProfile.name}!</h2>
          <p className="text-sm text-app-muted">
            {readings.length > 0 
              ? "Here's your latest blood sugar information." 
              : "Start tracking your blood sugar levels today."}
          </p>
        </div>

        {/* Latest reading section */}
        {readings.length > 0 && (
          <div className={cn(
            "relative p-5 rounded-xl mb-6 shadow-sm border animate-fade-in",
            getStatusBg(readings[0].status)
          )}>
            <div className="absolute top-3 right-3">
              <span className={cn(
                "text-xs px-2 py-1 rounded-full font-medium",
                readings[0].status === "high" ? "bg-app-danger/20 text-app-danger" :
                readings[0].status === "low" ? "bg-app-warning/20 text-app-warning" :
                "bg-app-success/20 text-app-success"
              )}>
                {readings[0].status.toUpperCase()}
              </span>
            </div>
            <h3 className="text-sm font-medium mb-1 text-app-muted">Latest Reading</h3>
            <div className="flex items-end gap-1 mb-2">
              <span className={cn("text-3xl font-bold", getStatusColor(readings[0].status))}>
                {readings[0].value}
              </span>
              <span className="text-app-muted text-sm mb-1">mg/dL</span>
            </div>
            <div className="flex items-center text-xs text-app-muted">
              <Clock className="w-3 h-3 mr-1" />
              {readings[0].time}, {readings[0].date}
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3 mb-6 animate-fade-in">
          <button
            onClick={() => navigate("/entry")}
            className="flex flex-col items-center p-4 bg-app-primary text-white rounded-xl shadow-sm"
          >
            <PlusCircle className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">New Reading</span>
          </button>
          <button
            onClick={() => navigate("/history")}
            className="flex flex-col items-center p-4 bg-white border border-app-secondary rounded-xl shadow-sm"
          >
            <Activity className="w-6 h-6 mb-2 text-app-primary" />
            <span className="text-sm font-medium">View History</span>
          </button>
        </div>

        {/* Quick links */}
        <div className="mb-6 animate-fade-in">
          <h3 className="text-sm font-medium mb-3">Quick Links</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center p-3 bg-white border border-app-secondary rounded-xl shadow-sm">
              <Pill className="w-5 h-5 mr-3 text-app-primary" />
              <span className="text-sm">Medications</span>
            </button>
            <button className="flex items-center p-3 bg-white border border-app-secondary rounded-xl shadow-sm">
              <Dumbbell className="w-5 h-5 mr-3 text-app-primary" />
              <span className="text-sm">Exercise</span>
            </button>
          </div>
        </div>

        {/* Reminders */}
        {reminders.length > 0 && (
          <div className="mb-6 animate-fade-in">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium">Reminders</h3>
              <button className="text-xs text-app-primary">View All</button>
            </div>
            <div className="space-y-2">
              {reminders.map(med => (
                <div key={med.id} className="flex items-center justify-between p-3 bg-white border border-app-secondary rounded-lg shadow-sm">
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

        {/* Recent readings */}
        <div className="mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Recent Readings</h2>
            <div className="flex space-x-2">
              <select
                className="text-sm p-1 rounded border border-app-secondary"
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
              >
                <option value="all">All</option>
                <option value="high">High</option>
                <option value="normal">Normal</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-pulse-subtle text-app-muted">Loading...</div>
            </div>
          ) : filteredReadings.length === 0 ? (
            <div className="text-center py-10 bg-app-secondary/50 rounded-lg">
              <p className="text-app-muted mb-2">No readings found</p>
              <button
                onClick={() => navigate("/entry")}
                className="text-app-primary text-sm font-medium"
              >
                Add your first reading
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReadings.slice(0, 5).map((reading, index) => (
                <div
                  key={reading.id}
                  className={cn(
                    "bg-white p-4 rounded-lg border border-app-secondary shadow-sm",
                    "animate-slide-up"
                  )}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => navigate(`/detail/${reading.id}`)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className={cn("text-lg font-bold", getStatusColor(reading.status))}>
                        {reading.value} <span className="text-xs">mg/dL</span>
                      </span>
                      <p className="text-xs text-app-muted mt-1">{reading.testType}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-xs text-app-muted">
                        <CalendarIcon className="w-3 h-3 mr-1" />
                        {reading.date}
                      </div>
                      <div className="flex items-center text-xs text-app-muted mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        {reading.time}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredReadings.length > 5 && (
                <button
                  onClick={() => navigate("/history")}
                  className="w-full py-2 text-app-primary text-sm font-medium"
                >
                  View all readings
                </button>
              )}
            </div>
          )}
        </div>
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
