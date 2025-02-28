
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const CaregiverLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // In a real app, this would validate against a real auth system
    // For demo purposes, we'll use a simple check
    setTimeout(() => {
      setIsLoading(false);
      
      // Demo login - in a real app, you'd verify credentials with your backend
      if (email.includes("@") && password.length >= 6) {
        // Store caregiver login state
        localStorage.setItem("caregiverLoggedIn", "true");
        localStorage.setItem("caregiverEmail", email);
        
        toast({
          title: "Login Successful",
          description: "Welcome to the Caregiver Dashboard"
        });
        
        navigate("/caregiver-dashboard");
      } else {
        setError("Invalid email or password");
        toast({
          title: "Login Failed",
          description: "Please check your credentials and try again",
          variant: "destructive"
        });
      }
    }, 1000);
  };

  return (
    <div className="app-container">
      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-xl shadow-md">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-app-primary">Caregiver Portal</h1>
            <p className="text-app-muted mt-2">Access your patient's health data</p>
          </div>

          {error && (
            <div className="bg-app-danger/10 border border-app-danger/30 text-app-danger p-3 rounded-md flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-app-muted" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="input-field pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-app-muted" />
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="input-field pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full flex justify-center items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Log in"
              )}
            </button>
          </form>

          <div className="text-center text-sm text-app-muted">
            <p>This is the caregiver portal for authorized healthcare providers.</p>
            <p className="mt-2">
              <button 
                onClick={() => navigate("/")} 
                className="text-app-primary hover:underline"
              >
                Return to patient app
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CaregiverLogin;
