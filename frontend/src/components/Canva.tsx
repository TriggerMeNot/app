import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
  Background,
  MiniMap,
  SelectionMode,
  Connection,
  Node,
  Edge,
  NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useDnD } from '@/contexts/DnDContext';
import { useTheme } from '@/contexts/theme-provider'

import { ActionNode, ReactionNode } from '@/components/CustomNodes';

import { Icons } from './ui/icons';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from './ui/button';
import { addActionToPlayground, addActionToReactionLink, addReactionToReactionLink, addReactionToPlayground, deleteActionFromPlayground, deleteReactionFromPlayground, editReaction, editAction } from '@/utils/api';
import { useAuth } from '@/contexts/AuthProvider';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import NodeSettingsModal from './NodeCreationSettingsModal';

const panOnDrag = [1, 2];

let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = ({ playground, setPlayground }: { playground: any, setPlayground: (playground: any) => void }) => {
  const { screenToFlowPosition } = useReactFlow();
  const { theme } = useTheme();
  const [data] = useDnD();
  const { backendAddress, token, services } = useAuth();

  const [isDeletionDialogOpen, setIsDeletionDialogOpen] = useState(false);
  const [, setDataToDelete] = useState<{ Nodes: Node[]; Edges: Edge[] } | null>(null);
  const [deletionPromiseResolver, setDeletionPromiseResolver] = useState<((value: boolean) => void) | null>(null);

  const [nodeSettingsModal, setNodeSettingsModal] = useState({
    isOpen: false,
    data: null as any,
    position: { x: 0, y: 0 }
  });

  const [open, setOpen] = useState(false);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const nodeTypes = useMemo(() => {
    const generatedNodeTypes: NodeTypes = {};

    const allActionNames = services.flatMap((service) => service.actions.map((action) => action.id));
    const allReactionNames = services.flatMap((service) => service.reactions.map((reaction) => reaction.id));

    allActionNames.forEach((actionName) => {
      generatedNodeTypes[`action:${actionName}`] = ActionNode;
    });

    allReactionNames.forEach((reactionName) => {
      generatedNodeTypes[`reaction:${reactionName}`] = ReactionNode;
    });

    return generatedNodeTypes;
  }, [services]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  useEffect(() => {
    if (!playground) {
      return;
    }
    const { nodes: generatedNodes, edges: generatedEdges } = generateNodesAndEdges(playground);
    setNodes(generatedNodes);
    setEdges(generatedEdges);
  }, [playground]);

  const generateNodesAndEdges = (playground: any) => {
    const nodes: any[] = [];
    const edges: any[] = [];

    if (!playground) {
      return { nodes, edges };
    }

    playground.actions.forEach((action: any, _index: number) => {
      nodes.push({
        id: `action:${action.id}`,
        type: `action:${action.actionId}`,
        position: { x: action.x, y: action.y },
        data: {
          playgroundId: playground.id,
          playgroundActionId: action.id,
          settingsData: action.settings,
          paramsData: action.params,
          onDelete: () => handleNodeDelete([{ id: `action:${action.id}` } as Node]),
          ...services.find((service) => service.actions.some((a) => a.id === action.actionId))?.actions.find((a) => a.id === action.actionId),
          icon: React.createElement(Icons[services.find((service) => service.actions.some((a) => a.id === action.actionId))?.name.toLowerCase() as keyof typeof Icons] || Icons["default"]),
          serviceName: services.find((service) => service.actions.some((a) => a.id === action.actionId))?.name,
        },
      });
    });

    playground.reactions.forEach((reaction: any, _index: number) => {
      nodes.push({
        id: `reaction:${reaction.id}`,
        type: `reaction:${reaction.reactionId}`,
        position: { x: reaction.x, y: reaction.y },
        data: {
          playgroundId: playground.id,
          playgroundReactionId: reaction.id,
          settingsData: reaction.settings,
          paramsData: reaction.params,
          onDelete: () => handleNodeDelete([{ id: `reaction:${reaction.id}` } as Node]),
          ...services.find((service) => service.reactions.some((r) => r.id === reaction.reactionId))?.reactions.find((r) => r.id === reaction.reactionId),
          icon: React.createElement(Icons[services.find((service) => service.reactions.some((r) => r.id === reaction.reactionId))?.name.toLowerCase() as keyof typeof Icons] || Icons["default"]),
          serviceName: services.find((service) => service.reactions.some((r) => r.id === reaction.reactionId))?.name,
        },
      });
    });

    playground.linksActions.forEach((link: any) => {
      edges.push({
        id: `link:action:${link.id}`,
        source: `action:${link.triggerId}`,
        target: `reaction:${link.reactionId}`,
        animated: true,
        style: { strokeWidth: 2 },
      });
    });

    playground.linksReactions.forEach((link: any) => {
      edges.push({
        id: `link:reaction:${link.id}`,
        source: `reaction:${link.triggerId}`,
        target: `reaction:${link.reactionId}`,
        animated: true,
        style: { strokeWidth: 2 },
      });
    });

    return { nodes, edges };
  };

  const confirmDeletion = useCallback(() => {
    return new Promise<boolean>((resolve) => {
      setDeletionPromiseResolver(() => resolve);
      setIsDeletionDialogOpen(true);
    });
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (deletionPromiseResolver) {
      deletionPromiseResolver(true);
    }
    setIsDeletionDialogOpen(false);
  }, [deletionPromiseResolver]);

  const handleCancelDelete = useCallback(() => {
    if (deletionPromiseResolver) {
      deletionPromiseResolver(false);
    }
    setIsDeletionDialogOpen(false);
  }, [deletionPromiseResolver]);

  const onBeforeDelete = useCallback(
    async ({ nodes, edges }: { nodes: Node[]; edges: Edge[] }): Promise<boolean> => {
      setDataToDelete({ Nodes: nodes, Edges: edges });
      const shouldDelete = await confirmDeletion();
      if (!shouldDelete) {
        return false;
      }

      setNodes((nds) => nds.filter((node) => !nodes.some((n) => n.id === (node as any).id)));
      setEdges((eds) => eds.filter((edge) => !edges.some((e) => e.id === (edge as any).id)));
      return true;
    },
    [confirmDeletion, backendAddress, token, setNodes, setEdges]
  );

  const deletedNodeModal = (
    <Dialog open={isDeletionDialogOpen} onOpenChange={setIsDeletionDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Node</DialogTitle>
          <DialogDescription>Are you sure you want to delete the selected node(s) and edge(s)?</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="default" onClick={handleCancelDelete}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirmDelete}>
            Confirm Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const onConnect = useCallback(
    async (params: Connection) => {
      const { source, target } = params;

      if (!source || !target) return;

      const [sourceType, sourceId] = source.split(":");
      const [targetType, targetId] = target.split(":");

      try {
        if (sourceType === "action" && targetType === "reaction") {
          await addActionToReactionLink(backendAddress, token as string, sourceId, targetId);
        } else if (sourceType === "reaction" && targetType === "reaction") {
          await addReactionToReactionLink(backendAddress, token as string, sourceId, targetId);
        }

        const newEdge: Edge = {
          id: `link:${sourceType}:${sourceId}:${targetType}:${targetId}`,
          source,
          target,
          animated: true,
          style: { strokeWidth: 2 },
        };

        setEdges((eds) => addEdge(newEdge, eds));
      } catch (err) {
        console.error("Failed to create link:", err);
      }
    },
    [backendAddress, token, theme]
  );

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onNodeDragStop = useCallback(
    (_event: any, node: any) => {
      const [type, id] = node.id.split(':');
      if (type === 'action') {
        const action = playground.actions.find((action: any) => action.id === parseInt(id));
        if (action) {
            action.x = Math.round(node.position.x);
            action.y = Math.round(node.position.y);

          editAction(backendAddress, token as string, playground.id, action.id, undefined, Math.round(node.position.x), Math.round(node.position.y));
        }
      } else {
        const reaction = playground.reactions.find((reaction: any) => reaction.id === parseInt(id));
        if (reaction) {
            reaction.x = Math.round(node.position.x);
            reaction.y = Math.round(node.position.y);

          editReaction(backendAddress, token as string, playground.id, reaction.id, undefined, Math.round(node.position.x), Math.round(node.position.y));
        }
      }
    }
    , [playground, backendAddress, token]
  );

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();

      if (!data) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      setNodeSettingsModal({
        isOpen: true,
        data: data.payload,
        position
      });
    },
    [screenToFlowPosition, data]
  );

  const handleNodeSettingsSubmit = useCallback((values: any) => {
    const id = getId();
    const [type] = nodeSettingsModal.data.type.split(':');

    const newNode: any = {
      id,
      type: nodeSettingsModal.data.type,
      position: nodeSettingsModal.position,
      data: {
        playgroundId: playground.id,
        ...nodeSettingsModal.data,
        settings: values,
      },
    };

    setNodes((nds) => nds.concat(newNode));

    if (type === 'action') {
      addActionToPlayground(
        backendAddress,
        token as string,
        playground.id,
        nodeSettingsModal.data.id,
        { ...values },
        nodeSettingsModal.position.x,
        nodeSettingsModal.position.y
      ).then((res) => {
        setPlayground((pg: any) => ({
          ...pg,
          actions: [...pg.actions, res],
        }));
      });
    } else {
      addReactionToPlayground(
        backendAddress,
        token as string,
        playground.id,
        nodeSettingsModal.data.id,
        { ...values },
        nodeSettingsModal.position.x,
        nodeSettingsModal.position.y
      ).then((res) => {
        setPlayground((pg: any) => ({
          ...pg,
          reactions: [...pg.reactions, res],
        }));
      });
    }

    setNodeSettingsModal({ isOpen: false, data: null, position: { x: 0, y: 0 } });
  }, [nodeSettingsModal, backendAddress, token, playground?.id, setNodes, setPlayground]);

  const handleNodeDelete = useCallback(
    (node: Node[]) => {
      node.forEach((n) => {
        const [type, id] = (n as any).id.split(':');
        if (type === 'action') {
          deleteActionFromPlayground(backendAddress, token as string, playground.id, parseInt(id)).then(() => {
            setPlayground((pg: any) => ({
              ...pg,
              actions: pg.actions.filter((action: any) => action.id !== parseInt(id)),
            }));
          });
        } else {
          deleteReactionFromPlayground(backendAddress, token as string, playground.id, parseInt(id)).then(() => {
            setPlayground((pg: any) => ({
              ...pg,
              reactions: pg.reactions.filter((reaction: any) => reaction.id !== parseInt(id)),
            }));
          });
        }
      });
    },
    [backendAddress, token, playground]
  );

  return (
    <>
      <div className="relative h-[45rem] w-full lg:flex">
        <Button className='md:hidden mb-4 w-full' onClick={() => setOpen(true)} variant="secondary">Add Node</Button>
        <ReactFlow
          nodes={nodes}
          onNodesChange={onNodesChange}
          nodeTypes={nodeTypes}
          edges={edges}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          selectionOnDrag
          panOnDrag={panOnDrag}
          selectionMode={SelectionMode.Partial}
          onDrop={onDrop}
          onDragOver={onDragOver}
          deleteKeyCode="Delete"
          onBeforeDelete={onBeforeDelete}
          onNodesDelete={handleNodeDelete}
          onNodeDragStop={onNodeDragStop}
          colorMode={theme}
          className='touch-flow'
          proOptions={{
            hideAttribution: true,
          }}
        >
          <Background />
          <Controls />
          <MiniMap nodeStrokeWidth={3} zoomable pannable />
        </ReactFlow>
      </div>

      {deletedNodeModal}

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a action or reaction name" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {services.map((service) => (
            <>
              <CommandGroup key={service.name} heading={service.name}>
                {service.reactions.map((reaction) => (
                  <CommandItem key={`reaction:${reaction.id}`} onSelect={() => {
                    setNodeSettingsModal({
                      isOpen: true,
                      data: {
                        id: reaction.id,
                        type: `reaction:${reaction.id}`,
                        data: {
                          settings: (reaction as any)?.settings,
                        },
                      },
                      position: { x: 0, y: 0 }
                    });
                  }}>
                    <span>{reaction.name}</span>
                  </CommandItem>
                ))}
                {service.actions.map((action) => (
                  <CommandItem key={`action:${action.id}`} onSelect={() => {
                    setNodeSettingsModal({
                      isOpen: true,
                      data: {
                        id: action.id,
                        type: `action:${action.id}`,
                        data: {
                          settings: (action as any)?.settings,
                        },
                      },
                      position: { x: 0, y: 0 }
                    });
                  }}>
                    <span>{action.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
        ))}
        </CommandList>
      </CommandDialog>

        <NodeSettingsModal
          isOpen={nodeSettingsModal.isOpen}
          onClose={() => setNodeSettingsModal({ isOpen: false, data: null, position: { x: 0, y: 0 } })}
          nodeData={nodeSettingsModal.data}
          onSubmit={handleNodeSettingsSubmit}
        />
    </>
  );
};

export default DnDFlow;
