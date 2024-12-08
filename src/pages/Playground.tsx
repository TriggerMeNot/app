import { getPlaygroundById } from "@/utils/api";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { useParams } from "react-router-dom";

function Playground() {
  const { id } = useParams<{ id: string }>();
  const [playground, setPlayground] = useState<any>(null);
  const { backendAddress, token } = useAuth();

  useEffect(() => {
    if (!id)
      return;
    getPlaygroundById(backendAddress, token as string, parseInt(id)).then((data) => {
      setPlayground(data);
    });
  }, [backendAddress, token]);

  return (
    <div>
      <h1>Playground "{playground?.name}"</h1>
    </div>
  );
}

export default Playground;
