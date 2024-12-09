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
import { WebHookNode } from '@/components/CustomNodes';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from './ui/button';
import { addActionToPlayground, addReactionToPlayground } from '@/utils/api';
import { useAuth } from '@/contexts/AuthProvider';

const nodeTypes = {
  webhook: WebHookNode,
};

const panOnDrag = [1, 2];

let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = ({ playground, setPlayground }: { playground: any, setPlayground: (playground: any) => void }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const { theme } = useTheme();
  const [data] = useDnD();
  const { backendAddress, token } = useAuth();

  const [isDeletionDialogOpen, setIsDeletionDialogOpen] = useState(false);
  const [, setDataToDelete] = useState<{ Nodes: Node[]; Edges: Edge[] } | null>(null);
  const [deletionPromiseResolver, setDeletionPromiseResolver] = useState<((value: boolean) => void) | null>(null);

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
    [confirmDeletion, setNodes, setEdges]
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
    (params: any) => {
      const newEdge : Connection = {
        ...params,
        style: {
          strokeWidth: 2,
          stroke: theme === 'dark' ? 'white' : '#111827',
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    []
  );

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDeleteNode = useCallback(
    (id: string) => {
      setNodes((nds) => nds.filter((node) => (node as any)?.id !== id));
    },
    [setNodes]
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

      const id = getId();

      const newNode: any = {
        id,
        type: data.payload.type,
        position,
        playgroundId: playground.id,
        data: {
          ...data.payload,
          onDelete: () => handleDeleteNode(id),
        },
      };

      setNodes((nds) => nds.concat(newNode));

      if (data.payload.actionType === 'action') {
        addActionToPlayground(backendAddress, token as string, playground.id, data.payload.id, {}).then((res) => {
          setPlayground((pg: any) => ({
            ...pg,
            actions: [...pg.actions, res],
          }));
        });
      } else {
        addReactionToPlayground(backendAddress, token as string, playground.id, data.payload.id, {}).then((res) => {
          setPlayground((pg: any) => ({
            ...pg,
            reactions: [...pg.reactions, res],
          }));
        });
      }
    },
    [screenToFlowPosition, data, handleDeleteNode]
  );

  return (
    <>
      <div className="relative h-[50rem] w-full lg:flex">
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
