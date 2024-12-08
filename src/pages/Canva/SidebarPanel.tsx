import React from 'react';

interface SidebarPanelProps {
  panelId: string;
  isOpen: boolean;
  togglePanel: (id: string) => void;
  logoSrc: string;
  logoAlt: string;
  logoWidth: number;
  logoHeight: number;
  buttons: { label: string; onDragStart: (event: React.DragEvent<HTMLButtonElement>) => void }[];
}

const SidebarPanel: React.FC<SidebarPanelProps> = ({ 
  panelId, 
  isOpen, 
  togglePanel, 
  logoSrc, 
  logoAlt, 
  logoWidth, 
  logoHeight, 
  buttons 
}) => {
  return (
    <>
      <div
        className="flex items-center justify-center mb-2.5 h-12 px-4 bg-[#FCFCFD] text-[#36395A] text-lg font-['JetBrains_Mono'] rounded-md shadow-[rgba(45,35,66,0.4)_0_2px_4px,rgba(45,35,66,0.3)_0_7px_13px_-3px,#D6D6E7_0_-3px_0_inset] transition-[box-shadow_transform] duration-200 ease-in-out relative cursor-pointer whitespace-nowrap hover:shadow-[rgba(45,35,66,0.4)_0_4px_8px,rgba(45,35,66,0.3)_0_7px_13px_-3px,#D6D6E7_0_-3px_0_inset] hover:-translate-y-0.5 focus:shadow-[#D6D6E7_0_0_0_1.5px_inset,rgba(45,35,66,0.4)_0_2px_4px,rgba(45,35,66,0.3)_0_7px_13px_-3px,#D6D6E7_0_-3px_0_inset] active:shadow-[#D6D6E7_0_3px_7px_inset] active:translate-y-0.5"
        onClick={() => togglePanel(panelId)}
      >
        <img 
          src={logoSrc} 
          alt={logoAlt} 
          className="mr-2"
          style={{ width: `${logoWidth}px`, height: `${logoHeight}px` }}
        />
      </div>
      <div
        className={`bg-[#FCFCFD] text-[#36395A] rounded-md shadow-[rgba(45,35,66,0.4)_0_2px_4px,rgba(45,35,66,0.3)_0_7px_13px_-3px,#D6D6E7_0_-3px_0_inset] transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-screen opacity-100 p-4 my-2' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        {buttons.map((button, index) => (
          <button
            key={index}
            className="block w-full py-2 px-4 mb-2 text-white bg-zinc-700 rounded hover:bg-zinc-600"
            onDragStart={button.onDragStart}
            draggable
          >
            {button.label}
          </button>
        ))}
      </div>
    </>
  );
};

export default SidebarPanel;
