import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

interface DnDData {
  payload: any;
  type: string | null;
}

type DnDContextType = [DnDData, Dispatch<SetStateAction<DnDData>>];

const DnDContext = createContext<DnDContextType | undefined>(undefined);

interface DnDProviderProps {
  children: ReactNode;
}

export const DnDProvider: React.FC<DnDProviderProps> = ({ children }) => {
  const [data, setData] = useState<DnDData>({ payload: null, type: null });

  return (
    <DnDContext.Provider value={[data, setData]}>
      {children}
    </DnDContext.Provider>
  );
};

export default DnDContext;

export const useDnD = (): DnDContextType => {
  const context = useContext(DnDContext);
  if (!context) {
    throw new Error("useDnD must be used within a DnDProvider");
  }
  return context;
};
