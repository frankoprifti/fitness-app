import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import axios from "axios";

interface MuteContextType {
  isMuted: boolean;
  showOverlay: boolean;
  setIsMuted: Dispatch<SetStateAction<boolean>>;
}

const MuteContext = createContext<MuteContextType | undefined>(undefined);

export const MuteProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    setShowOverlay(true);
    setTimeout(() => {
      setShowOverlay(false);
    }, 2000);
  }, [isMuted]);

  return (
    <MuteContext.Provider value={{ isMuted, setIsMuted, showOverlay }}>
      {children}
    </MuteContext.Provider>
  );
};

export const useMute = () => {
  const context = useContext(MuteContext);
  if (!context) {
    throw new Error("useMute must be used within a MuteProvider");
  }
  return context;
};
