
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Calendar, Clock, MessageSquare, AlertTriangle, LogOut } from "lucide-react";
import { useBloodSugar } from "@/context/BloodSugarContext";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { BLOOD_SUGAR_THRESHOLDS } from "@/types";

const CaregiverDashboard = () => {
  const navigate = useNavigate();
  const { readings, userProfile, sendCaregiverNotification } = useBloodSugar();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Check if caregiver is logged in
  useEffect(() => {
    const caregiverLoggedIn = localStorage.getItem("caregiverLoggedIn") === "true";
    if (!caregiverLoggedIn) {
      toast({
        title: "Access Denied",
        description: "Please login to access the caregiver dashboard",
        variant: "destructive"
      });
      navigate("/caregiver-login");
      return;
    }
    setIsLoggedIn(true);
  }, [navigate]);
  
  // Get abnormal readings (high or low)
  const abnormalReadings = readings.filter(reading => 
    reading.status === "high" || reading.status === "low"
  );

  // Filter specifically for high readings
  const highReadings = readings.filter(reading => reading.status === "high");

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

  const handleLogout = () => {
    localStorage.removeItem("caregiverLoggedIn");
    localStorage.removeItem("caregiverEmail");
    toast({
      title: "Logged Out",
      description: "You have been logged out of the caregiver portal"
    });
    navigate("/caregiver-login");
  };

  // Function to mark that you've responded to a high reading alert
  const handleRespond = (readingId: string) => {
    toast({
      title: "Response Sent",
      description: "Your response has been recorded"
    });
    // In a real app, you would mark this alert as responded in the database
  };

  if (!isLoggedIn) return null;

  return (
    <div className="app-container">
      <header className="app-header">
        <button 
          onClick={() => navigate("/caregiver-login")} 
          className="text-app-text"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-medium">Caregiver Dashboard</h1>
        <button 
          onClick={handleLogout}
          className="text-app-text"
          aria-label="Log out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      <main className="app-content">
        <div className="flex items-center p-4 bg-app-primary/10 rounded-xl mb-6 animate-fade-in">
          <div className="bg-app-primary/20 p-3 rounded-full mr-4">
            <User className="w-6 h-6 text-app-primary" />
          </div>
          <div>
            <h2 className="text-lg font-medium">{userProfile.name}</h2>
            <p className="text-sm text-app-muted">
              {userProfile.age ? `${userProfile.age} years old` : "Patient"}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">High Blood Sugar Alerts</h2>
          <p className="text-sm text-app-muted mb-4">Readings above {BLOOD_SUGAR_THRESHOLDS.HIGH} mg/dL</p>
          
          {highReadings.length === 0 ? (
            <div className="text-center py-8 bg-app-secondary/20 rounded-lg">
              <p className="text-app-muted">No high blood sugar readings</p>
            </div>
          ) : (
            <div className="space-y-3">
              {highReadings.slice(0, 5).map((reading, index) => (
                <div
                  key={reading.id}
                  className={cn(
                    "relative p-4 rounded-lg shadow-sm border animate-slide-up",
                    "border-app-danger/30",
                    "bg-app-danger/10"
                  )}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="absolute top-4 right-4">
                    <AlertTriangle className="w-5 h-5 text-app-danger" />
                  </div>
                  
                  <div className="flex justify-between items-start pr-8">
                    <div>
                      <span className="text-xl font-bold text-app-danger">
                        {reading.value} <span className="text-xs">mg/dL</span>
                      </span>
                      <div className="flex items-center text-xs text-app-muted mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        {reading.time}
                      </div>
                      <div className="flex items-center text-xs text-app-muted mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        {reading.date}
                      </div>
                    </div>
                    <button 
                      className="mt-2 flex items-center text-app-primary bg-white px-3 py-1 rounded-md text-sm border border-app-primary/20 shadow-sm"
                      onClick={() => handleRespond(reading.id)}
                    >
                      <MessageSquare className="w-3 h-3 mr-1" />
                      Respond
                    </button>
                  </div>
                  
                  {reading.note && (
                    <div className="mt-3 text-sm bg-white/50 p-2 rounded">
                      <p className="text-app-muted">{reading.note}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4">All Abnormal Readings</h2>
          
          {abnormalReadings.length === 0 ? (
            <div className="text-center py-8 bg-app-secondary/20 rounded-lg">
              <p className="text-app-muted">No abnormal readings</p>
            </div>
          ) : (
            <div className="space-y-3">
              {abnormalReadings.slice(0, 5).map((reading, index) => (
                <div
                  key={reading.id}
                  className={cn(
                    "relative p-4 rounded-lg shadow-sm border animate-slide-up",
                    reading.status === "high" ? "border-app-danger/30" : "border-app-warning/30",
                    getStatusBg(reading.status)
                  )}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="absolute top-4 right-4">
                    <AlertTriangle className={cn(
                      "w-5 h-5",
                      reading.status === "high" ? "text-app-danger" : "text-app-warning"
                    )} />
                  </div>
                  
                  <div className="flex justify-between items-start pr-8">
                    <div>
                      <span className={cn("text-xl font-bold", getStatusColor(reading.status))}>
                        {reading.value} <span className="text-xs">mg/dL</span>
                      </span>
                      <div className="flex items-center text-xs text-app-muted mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        {reading.time}
                      </div>
                      <div className="flex items-center text-xs text-app-muted mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        {reading.date}
                      </div>
                    </div>
                    <button 
                      className="mt-2 flex items-center text-app-primary bg-white px-3 py-1 rounded-md text-sm border border-app-primary/20 shadow-sm"
                      onClick={() => handleRespond(reading.id)}
                    >
                      <MessageSquare className="w-3 h-3 mr-1" />
                      Respond
                    </button>
                  </div>
                  
                  {reading.note && (
                    <div className="mt-3 text-sm bg-white/50 p-2 rounded">
                      <p className="text-app-muted">{reading.note}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4">Statistics</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border border-app-secondary shadow-sm">
              <h3 className="text-sm text-app-muted mb-1">Average</h3>
              <p className="text-xl font-bold">
                {readings.length > 0
                  ? Math.round(
                      readings.reduce((sum, r) => sum + r.value, 0) / readings.length
                    )
                  : "--"} 
                <span className="text-xs text-app-muted">mg/dL</span>
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-app-secondary shadow-sm">
              <h3 className="text-sm text-app-muted mb-1">Readings</h3>
              <div className="flex justify-between items-end">
                <p className="text-xl font-bold">{readings.length}</p>
                <p className="text-xs text-app-muted">
                  High: {readings.filter(r => r.status === "high").length}<br />
                  Low: {readings.filter(r => r.status === "low").length}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4">Patient Information</h2>
          
          <div className="bg-white p-4 rounded-lg border border-app-secondary shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-xs text-app-muted">Name</h3>
                <p className="font-medium">{userProfile.name}</p>
              </div>
              
              {userProfile.age && (
                <div>
                  <h3 className="text-xs text-app-muted">Age</h3>
                  <p className="font-medium">{userProfile.age} years</p>
                </div>
              )}
              
              {userProfile.email && (
                <div className="col-span-2">
                  <h3 className="text-xs text-app-muted">Email</h3>
                  <p className="font-medium">{userProfile.email}</p>
                </div>
              )}
            </div>
            
            <div className="mt-4 pt-4 border-t border-app-secondary/50">
              <button className="w-full flex items-center justify-center text-app-primary p-2 rounded-md text-sm bg-app-primary/10">
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Message
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CaregiverDashboard;
