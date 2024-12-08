import { useCallback } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
  Background,
  MiniMap,
  SelectionMode,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { DevTools } from "@/components/devtools";

import Sidebar from './Canva/Sidebar';
import { DnDProvider, useDnD } from './DnDContext';

import Discord from "./Canva/CustomNodes/Discord";
import Git from "./Canva/CustomNodes/Git";
import Microsoft from "./Canva/CustomNodes/Microsoft";

import { ThemeProvider, useTheme } from '../contexts/theme-provider'

const nodeColor = (node: any) => {
  switch (node.type) {
    case 'input':
      return '#6ede87';
    case 'output':
      return '#6865A5';
    case 'discord':
      return '#055dff';
    case 'git':
      return '#d6d27a';
    case 'microsoft':
      return '#3ba853';
    default:
      return '#ff0072';
  }
};

const nodeTypes = {
  discord: Discord,
  git: Git,
  microsoft: Microsoft,
};

const panOnDrag = [1, 2];

let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const { theme } = useTheme();
  const [type] = useDnD();

  const onConnect = useCallback(
    (params: any) => {
      const newEdge = {
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
      setNodes((nds) => nds.filter((node) => node.id !== id));
    },
    [setNodes]
  );

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();

      if (!type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const id = getId();

      const newNode = {
        id,
        type,
        position,
        data: {
          label: `${type} node`,
          onDelete: () => handleDeleteNode(id),
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, type, handleDeleteNode]
  );

  return (
    <ThemeProvider>
      <div className="flex-row flex grow h-full">
        <Sidebar />
        <div className="relative h-screen w-full p-10 text-black lg:flex bg-neutral-100 dark:bg-zinc-900">
          <ReactFlow
            nodes={nodes}
            onNodesChange={onNodesChange}
            nodeTypes={nodeTypes}
            edges={edges}
            onEdgesChange={onEdgesChange}
            edgeStyle={{ strokeWidth: 3 }}
            onConnect={onConnect}
            fitView
            selectionOnDrag
            panOnDrag={panOnDrag}
            selectionMode={SelectionMode.Partial}
            onDrop={onDrop}
            onDragOver={onDragOver}
            deleteKeyCode="Delete"
          >
            <Background />
            <Controls />
            <MiniMap nodeColor={nodeColor} nodeStrokeWidth={3} zoomable pannable />
            <DevTools />
          </ReactFlow>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default () => (
  <ReactFlowProvider>
    <DnDProvider>
      <DnDFlow />
    </DnDProvider>
  </ReactFlowProvider>
);