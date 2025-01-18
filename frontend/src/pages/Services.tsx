import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  getServiceServiceAuth,
  sendServiceServiceAuth,
} from "@/utils/api";
import { useAuth } from "@/contexts/AuthProvider";

function Services() {
  const { backendAddress, token, services } = useAuth();

  const [serviceStatus, setServiceStatus] = useState<{ [key: string]: { authorized: boolean } } | undefined>(undefined);

  useEffect(() => {
    const fetchStatus = async () => {
      services.forEach(async (service) => {
        if (!service?.oauths?.authorization_uri) return;
        setServiceStatus({
          ...serviceStatus,
          [service.name]: await getServiceServiceAuth(backendAddress, token as string, service.name.toLowerCase()),
        });
      });
    };

    fetchStatus();
  }, [window.location.pathname]);

  useEffect(() => {
    services.forEach(async (service) => {
      if (window.location.pathname !== `/services/${service.name.toLowerCase()}`) return;

      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code) {
        const data = await sendServiceServiceAuth(backendAddress, token as string, service.name.toLowerCase(), code);
        setServiceStatus({
          ...serviceStatus,
          [service.name]: data,
        });
        window.history.replaceState({}, document.title, "/services");
      }
    });
  }, [window.location.pathname]);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {services.map((service) => {
        if (!service?.oauths?.authorization_uri) return null;
        return (
          <Card key={service.name} className="flex flex-col">
            <CardHeader>
              <CardTitle>{service.name}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow justify-between">
              <div className="flex-grow"></div> {/* Spacer */}
              {serviceStatus?.[service.name]?.authorized ? (
                <Button disabled className="w-full">
                  Authorized with {service.name}!
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    if (service.oauths?.authorization_uri) {
                      window.location.assign(service.oauths.authorization_uri);
                    }
                  }}
                  className="w-full"
                >
                  Authorize with {service.name}
                </Button>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default Services;
