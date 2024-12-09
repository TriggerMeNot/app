import { deletePlayground, getPlaygroundById } from "@/utils/api";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { useNavigate, useParams } from "react-router-dom";
import Canva from "@/components/Canva";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function Playground() {
  const { id } = useParams<{ id: string }>();
  const [playground, setPlayground] = useState<any>(null);
  const { backendAddress, token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!id)
      return;
    getPlaygroundById(backendAddress, token as string, parseInt(id)).then((data) => {
      setPlayground(data);
    });
  }, [backendAddress, token]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Input
          value={playground?.name}
          onChange={(e) => setPlayground({ ...playground, name: e.target.value })}
          placeholder="Playground Name"
          className="max-w-xs"
        />
        <div>
          <Button
            onClick={() => {
              if (!id) return;
              deletePlayground(backendAddress, token as string, parseInt(id))
                .then(() => {
                  navigate("/");
                })
                .catch((err) => {
                  toast({ title: "Error", description: err.message });
                });
            }}
            variant={"destructive"}
          >
            <Trash size={24} />
            Delete
          </Button>
        </div>
      </div>
      <Canva playground={playground} setPlayground={setPlayground} />
    </div>
  );
}

export default Playground;
