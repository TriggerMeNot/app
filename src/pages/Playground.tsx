import { deletePlayground, getPlaygroundById, editPlayground } from "@/utils/api";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { useNavigate, useParams } from "react-router-dom";
import Canva from "@/components/Canva";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function Playground() {
  const { id } = useParams<{ id: string }>();
  const [playground, setPlayground] = useState<any>(null);
  const { backendAddress, token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeletionDialogOpen, setIsDeletionDialogOpen] = useState(false);

  useEffect(() => {
    if (!id)
      return;
    getPlaygroundById(backendAddress, token as string, parseInt(id)).then((data) => {
      setPlayground(data);
    });
  }, [backendAddress, token]);

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Input
            value={playground?.name}
            onChange={(e) => setPlayground({ ...playground, name: e.target.value })}
            placeholder="Playground Name"
            className="max-w-xs"
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={"link"}
                  onClick={() => {
                    if (!id) return;
                    editPlayground(backendAddress, token as string, id, { name: playground.name })
                      .then(() => {
                        toast({ title: "Success", description: "Playground updated" });
                      })
                      .catch((err) => {
                        toast({ title: "Error", description: err.message });
                      });
                  }}
                >
                  <Edit size={24} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Update Playground Name</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div>
          <Button
            onClick={() => setIsDeletionDialogOpen(true)}
            variant={"destructive"}
          >
            <Trash size={24} />
            Delete
          </Button>
        </div>
      </div>

      <Dialog open={isDeletionDialogOpen} onOpenChange={setIsDeletionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Playground</DialogTitle>
            <DialogDescription>Are you sure you want to delete the playground?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="default" onClick={() => setIsDeletionDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
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
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Canva playground={playground} setPlayground={setPlayground} />
    </>
  );
}

export default Playground;
