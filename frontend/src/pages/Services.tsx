import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  getServiceServiceAuth,
  sendServiceServiceAuth,
} from "@/utils/api";
import { useAuth } from "@/contexts/AuthProvider";
import { Browser } from "@capacitor/browser";
import { Capacitor } from '@capacitor/core';

function Services() {
  const { backendAddress, token, services } = useAuth();

  const [serviceStatus, setServiceStatus] = useState<{ [key: string]: { authorized: boolean } } | undefined>(undefined);

  useEffect(() => {
    const fetchStatus = async () => {
      const statusPromises = services.map(async (service) => {
        if (!service?.oauths?.authorization_uri) return null;
        const status = await getServiceServiceAuth(backendAddress, token as string, service.name.toLowerCase());
        return { [service.name]: status };
      });

      const statuses = await Promise.all(statusPromises);
      const statusObject = statuses.reduce((acc, status) => ({ ...acc, ...status }), {});
      if (statusObject) {
        setServiceStatus(statusObject);
      }
    };

    fetchStatus();
  }, [services, backendAddress, token]);

  useEffect(() => {
    const handleAuth = async () => {
      const service = services.find(service => window.location.pathname === `/services/${service.name.toLowerCase()}`);
      if (!service) return;

      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code) {
        const data = await sendServiceServiceAuth(backendAddress, token as string, service.name.toLowerCase(), code);
        setServiceStatus((prevStatus) => ({
          ...prevStatus,
          [service.name]: data,
        }));
        window.history.replaceState({}, document.title, "/services");
      }
    };

    handleAuth();
  }, [services, backendAddress, token]);

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
                  onClick={async () => {
                    if (service.oauths?.authorization_uri) {
                      if (Capacitor.isNativePlatform()) {
                        await Browser.open({ url: service.oauths.authorization_uri });
                      } else {
                        window.location.assign(service.oauths.authorization_uri);
                      }
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
