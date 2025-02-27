
import React, { createContext, useContext, useState, useEffect } from "react";
import { BloodSugarReading, BLOOD_SUGAR_THRESHOLDS } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";

interface BloodSugarContextType {
  readings: BloodSugarReading[];
  addReading: (reading: Omit<BloodSugarReading, "id" | "status">) => void;
  deleteReading: (id: string) => void;
  loading: boolean;
}

const BloodSugarContext = createContext<BloodSugarContextType | undefined>(undefined);

export const useBloodSugar = () => {
  const context = useContext(BloodSugarContext);
  if (!context) {
    throw new Error("useBloodSugar must be used within a BloodSugarProvider");
  }
  return context;
};

export const BloodSugarProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [readings, setReadings] = useState<BloodSugarReading[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load saved readings from localStorage
    const loadReadings = () => {
      try {
        const savedReadings = localStorage.getItem("bloodSugarReadings");
        if (savedReadings) {
          setReadings(JSON.parse(savedReadings));
        }
      } catch (error) {
        console.error("Failed to load readings:", error);
        toast({
          title: "Error",
          description: "Failed to load your saved readings.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadReadings();
  }, []);

  useEffect(() => {
    // Save readings to localStorage whenever they change
    if (!loading) {
      localStorage.setItem("bloodSugarReadings", JSON.stringify(readings));
    }
  }, [readings, loading]);

  const determineStatus = (value: number): 'normal' | 'high' | 'low' => {
    if (value < BLOOD_SUGAR_THRESHOLDS.LOW) return 'low';
    if (value > BLOOD_SUGAR_THRESHOLDS.HIGH) return 'high';
    return 'normal';
  };

  const addReading = (readingData: Omit<BloodSugarReading, "id" | "status">) => {
    const newReading: BloodSugarReading = {
      ...readingData,
      id: crypto.randomUUID(),
      status: determineStatus(readingData.value)
    };

    setReadings(prev => [newReading, ...prev]);
    
    // Show appropriate toast based on reading status
    if (newReading.status === 'high') {
      toast({
        title: "High Blood Sugar",
        description: "Your blood sugar reading is high.",
        variant: "destructive",
      });
    } else if (newReading.status === 'low') {
      toast({
        title: "Low Blood Sugar",
        description: "Your blood sugar reading is low.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Reading Saved",
        description: `Blood sugar (${readingData.value} mg/dL) saved successfully.`,
      });
    }
  };

  const deleteReading = (id: string) => {
    setReadings(prev => prev.filter(reading => reading.id !== id));
    toast({
      title: "Reading Deleted",
      description: "The blood sugar reading has been deleted.",
    });
  };

  return (
    <BloodSugarContext.Provider
      value={{
        readings,
        addReading,
        deleteReading,
        loading
      }}
    >
      {children}
    </BloodSugarContext.Provider>
  );
};
