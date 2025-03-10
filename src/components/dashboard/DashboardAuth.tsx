
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DashboardAuthProps {
  onAuthenticated: () => void;
}

const DashboardAuth = ({ onAuthenticated }: DashboardAuthProps) => {
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleLogin = () => {
    if (password === "1234") {
      onAuthenticated();
      toast({
        title: "Success",
        description: "You have been logged in to the dashboard.",
      });
    } else {
      toast({
        title: "Error",
        description: "Incorrect password.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow animate-fade-in">
        <div className="text-center">
          <h2 className="text-3xl font-display text-estate-800">Dashboard Login</h2>
          <p className="mt-2 text-gray-600">Enter password to access owner dashboard</p>
        </div>
        <div className="mt-8 space-y-6">
          <div>
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="animate-fade-in"
              style={{ animationDelay: "100ms" }}
            />
          </div>
          <Button 
            className="w-full hover-scale animate-fade-in" 
            style={{ animationDelay: "200ms" }}
            onClick={handleLogin}
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardAuth;
