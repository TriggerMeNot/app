import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthProvider";
import { getAllPlaygrounds, createPlayground } from "@/utils/api";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { backendAddress, token } = useAuth();
  const navigate = useNavigate();
  const [playgrounds, setPlaygrounds] = useState<any[]>([]);

  useEffect(() => {
    getAllPlaygrounds(backendAddress, token as string).then((data) => {
      setPlaygrounds(data);
    });
  }, [backendAddress, token]);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {playgrounds.map((playground) => (
          <Card key={playground.id} >
            <CardHeader>
              <CardTitle>
                {playground.name}
              </CardTitle>
              <CardDescription>
                {playground.description || `Playground ID: ${playground.id}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <img
                src={"https://fastly.picsum.photos/id/1084/536/354.jpg?grayscale&hmac=Ux7nzg19e1q35mlUVZjhCLxqkR30cC-CarVg-nlIf60"}
                alt={playground.name}
                className="w-[95%] h-40 object-cover rounded-lg grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer hover:w-full justify-self-center"
                onClick={() => navigate(`/playground/${playground.id}`)}
              />
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => navigate(`/playground/${playground.id}`)}
                className="w-full"
                variant={"outline"}
              >
                Open Playground
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <Button
        className="mt-4 absolute bottom-4 right-4"
        onClick={() => {
          createPlayground(backendAddress, token as string).then((data) => {
            navigate(`/playground/${data.id}`);
          })
        }}
        variant={"secondary"}
      >
        <Plus />
        Create Playground
      </Button>
    </>
  );
};

export default Home;
