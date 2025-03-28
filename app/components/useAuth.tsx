import { getSession, Session } from "@/util/auth";
import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext<{
  session: Session | null;
  setSession: (session: Session) => void;
} | null>(null);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    getSession().then((currentSession) => {
      setSession(currentSession);
    });
  }, [session]);
  return (
    // give bot session and set Session
    <AuthContext.Provider value={{ session, setSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const session = useContext(AuthContext);
  if (!session) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return session;
};
