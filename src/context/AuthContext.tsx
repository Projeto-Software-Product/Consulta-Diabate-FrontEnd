import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { AuthRequest } from "../model/auth/auth-request";
import type { AuthTokenDTO } from "../model/auth/auth-token-response-dto";
import type { AuthTokenResponse } from "../model/auth/auth-token.response";
import type { RequestStatus } from "../model/request-status";
import { api } from "../service/axios";
import { decodeJwt } from "../service/jwt-decode";
import {
  deleteItemAsync,
  getItemAsync,
  setItemAsync,
} from "../utils/useStorageState";

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextProps {
  signIn: (data: AuthRequest) => Promise<void>;
  signOut: () => void;
  sessionUser: AuthTokenDTO | null;
  requestStatus: RequestStatus;
  session?: string | null;
  isAuthLoading: boolean;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [sessionUser, setSessionUser] = useState<AuthTokenDTO | null>(null);
  const [session, setSession] = useState<string | null>(null);

  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const [requestStatus, setRequestStatus] = useState<RequestStatus>({
    message: "",
    status: "idle",
  });

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const [storedToken, storedUserJson] = await Promise.all([
          getItemAsync("token"),
          getItemAsync("user"),
        ]);

        if (!mounted) return;

        if (storedToken) {
          setSession(storedToken);
          api.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
        }

        if (storedUserJson) {
          setSessionUser(JSON.parse(storedUserJson));
        }
      } catch {
        setSession(null);
        setSessionUser(null);
        delete api.defaults.headers.common.Authorization;
      } finally {
        if (mounted) setIsAuthLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const signIn = async (data: AuthRequest) => {
    setRequestStatus({ status: "pending", message: "" });
    console.log("entrei 1");

    try {
      const response = await api.post("/auth/login", data);
      console.log(response.data);

      setRequestStatus({ status: "succeeded", message: "" });

      const token: string | undefined = response?.data?.accessToken;

      console.log("🔐 TOKEN RECEBIDO:", token);
      if (!token) throw new Error("Token não retornado pelo servidor.");

      const decoded = decodeJwt<AuthTokenResponse>(token);
      console.log("🧩 TOKEN DECODED:", decoded);

      console.log(decoded.id);

      if (!decoded?.id) throw new Error("Payload do token inválido.");

      const userDto: AuthTokenDTO = { id: decoded.id };

      setSessionUser(userDto);
      setSession(token);

      await Promise.all([
        setItemAsync("token", token),
        setItemAsync("user", JSON.stringify(userDto)),
      ]);

      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      setRequestStatus({ status: "idle", message: "" });
    } catch (error: any) {
      console.log("deu erroooo aquiiii");

      const message = "Erro inesperado. Tente novamente.";
      setRequestStatus({ status: "failed", message });
      setRequestStatus({ status: "idle", message: "" });
      throw error;
    }
  };

  const signOut = () => {
    setSessionUser(null);
    setSession(null);

    deleteItemAsync("token");
    deleteItemAsync("user");

    delete api.defaults.headers.common.Authorization;
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        sessionUser,
        requestStatus,
        session,
        isAuthLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
