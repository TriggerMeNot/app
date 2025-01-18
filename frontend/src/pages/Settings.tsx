import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthProvider";
import { changeUserName } from "@/utils/api";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { backendAddress, token, user } = useAuth();
  const [newUsername, setNewUsername] = useState(user?.username);
  const { toast } = useToast();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 max-w-md">
        <Label>Username</Label>
        <div className="flex flex-row gap-2">
          <Input placeholder="Username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
          <Button onClick={() => changeUserName(backendAddress, token as string, newUsername, user?.id as string)
            .then(() => toast({ title: "Success", description: "Username changed successfully" }))
            .catch(() => toast({ title: "Error", description: "Failed to change username" }))}
          >
            Save
          </Button>
        </div>
      <Button variant={"outline"} onClick={() => navigate("/reset-password")}>Reset Password</Button>
      </div>
    </div>
  );
};

export default Settings;
