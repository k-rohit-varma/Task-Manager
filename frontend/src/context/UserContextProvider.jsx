import { useEffect, useState } from "react";
import { userContext } from "./userContext";
import axios from "axios";
import { BACKEND_URL } from "../../config";

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const refreshUser = async () => {
    setIsAuthLoading(true);

    try {
      const res = await axios.get(BACKEND_URL + "user/me", {
        withCredentials: true,
      });

      if (res.status === 200) {
        setUser(res?.data?.user);
      }
    } catch {
      setUser(null);
    } finally {
      setIsAuthLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <userContext.Provider
      value={{
        user,
        setUser,
        isAuthLoading,
        setIsAuthLoading,
        refreshUser,
      }}
    >
      {children}
    </userContext.Provider>
  );
};
