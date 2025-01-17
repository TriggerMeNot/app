import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthProvider";
import { getAllPlaygrounds, createPlayground, getPlaygroundById } from "@/utils/api";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import PreviewFlow from "@/components/PreviewFlow";

const ITEMS_PER_PAGE = 6;

const Home = () => {
  const { backendAddress, token } = useAuth();
  const navigate = useNavigate();
  const [playgrounds, setPlaygrounds] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getAllPlaygrounds(backendAddress, token as string).then((data) => {
      setPlaygrounds(data);
    });
  }, [backendAddress, token]);

  const totalPages = Math.ceil(playgrounds.length / ITEMS_PER_PAGE);

  const displayedPlaygrounds = playgrounds.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCreatePlayground = async () => {
    const data = await createPlayground(backendAddress, token as string);
    navigate(`/playground/${data.id}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const fetchPlaygroundData = async () => {
    const playgroundsData = await Promise.all(
      displayedPlaygrounds.map(async (playground) => {
        if (!playground.detailsFetched) {
          const data = await getPlaygroundById(backendAddress, token as string, playground.id);
          return { ...playground, ...data, detailsFetched: true };
        }
        return playground;
      })
    );
    setPlaygrounds((prevPlaygrounds) => {
      const updatedPlaygrounds = [...prevPlaygrounds];
      playgroundsData.forEach((data) => {
        const index = updatedPlaygrounds.findIndex((pg) => pg.id === data.id);
        if (index !== -1) {
          updatedPlaygrounds[index] = data;
        }
      });
      return updatedPlaygrounds;
    });
  };

  useEffect(() => {
    if (displayedPlaygrounds.some(pg => !pg.detailsFetched)) {
      fetchPlaygroundData();
    }
  }, [displayedPlaygrounds, backendAddress, token]);

  return (
    <>
      <Button
        onClick={handleCreatePlayground}
        variant={"secondary"}
        className="absolute top-4 right-4"
      >
        <Plus />
        Create Playground
      </Button>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {displayedPlaygrounds.map((playground) => (
          <Card key={playground.id}>
            <CardHeader>
              <CardTitle>{playground.name}</CardTitle>
              <CardDescription>
                {playground.description || `Playground ID: ${playground.id}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
                <PreviewFlow playground={playground} />
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
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              aria-disabled={currentPage === 1}
              className={
                currentPage <= 1 ? "pointer-events-none opacity-50" : undefined
              }
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                isActive={currentPage === i + 1}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              aria-disabled={currentPage === totalPages}
              className={
                currentPage >= totalPages ? "pointer-events-none opacity-50" : undefined
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
};

export default Home;
