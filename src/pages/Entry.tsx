
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
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const getStatusLabel = () => {
    if (value > BLOOD_SUGAR_THRESHOLDS.HIGH) return { text: "High", class: "text-app-danger" };
    if (value < BLOOD_SUGAR_THRESHOLDS.LOW) return { text: "Low", class: "text-app-warning" };
    return { text: "Normal", class: "text-app-success" };
  };

  const validate = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!value) {
      newErrors.value = "Blood sugar value is required";
    } else if (value < 0) {
      newErrors.value = "Blood sugar value must be positive";
    }
    
    if (!date) {
      newErrors.date = "Date is required";
    }
    
    if (!time) {
      newErrors.time = "Time is required";
    }
    
    if (!testType) {
      newErrors.testType = "Test type is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const status = getStatusLabel();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
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
                  type="date"
                  className="input-field pl-9"
                  value={date.split('/').reverse().join('-')}
                  onChange={(e) => {
                    const parts = e.target.value.split('-');
                    if (parts.length === 3) {
                      setDate(`${parts[1]}/${parts[2]}/${parts[0]}`);
                    }
                  }}
                />
                <Calendar className="absolute left-3 top-3 w-4 h-4 text-app-muted" />
              </div>
              {errors.date && <p className="text-xs text-app-danger mt-1">{errors.date}</p>}
            </div>
            
            <div className="input-group">
              <label className="input-label">Time</label>
              <div className="relative">
                <input
                  type="time"
                  className="input-field pl-9"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
                <Clock className="absolute left-3 top-3 w-4 h-4 text-app-muted" />
              </div>
              {errors.time && <p className="text-xs text-app-danger mt-1">{errors.time}</p>}
            </div>
          </div>

          <div className="input-group mb-6">
            <div className="flex justify-between items-center">
              <div className="flex-1 text-center">
                <div className="relative inline-flex justify-center items-center mb-2">
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(parseInt(e.target.value) || 0)}
                    className="w-24 text-center text-2xl font-bold py-2 bg-transparent"
                    placeholder="120"
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
                {errors.value && <p className="text-xs text-app-danger mt-1">{errors.value}</p>}
              </div>
            </div>
          </div>

          <div className="input-group mb-6">
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
            {errors.testType && <p className="text-xs text-app-danger mt-1">{errors.testType}</p>}
          </div>

          <div className="input-group mb-6">
            <label className="input-label">Notes (Optional)</label>
            <textarea
              className="select-field min-h-[80px]"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add any notes about this reading..."
            />
          </div>

          <div className="text-center mt-6 mb-8">
            <span className={cn("text-xl font-semibold", status.class)}>
              {status.text}
            </span>
            <p className="text-sm text-app-muted mt-1">
              {status.text === "High" ? "Your blood sugar is above the normal range." : 
               status.text === "Low" ? "Your blood sugar is below the normal range." : 
               "Your blood sugar is within the normal range."}
            </p>
          </div>

          <button type="submit" className="btn-primary">
            Save Reading
          </button>
        </form>
      </main>
    </div>
  );
};

export default Entry;
