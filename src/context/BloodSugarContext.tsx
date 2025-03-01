
import React, { createContext, useContext, useState, useEffect } from "react";
import { BloodSugarReading, BLOOD_SUGAR_THRESHOLDS, Medication, UserProfile, EmailNotification } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import emailjs from 'emailjs-com';

// Initialize EmailJS with your user ID
// In a real app, you would store these in environment variables
const EMAILJS_USER_ID = "YOUR_EMAILJS_USER_ID"; // Replace with your actual EmailJS User ID
const EMAILJS_SERVICE_ID = "YOUR_EMAILJS_SERVICE_ID"; // Replace with your actual EmailJS Service ID
const EMAILJS_TEMPLATE_ID = "YOUR_EMAILJS_TEMPLATE_ID"; // Replace with your actual EmailJS Template ID

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

    // Now sending notifications for both HIGH and LOW blood sugar readings
    if (reading.status !== 'high' && reading.status !== 'low') {
      console.log("Only high and low blood sugar readings trigger caregiver notifications");
      return false;
    }

    try {
      // Create different email subject and body based on status
      const subjectPrefix = reading.status === 'high' ? 'Urgent: High' : 'Alert: Low';
      const statusMessage = reading.status === 'high' ? 'high' : 'low';
      
      const emailContent = {
        to_email: userProfile.caregiverEmail,
        subject: `${subjectPrefix} Blood Sugar Alert`,
        patient_name: userProfile.name,
        status_message: statusMessage,
        reading_value: reading.value,
        reading_date: reading.date,
        reading_time: reading.time,
        reading_type: reading.testType,
        reading_note: reading.note || 'No additional notes',
        from_name: "Blood Sugar Monitor App"
      };
      
      // Log the notification for demonstration
      console.log("Sending email notification to caregiver:", userProfile.caregiverEmail);
      console.log("Email content:", emailContent);
      
      // Actually send the email using EmailJS
      // NOTE: This will only work after you've properly configured EmailJS
      // with your account details and created a template
      if (EMAILJS_USER_ID !== "YOUR_EMAILJS_USER_ID") {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          emailContent,
          EMAILJS_USER_ID
        );
        
        // Show success toast
        toast({
          title: "Notification Sent",
          description: `An alert has been sent to ${userProfile.caregiverEmail}`,
        });
      } else {
        console.log("EmailJS not configured. Would have sent email with:", emailContent);
        console.log("Please replace the placeholder EmailJS credentials with your actual values");
        
        // Show alert about configuration
        toast({
          title: "Email Configuration Required",
          description: "Email service needs to be configured with your EmailJS credentials",
          variant: "destructive",
        });
      }
      
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
      
      // Now sending notification for low readings
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
