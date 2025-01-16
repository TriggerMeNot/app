import { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { ActionNode, ReactionNode } from '@/components/CustomNodes';
import getIcon from '@/utils/getIcon';
import { useTheme } from '@/contexts/theme-provider';
import { useAuth } from '@/contexts/AuthProvider';

const PreviewFlow = ({ playground }: { playground: any }) => {
  const { theme } = useTheme();
  const { services } = useAuth();

  const nodeTypes = useMemo(() => {
    const generatedNodeTypes: NodeTypes = {};

    const allActionNames = services.flatMap((service) =>
      service.actions.map((action) => action.id)
    );
    const allReactionNames = services.flatMap((service) =>
      service.reactions.map((reaction) => reaction.id)
    );

    allActionNames.forEach((actionName) => {
      generatedNodeTypes[`action:${actionName}`] = ActionNode;
    });

    allReactionNames.forEach((reactionName) => {
      generatedNodeTypes[`reaction:${reactionName}`] = ReactionNode;
    });

    return generatedNodeTypes;
  }, [services]);

  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    playground?.actions?.forEach((action: any) => {
      nodes.push({
        id: `action:${action.id}`,
        type: `action:${action.actionId}`,
        position: { x: action.x, y: action.y },
        data: {
          playgroundId: playground.id,
          playgroundActionId: action.id,
          settingsData: action.settings,
          paramsData: action.params,
          ...services.find((service) =>
            service.actions.some((a) => a.id === action.actionId)
          )?.actions.find((a) => a.id === action.actionId),
          icon: getIcon(
            services.find((service) =>
              service.actions.some((a) => a.id === action.actionId)
            )?.name || "",
            "Book"
          ),
        },
      });
    });

    playground?.reactions?.forEach((reaction: any) => {
      nodes.push({
        id: `reaction:${reaction.id}`,
        type: `reaction:${reaction.reactionId}`,
        position: { x: reaction.x, y: reaction.y },
        data: {
          playgroundId: playground.id,
          playgroundReactionId: reaction.id,
          settingsData: reaction.settings,
          paramsData: reaction.params,
          ...services.find((service) =>
            service.reactions.some((r) => r.id === reaction.reactionId)
          )?.reactions.find((r) => r.id === reaction.reactionId),
          icon: getIcon(
            services.find((service) =>
              service.reactions.some((r) => r.id === reaction.reactionId)
            )?.name || "",
            "Book"
          ),
        },
      });
    });

    playground?.linksActions?.forEach((link: any) => {
      edges.push({
        id: `link:action:${link.id}`,
        source: `action:${link.triggerId}`,
        target: `reaction:${link.reactionId}`,
        animated: true,
        style: { strokeWidth: 2 },
      });
    });

    playground?.linksReactions?.forEach((link: any) => {
      edges.push({
        id: `link:reaction:${link.id}`,
        source: `reaction:${link.triggerId}`,
        target: `reaction:${link.reactionId}`,
        animated: true,
        style: { strokeWidth: 2 },
      });
    });

    return { nodes, edges };
  }, [playground, services]);

  return (
    <div className="h-[200px] w-full rounded-md border border-border">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnScroll={false}
        panOnDrag={false}
        onDoubleClick={() => {}}
        onClick={() => {}}
        zoomOnDoubleClick={false}
        zoomOnPinch={false}
        colorMode={theme}
        proOptions={{
          hideAttribution: true,
        }}
      >
        <Background />
        <Controls
          showInteractive={false}
          showZoom={false}
          showFitView={false}
        />
      </ReactFlow>
    </div>
  );
};

export default PreviewFlow;
