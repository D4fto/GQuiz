import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null)

export function AuthProvider({ children }){
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch(import.meta.env.VITE_API_URL+"/me", {
          credentials: "include" 
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}