import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  getServiceGithubAuth,
  sendServiceGithubAuth
} from "@/utils/api";
import { useAuth } from "@/contexts/AuthProvider";

function Services() {
  const { backendAddress, token } = useAuth();
  const [githubStatus, setGithubStatus] = useState<{ authorized: boolean } | undefined>(undefined);

  useEffect(() => {
    const fetchGithubStatus = async () => {
      setGithubStatus(await getServiceGithubAuth(backendAddress, token as string));
    };

    fetchGithubStatus();
  }, []);

  useEffect(() => {
    const fn = async () => {

      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code) {
        const data = await sendServiceGithubAuth(backendAddress, token as string, code);
        setGithubStatus(data);
        window.history.replaceState({}, document.title, "/services");
      }
    }

    window.addEventListener("load", fn);

    return () => {
      window.removeEventListener("load", fn);
    }
  }, []);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>
            Github
          </CardTitle>
          <CardDescription>
            Github is a web-based platform used for version control. It is used to store and manage code for software projects.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {githubStatus?.authorized ? (
            <Button onClick={() => window.open(`https://github.com/apps/${import.meta.env.VITE_GITHUB_APP_NAME as string}/installations/new`)} className="w-full" variant={"secondary"}>
              Edit Github Authorization
            </Button>
          ) : (
            <Button onClick={() => window.location.assign(`https://github.com/apps/${import.meta.env.VITE_GITHUB_APP_NAME as string}/installations/new`)} className="w-full">
              Authorize with Github
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Services;
