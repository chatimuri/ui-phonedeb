
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Trash2 } from "lucide-react";
import { useBloodSugar } from "@/context/BloodSugarContext";
import { cn } from "@/lib/utils";

const Detail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { readings, deleteReading } = useBloodSugar();
  
  const reading = readings.find(r => r.id === id);
  
  if (!reading) {
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
          <h1 className="text-lg font-medium">Reading Details</h1>
          <div className="w-5"></div>
        </header>
        
        <main className="app-content">
          <div className="text-center py-10">
            <p>Reading not found.</p>
            <button 
              onClick={() => navigate(-1)}
              className="mt-4 text-app-primary"
            >
              Go Back
            </button>
          </div>
        </main>
      </div>
    );
  }

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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "high":
        return "High";
      case "low":
        return "Low";
      default:
        return "Normal";
    }
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this reading?")) {
      deleteReading(reading.id);
      navigate(-1);
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
        <h1 className="text-lg font-medium">Reading Details</h1>
        <button 
          onClick={handleDelete}
          className="text-app-muted hover:text-app-danger"
          aria-label="Delete reading"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </header>
      
      <main className="app-content animate-fade-in">
        <div className="text-center mb-8">
          <div className={cn("text-5xl font-bold mb-2", getStatusColor(reading.status))}>
            {reading.value}
            <span className="text-sm font-normal ml-1">mg/dL</span>
          </div>
          <div className={cn("inline-block px-3 py-1 rounded-full text-white text-sm", {
            "bg-app-danger": reading.status === "high",
            "bg-app-warning": reading.status === "low",
            "bg-app-success": reading.status === "normal"
          })}>
            {getStatusLabel(reading.status)}
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg border border-app-secondary mb-6 shadow-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-app-label text-sm mb-1">Date</p>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-app-muted" />
                <p>{reading.date}</p>
              </div>
            </div>
            
            <div>
              <p className="text-app-label text-sm mb-1">Time</p>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-app-muted" />
                <p>{reading.time}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-app-label text-sm mb-1">Test Type</p>
            <p>{reading.testType}</p>
          </div>
          
          {reading.note && (
            <div className="mt-4">
              <p className="text-app-label text-sm mb-1">Notes</p>
              <p className="text-sm">{reading.note}</p>
            </div>
          )}
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 py-3 border border-app-primary text-app-primary font-medium rounded-md"
          >
            Back
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 py-3 bg-app-danger text-white font-medium rounded-md"
          >
            Delete
          </button>
        </div>
      </main>
    </div>
  );
};

export default Detail;
