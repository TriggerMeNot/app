import React, { useState } from 'react';
import { useDnD } from '../DnDContext';
import SidebarPanel from './SidebarPanel';

const Sidebar: React.FC = () => {
  const [_, setType] = useDnD();
  const [openPanels, setOpenPanels] = useState<Record<string, boolean>>({});

  const togglePanel = (panelId: string) => {
    setOpenPanels((prev) => ({
      ...prev,
      [panelId]: !prev[panelId],
    }));
  };

  const onDragStart = (nodeType: string) => (event: React.DragEvent<HTMLButtonElement>) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const panels = [
    {
      id: 'discord',
      logoSrc: '/discord_logo.png',
      logoAlt: 'Discord Logo',
      logoWidth: 32,
      logoHeight: 24,
      buttons: [
        { label: 'Button 1', onDragStart: onDragStart('discord') },
        { label: 'Button 2', onDragStart: onDragStart('discord') },
        { label: 'Button 3', onDragStart: onDragStart('discord') },
      ],
    },
    {
      id: 'git',
      logoSrc: '/git_logo.png',
      logoAlt: 'Git Logo',
      logoWidth: 40,
      logoHeight: 40,
      buttons: [
        { label: 'Button 1', onDragStart: onDragStart('git') },
        { label: 'Button 2', onDragStart: onDragStart('git') },
        { label: 'Button 3', onDragStart: onDragStart('git') },
      ],
    },
    {
      id: 'microsoft',
      logoSrc: '/microsoft_logo.png',
      logoAlt: 'Microsoft Logo',
      logoWidth: 28,
      logoHeight: 28,
      buttons: [
        { label: 'Button 1', onDragStart: onDragStart('microsoft') },
        { label: 'Button 2', onDragStart: onDragStart('microsoft') },
        { label: 'Button 3', onDragStart: onDragStart('microsoft') },
      ],
    },
  ];

  return (
    <aside className="w-80 max-w-xl px-6 py-8 text-l bg-gray-200 text-black">
      <div className="relative flex items-center justify-center text-2xl font-medium mb-6">
        <img
          src="/favicon-32x32.png"
          alt="AREA"
          className="h-6 w-6 mr-2"
        />
        TriggerMeNot
      </div>
      <hr className="h-px mb-6 bg-gray-200 border-0 dark:bg-gray-700"/>
      {panels.map((panel) => (
        <SidebarPanel
          key={panel.id}
          panelId={panel.id}
          isOpen={openPanels[panel.id] || false}
          togglePanel={togglePanel}
          logoSrc={panel.logoSrc}
          logoAlt={panel.logoAlt}
          logoWidth={panel.logoWidth}
          logoHeight={panel.logoHeight}
          buttons={panel.buttons}
        />
      ))}
    </aside>
  );
};

export default Sidebar;
