import { getPlaygroundById } from "@/utils/api";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { useParams } from "react-router-dom";
import Canva from "@/components/Canva";

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
      <Canva playground={playground} setPlayground={setPlayground} />
    </div>
  );
}

export default Playground;
