
import React, { createContext, useContext, useState, useEffect } from "react";
import { BloodSugarReading, BLOOD_SUGAR_THRESHOLDS, Medication, UserProfile, EmailNotification } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";

interface BloodSugarContextType {
  readings: BloodSugarReading[];
  addReading: (reading: Omit<BloodSugarReading, "id" | "status">) => void;
  deleteReading: (id: string) => void;
  loading: boolean;
  medications: Medication[];
  addMedication: (medication: Omit<Medication, "id">) => void;
  userProfile: UserProfile;
  updateUserProfile: (profile: UserProfile) => void;
  reminders: Medication[];
  sendCaregiverNotification: (reading: BloodSugarReading) => Promise<boolean>;
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
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "John Doe",
    notificationsEnabled: true,
    emailNotificationsEnabled: true
  });

  // Medications due today are considered reminders
  const reminders = medications.filter(med => {
    // In a real app, we would check if the medication is due today
    return true;
  });

  useEffect(() => {
    // Load saved readings from localStorage
    const loadData = () => {
      try {
        const savedReadings = localStorage.getItem("bloodSugarReadings");
        if (savedReadings) {
          setReadings(JSON.parse(savedReadings));
        }

        const savedMedications = localStorage.getItem("medications");
        if (savedMedications) {
          setMedications(JSON.parse(savedMedications));
        }

        const savedUserProfile = localStorage.getItem("userProfile");
        if (savedUserProfile) {
          setUserProfile(JSON.parse(savedUserProfile));
        }
      } catch (error) {
        console.error("Failed to load data:", error);
        toast({
          title: "Error",
          description: "Failed to load your saved data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    // Save readings to localStorage whenever they change
    if (!loading) {
      localStorage.setItem("bloodSugarReadings", JSON.stringify(readings));
    }
  }, [readings, loading]);

  useEffect(() => {
    // Save medications to localStorage whenever they change
    if (!loading) {
      localStorage.setItem("medications", JSON.stringify(medications));
    }
  }, [medications, loading]);

  useEffect(() => {
    // Save user profile to localStorage whenever it changes
    if (!loading) {
      localStorage.setItem("userProfile", JSON.stringify(userProfile));
    }
  }, [userProfile, loading]);

  const determineStatus = (value: number): 'normal' | 'high' | 'low' => {
    if (value < BLOOD_SUGAR_THRESHOLDS.LOW) return 'low';
    if (value > BLOOD_SUGAR_THRESHOLDS.HIGH) return 'high';
    return 'normal';
  };

  // Function to send notification to caregiver
  const sendCaregiverNotification = async (reading: BloodSugarReading): Promise<boolean> => {
    if (!userProfile.caregiverEmail || !userProfile.emailNotificationsEnabled) {
      console.log("Email notifications not enabled or no caregiver email provided");
      return false;
    }

    try {
      // In a real app, this would be a call to a backend service
      // Here we're simulating the email sending process
      console.log(`Sending email notification to caregiver: ${userProfile.caregiverEmail}`);
      
      const notification: EmailNotification = {
        to: userProfile.caregiverEmail,
        subject: `Blood Sugar Alert: ${reading.status.toUpperCase()} Reading`,
        body: `
          ${userProfile.name} has recorded a ${reading.status} blood sugar reading.
          
          Reading Details:
          Value: ${reading.value} mg/dL
          Date: ${reading.date}
          Time: ${reading.time}
          Test Type: ${reading.testType}
          ${reading.note ? `Note: ${reading.note}` : ''}
          
          Please check in with them if necessary.
        `
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Log the notification for demonstration
      console.log("Email notification:", notification);
      
      // Show success toast
      toast({
        title: "Notification Sent",
        description: `An alert has been sent to ${userProfile.caregiverEmail}`,
      });
      
      return true;
    } catch (error) {
      console.error("Failed to send notification:", error);
      
      toast({
        title: "Notification Failed",
        description: "Could not send the alert to the caregiver.",
        variant: "destructive",
      });
      
      return false;
    }
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
      
      // Send notification to caregiver for high reading
      if (userProfile.caregiverEmail && userProfile.emailNotificationsEnabled) {
        sendCaregiverNotification(newReading);
      }
    } else if (newReading.status === 'low') {
      toast({
        title: "Low Blood Sugar",
        description: "Your blood sugar reading is low.",
        variant: "destructive",
      });
      
      // Send notification to caregiver for low reading
      if (userProfile.caregiverEmail && userProfile.emailNotificationsEnabled) {
        sendCaregiverNotification(newReading);
      }
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

  const addMedication = (medicationData: Omit<Medication, "id">) => {
    const newMedication: Medication = {
      ...medicationData,
      id: crypto.randomUUID()
    };

    setMedications(prev => [...prev, newMedication]);
    
    toast({
      title: "Medication Added",
      description: `${medicationData.name} has been added to your medications.`,
    });
  };

  const updateUserProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };

  return (
    <BloodSugarContext.Provider
      value={{
        readings,
        addReading,
        deleteReading,
        loading,
        medications,
        addMedication,
        userProfile,
        updateUserProfile,
        reminders,
        sendCaregiverNotification
      }}
    >
      {children}
    </BloodSugarContext.Provider>
  );
};
