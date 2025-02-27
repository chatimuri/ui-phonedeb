
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { TEST_TYPES, BLOOD_SUGAR_THRESHOLDS } from "@/types";
import { useBloodSugar } from "@/context/BloodSugarContext";
import { cn } from "@/lib/utils";

const Entry = () => {
  const navigate = useNavigate();
  const { addReading } = useBloodSugar();
  const today = new Date();
  
  const [value, setValue] = useState<number>(120);
  const [date, setDate] = useState<string>(format(today, "MM/dd/yyyy"));
  const [time, setTime] = useState<string>(format(today, "HH:mm"));
  const [testType, setTestType] = useState<string>("Finger Prick");
  const [note, setNote] = useState<string>("");

  const getStatusLabel = () => {
    if (value > BLOOD_SUGAR_THRESHOLDS.HIGH) return { text: "High", class: "text-app-danger" };
    if (value < BLOOD_SUGAR_THRESHOLDS.LOW) return { text: "Low", class: "text-app-warning" };
    return { text: "Normal", class: "text-app-success" };
  };

  const status = getStatusLabel();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addReading({
      value,
      date,
      time,
      testType,
      note: note.trim() || undefined
    });
    
    navigate("/");
  };

  const handleIncrement = () => {
    setValue(prev => prev + 1);
  };

  const handleDecrement = () => {
    setValue(prev => Math.max(0, prev - 1));
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
        <h1 className="text-lg font-medium">Blood Sugar Entry</h1>
        <div className="w-5"></div>
      </header>

      <main className="app-content">
        <form onSubmit={handleSubmit} className="animate-fade-in">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="input-group">
              <label className="input-label">Date</label>
              <div className="relative">
                <input
                  type="text"
                  className="input-field pl-9"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="MM/DD/YYYY"
                />
                <Calendar className="absolute left-3 top-3 w-4 h-4 text-app-muted" />
              </div>
            </div>
            
            <div className="input-group">
              <label className="input-label">Time</label>
              <div className="relative">
                <input
                  type="text"
                  className="input-field pl-9"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="HH:MM"
                />
                <Clock className="absolute left-3 top-3 w-4 h-4 text-app-muted" />
              </div>
            </div>
          </div>

          <div className="input-group">
            <div className="flex justify-between items-center">
              <div className="flex-1 text-center">
                <div className="relative inline-flex justify-center items-center mb-2">
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(parseInt(e.target.value) || 0)}
                    className="w-24 text-center text-2xl font-bold py-2 bg-transparent"
                  />
                  <div className="absolute right-0 flex flex-col">
                    <button 
                      type="button"
                      onClick={handleIncrement}
                      className="text-app-primary"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m18 15-6-6-6 6"/>
                      </svg>
                    </button>
                    <button 
                      type="button"
                      onClick={handleDecrement}
                      className="text-app-primary"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="text-app-label text-sm">Enter Blood Sugar Level (mg/dL)</p>
              </div>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Select Test Type</label>
            <select
              className="select-field"
              value={testType}
              onChange={(e) => setTestType(e.target.value)}
            >
              <option value="" disabled>Select Test Type</option>
              {TEST_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <p className="text-sm text-app-muted mt-1 ml-1">{testType}</p>
          </div>

          <div className="text-center mt-6 mb-8">
            <span className={cn("text-xl font-semibold", status.class)}>
              {status.text}
            </span>
          </div>

          <button type="submit" className="btn-primary">
            Submit
          </button>
        </form>
      </main>
    </div>
  );
};

export default Entry;
