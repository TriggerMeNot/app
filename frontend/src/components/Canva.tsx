import { useCallback, useEffect, useState } from 'react';

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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useDnD } from '@/contexts/DnDContext';
import { useTheme } from '@/contexts/theme-provider'

import { DevTools } from "@/components/devtools";
import { WebHookFetchNode, WebHookTGMNCreateNode } from '@/components/CustomNodes';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from './ui/button';
import { addActionToPlayground, addActionToReactionLink, addReactionToActionLink, addReactionToPlayground, deleteActionFromPlayground, deleteReactionFromPlayground } from '@/utils/api';
import { useAuth } from '@/contexts/AuthProvider';
import { Webhook } from 'lucide-react';

const actionIdToData = {
  1: {
    id: 1,
    actionType: 'action',
    type: 'webhook-create',
    description: 'Is an action that create a webhook under the TGMN platform. This webhook can be used to trigger other nodes.',
    label: 'Create a TGMN webhook',
    icon: Webhook,
  },
};

const reactionIdToData = {
  1: {
    id: 1,
    actionType: 'reaction',
    type: 'webhook-fetch',
    description: 'This node (reaction) fetches an API.',
    label: 'Fetch an API',
    icon: Webhook,
  },
};

const nodeTypes = {
  "webhook-create": WebHookTGMNCreateNode,
  "webhook-fetch": WebHookFetchNode,
};

const panOnDrag = [1, 2];

let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = ({ playground, setPlayground }: { playground: any, setPlayground: (playground: any) => void }) => {
  const { screenToFlowPosition } = useReactFlow();
  const { theme } = useTheme();
  const [data] = useDnD();
  const { backendAddress, token } = useAuth();

  const [isDeletionDialogOpen, setIsDeletionDialogOpen] = useState(false);
  const [, setDataToDelete] = useState<{ Nodes: Node[]; Edges: Edge[] } | null>(null);
  const [deletionPromiseResolver, setDeletionPromiseResolver] = useState<((value: boolean) => void) | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

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
    const horizontalSpacing = 200;
    const verticalSpacing = 100;

    playground.actions.forEach((action: any, index: number) => {
      nodes.push({
        id: `action-${action.id}`,
        type: actionIdToData[action.actionId as keyof typeof actionIdToData].type,
        position: { x: 0, y: index * verticalSpacing },
        playgroundId: playground.id,
        data: {
          ...actionIdToData[action.actionId as keyof typeof actionIdToData],
          settings: action.settings,
          onDelete: () => handleNodeDelete([{ id: `action-${action.id}` } as Node]),
        },
      });
    });

    playground.reactions.forEach((reaction: any, index: number) => {
      nodes.push({
        id: `reaction-${reaction.id}`,
        position: { x: horizontalSpacing, y: index * verticalSpacing },
        type: reactionIdToData[reaction.reactionId as keyof typeof reactionIdToData].type,
        playgroundId: playground.id,
        data: {
          ...reactionIdToData[reaction.reactionId as keyof typeof reactionIdToData],
          settings: reaction.settings,
          onDelete: () => handleNodeDelete([{ id: `reaction-${reaction.id}` } as Node]),
        },
      });
    });

    playground.linksActions.forEach((link: any) => {
      edges.push({
        id: `link-${link.id}`,
        source: `action-${link.triggerId}`,
        target: `reaction-${link.reactionId}`,
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

      const [sourceType, sourceId] = source.split("-");
      const [targetType, targetId] = target.split("-");

      try {
        if (sourceType === "action" && targetType === "reaction") {
          await addActionToReactionLink(backendAddress, token as string, sourceId, targetId);
        } else if (sourceType === "reaction" && targetType === "action") {
          await addReactionToActionLink(backendAddress, token as string, sourceId, targetId);
        }

        const newEdge: Edge = {
          ...params,
          id: `link-${sourceId}-${targetId}`,
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

      const id = getId();

      const newNode: any = {
        id,
        type: data.payload.type,
        position,
        playgroundId: playground.id,
        data: {
          ...data.payload,
        },
      };

      setNodes((nds) => nds.concat(newNode));

      if (data.payload.actionType === 'action') {
        addActionToPlayground(backendAddress, token as string, playground.id, data.payload.id, { settings: {} }).then((res) => {
          setPlayground((pg: any) => ({
            ...pg,
            actions: [...pg.actions, res],
          }));
        });
      } else {
        addReactionToPlayground(backendAddress, token as string, playground.id, data.payload.id, { settings: {} }).then((res) => {
          setPlayground((pg: any) => ({
            ...pg,
            reactions: [...pg.reactions, res],
          }));
        });
      }
    },
    [screenToFlowPosition, data]
  );

  const handleNodeDelete = useCallback(
    (node: Node[]) => {
      node.forEach((n) => {
        const [type, id] = (n as any).id.split('-');
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
          colorMode={theme}
        >
          <Background />
          <Controls />
          <MiniMap nodeStrokeWidth={3} zoomable pannable />
          <DevTools />
        </ReactFlow>
      </div>
      {deletedNodeModal}
    </>
  );
};

export default DnDFlow;
