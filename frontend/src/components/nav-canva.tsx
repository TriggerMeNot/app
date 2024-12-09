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
import { ChevronRight, Webhook } from "lucide-react";

type Panel = {
  id: string;
  icon: React.ElementType | string | null;
  logoAlt: string;
  options: {
    label: string;
    code: string;
    id: number | undefined;
    type?: "action" | "reaction";
    description?: string;
  }[];
};

export function NavCanva({
  ...props
}: React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const [_, setData] = useDnD();

  const panels: Panel[] = [
    {
      id: "webhook",
      icon: Webhook,
      logoAlt: "Discord Logo",
      options: [
        {
          label: "Create a TGMN webhook",
          code: "webhook-create",
          id: 1,
          type: "action",
          description: "Is an action that create a webhook under the TGMN platform. This webhook can be used to trigger other nodes."
        },
        {
          label: "Fetch an API",
          code: "webhook-fetch",
          id: 1, // 1 too because it's an reaction and the id counter is not shared between actions and reactions
          type: "reaction",
          description: "This node (reaction) fetches an API."
        },
      ],
    }
  ];

  const onDragStart = (button: Panel["options"][0], icon?: Panel["icon"]) => (event: React.DragEvent) => {
    setData(
      {
        payload: {
          label: button.label,
          id: button.id,
          type: button.code,
          actionType: button.type,
          icon: icon,
          data: {},
        },
        type: "node",
      }
    );
    event.dataTransfer.effectAllowed = "move";
  };

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
                  {panel.icon ? (
                    typeof panel.icon === "string" ? (
                      <img
                        src={panel.icon}
                        alt={panel.logoAlt}
                        width={20}
                        height={20}
                      />
                    ) : (
                      <panel.icon size={20} />
                    )
                  ) : (
                    <div className="w-5 h-5" />
                  )}
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
                {panel.options.map((button) => (
                  <SidebarMenuSubItem key={button.label}>
                    <SidebarMenuSubButton>

                      <Sheet>
                        <SheetTrigger asChild>
                          <button
                            onDragStart={onDragStart(button, panel.icon)}
                            draggable
                            className="flex items-center space-x-2 w-full"
                          >
                            {button.label}
                          </button>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader className="flex items-center space-x-2">
                              {panel.icon ? (
                                typeof panel.icon === "string" ? (
                                  <img
                                    src={panel.icon}
                                    alt={panel.logoAlt}
                                    width={20}
                                    height={20}
                                  />
                                ) : (
                                  <panel.icon size={20} />
                                )
                              ) : (
                                <div className="w-5 h-5" />
                              )}
                            <SheetTitle>
                              {button.label}
                            </SheetTitle>
                            <SheetDescription>
                              {button.description}
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
