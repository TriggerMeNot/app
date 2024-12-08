import * as React from "react";
import { useDnD } from "@/contexts/DnDContext";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ChevronRight } from "lucide-react";

type Panel = {
  id: string;
  logoSrc: string;
  logoAlt: string;
  logoWidth: number;
  logoHeight: number;
  buttons: { label: string; nodeType: string }[];
};

export function NavCanva({
  ...props
}: React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const [_, setType] = useDnD();

  const onDragStart = (nodeType: string) => (event: React.DragEvent<HTMLButtonElement>) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const panels: Panel[] = [
    {
      id: "discord",
      logoSrc: "/discord_logo.png",
      logoAlt: "Discord Logo",
      logoWidth: 20,
      logoHeight: 20,
      buttons: [
        { label: "Receive a message", nodeType: "discord" },
        { label: "Button 2", nodeType: "discord" },
        { label: "Button 3", nodeType: "discord" },
      ],
    },
    {
      id: "git",
      logoSrc: "/git_logo.png",
      logoAlt: "Git Logo",
      logoWidth: 26,
      logoHeight: 26,
      buttons: [
        { label: "Button 1", nodeType: "git" },
        { label: "Button 2", nodeType: "git" },
        { label: "Button 3", nodeType: "git" },
      ],
    },
    {
      id: "microsoft",
      logoSrc: "/microsoft_logo.png",
      logoAlt: "Microsoft Logo",
      logoWidth: 20,
      logoHeight: 20,
      buttons: [
        { label: "Button 1", nodeType: "microsoft" },
        { label: "Button 2", nodeType: "microsoft" },
        { label: "Button 3", nodeType: "microsoft" },
      ],
    },
  ];

  return (
    <SidebarGroup {...props}>
      <SidebarGroupLabel className="mb-2.5">
        Action Reaction Nodes
      </SidebarGroupLabel>
      <SidebarMenu className="space-y-2">
        {panels.map((panel) => (
          <Collapsible key={panel.id}>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a>
                  <img
                    src={panel.logoSrc}
                    alt={panel.logoAlt}
                    width={panel.logoWidth}
                    height={panel.logoHeight}
                  />
                  <span>{panel.id.charAt(0).toUpperCase() + panel.id.slice(1)}</span>
                </a>
              </SidebarMenuButton>

            <CollapsibleTrigger asChild>
              <SidebarMenuAction className="data-[state=open]:rotate-90">
                <ChevronRight />
                <span className="sr-only">Toggle</span>
              </SidebarMenuAction>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {panel.buttons.map((button) => (
                  <SidebarMenuSubItem key={button.label}>
                    <SidebarMenuSubButton>

                      <Sheet>
                        <SheetTrigger asChild>
                          <button
                            onDragStart={onDragStart(button.nodeType)}
                            draggable
                            className="flex items-center space-x-2 w-full"
                          >
                            {button.label}
                          </button>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle>{button.label}</SheetTitle>
                            <SheetDescription>
                              This is a {button.label} node.
                            </SheetDescription>
                          </SheetHeader>
                        </SheetContent>
                      </Sheet>

                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
