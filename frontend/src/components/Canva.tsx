import { useCallback, useEffect } from 'react';

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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useDnD } from '@/contexts/DnDContext';
import { useTheme } from '@/contexts/theme-provider'

import { DevTools } from "@/components/devtools";
import { WebHookNode } from '@/components/CustomNodes';

const nodeTypes = {
  webhook: WebHookNode,
};

const panOnDrag = [1, 2];

let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = ({ playground }: { playground: any }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const { theme } = useTheme();
  const [data] = useDnD();

  useEffect(() => {
    console.log(nodes);
    console.log(edges);
  }, [nodes, edges]);

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
        data: {
          ...data.payload,
          onDelete: () => handleDeleteNode(id),
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, data, handleDeleteNode]
  );

  return (
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
        colorMode={theme}
      >
        <Background />
        <Controls />
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
        <DevTools />
      </ReactFlow>
    </div>
  );
};

export default DnDFlow;
