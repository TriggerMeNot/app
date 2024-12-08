import { useLocation, Link } from "react-router-dom";
import { matchPath } from "react-router-dom";
import { AppSidebar } from "@/components/Sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Fragment } from "react/jsx-runtime";

const breadcrumbConfig: Record<string, { name: string; url: string }[]> = {
  "/": [{ name: "Home", url: "/" }],
  "/playground/*": [
    { name: "Home", url: "/" },
    { name: "Playground", url: "/playground" },
  ],
};

function findMatchingBreadcrumbs(
  path: string
): { name: string; url: string }[] {
  const matchedEntries = Object.entries(breadcrumbConfig).filter(([pattern]) =>
    matchPath({ path: pattern, end: false }, path)
  );

  const bestMatch = matchedEntries.sort(
    (a, b) => b[0].length - a[0].length
  )[0];

  return bestMatch ? bestMatch[1] : [];
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const path = location.pathname;

  const breadcrumbs = findMatchingBreadcrumbs(path);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
              {breadcrumbs.map((breadcrumb, index) => (
                <Fragment key={breadcrumb.url}>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink asChild>
                  <Link to={breadcrumb.url}>
                    {breadcrumb.name}
                  </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && (
                  <BreadcrumbSeparator />
                )}
                </Fragment>
              ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
