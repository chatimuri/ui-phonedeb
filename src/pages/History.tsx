
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Trash2 } from "lucide-react";
import { useBloodSugar } from "@/context/BloodSugarContext";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";

const History = () => {
  const navigate = useNavigate();
  const { readings, deleteReading } = useBloodSugar();
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

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this reading?")) {
      deleteReading(id);
    }
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
        <h1 className="text-lg font-medium">History</h1>
        <div className="w-5"></div>
      </header>

      <main className="app-content">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-medium">All Readings</h2>
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

        {filteredReadings.length === 0 ? (
          <div className="text-center py-10 bg-app-secondary/50 rounded-lg">
            <p className="text-app-muted">No readings found</p>
          </div>
        ) : (
          <div className="space-y-3 pb-6 animate-fade-in">
            {filteredReadings.map((reading, index) => (
              <div
                key={reading.id}
                className={cn(
                  "bg-white p-4 rounded-lg border border-app-secondary shadow-sm relative",
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
                      <Calendar className="w-3 h-3 mr-1" />
                      {reading.date}
                    </div>
                    <div className="flex items-center text-xs text-app-muted mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      {reading.time}
                    </div>
                  </div>
                </div>
                <button
                  className="absolute top-2 right-2 text-app-muted hover:text-app-danger"
                  onClick={(e) => handleDelete(e, reading.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
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
          <div className="nav-item active">
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

export default History;
