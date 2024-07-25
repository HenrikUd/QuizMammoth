import React, { createContext, useContext, useState, ReactNode } from "react";

interface UUIDContextProps {
  uuid: string;
  setUuid: (uuid: string) => void;
}

const UUIDContext = createContext<UUIDContextProps | undefined>(undefined);

export const UUIDProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [uuid, setUuid] = useState<string>("");

  return (
    <UUIDContext.Provider value={{ uuid, setUuid }}>
      {children}
    </UUIDContext.Provider>
  );
};

export const useUUID = (): UUIDContextProps => {
  const context = useContext(UUIDContext);
  if (!context) {
    throw new Error("useUUID must be used within a UUIDProvider");
  }
  return context;
};
