
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, AlertTriangle, Clock, ThumbsUp } from "lucide-react";
import { useBloodSugar } from "@/context/BloodSugarContext";
import { cn } from "@/lib/utils";

const Notifications = () => {
  const navigate = useNavigate();
  const { readings, reminders } = useBloodSugar();
  
  // Get abnormal readings (high or low)
  const abnormalReadings = readings.filter(reading => 
    reading.status === "high" || reading.status === "low"
  ).slice(0, 5);
  
  // Combine notifications
  const notifications = [
    // Medication reminders
    ...reminders.map(med => ({
      id: `med-${med.id}`,
      type: "medication" as const,
      title: `Take ${med.name}`,
      description: `${med.dosage} as scheduled`,
      time: med.time,
      medication: med
    })),
    
    // Abnormal readings
    ...abnormalReadings.map(reading => ({
      id: `reading-${reading.id}`,
      type: "reading" as const,
      title: reading.status === "high" ? "High Blood Sugar" : "Low Blood Sugar",
      description: `${reading.value} mg/dL on ${reading.date}`,
      time: reading.time,
      reading
    }))
  ];
  
  // Sort by recency (this would be better with proper date objects)
  notifications.sort((a, b) => {
    if (a.type === "reading" && b.type === "reading") {
      return a.reading.id > b.reading.id ? -1 : 1;
    }
    return 0;
  });

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
        <h1 className="text-lg font-medium">Notifications</h1>
        <div className="w-5"></div>
      </header>

      <main className="app-content">
        <div className="mb-4">
          <h2 className="text-lg font-medium">Recent Notifications</h2>
          <p className="text-sm text-app-muted">
            Your medication reminders and alerts
          </p>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-10 bg-app-secondary/50 rounded-lg">
            <Bell className="w-12 h-12 text-app-muted mx-auto mb-3 opacity-50" />
            <p className="text-app-muted mb-2">No notifications yet</p>
            <p className="text-xs text-app-muted">
              Medication reminders and abnormal reading alerts will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3 pb-6 animate-fade-in">
            {notifications.map((notification, index) => (
              <div
                key={notification.id}
                className={cn(
                  "bg-white p-4 rounded-lg border shadow-sm relative",
                  "animate-slide-up",
                  notification.type === "reading" && notification.reading.status === "high" 
                    ? "border-app-danger/30" 
                    : notification.type === "reading" && notification.reading.status === "low"
                    ? "border-app-warning/30"
                    : "border-app-secondary"
                )}
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => {
                  if (notification.type === "reading") {
                    navigate(`/detail/${notification.reading.id}`);
                  }
                }}
              >
                <div className="flex">
                  <div className="mr-3">
                    {notification.type === "medication" ? (
                      <div className="bg-app-primary/10 p-2 rounded-full">
                        <Clock className="w-5 h-5 text-app-primary" />
                      </div>
                    ) : notification.reading.status === "high" ? (
                      <div className="bg-app-danger/10 p-2 rounded-full">
                        <AlertTriangle className="w-5 h-5 text-app-danger" />
                      </div>
                    ) : (
                      <div className="bg-app-warning/10 p-2 rounded-full">
                        <AlertTriangle className="w-5 h-5 text-app-warning" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{notification.title}</h3>
                      <p className="text-xs text-app-muted">{notification.time}</p>
                    </div>
                    <p className="text-sm text-app-muted mt-1">{notification.description}</p>
                    
                    {notification.type === "medication" && (
                      <div className="mt-3 flex">
                        <button className="flex items-center justify-center bg-app-primary/10 text-app-primary rounded-md px-3 py-1 text-sm font-medium">
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          Taken
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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

export default Notifications;
