import { createContext, useContext, useState, type ReactNode } from "react";
import type { GlucoseByIdResponse } from "../model/glucose/glucose-by-id.response";
import type { GlucoseRequest } from "../model/glucose/glucose.request";
import type { GlucoseResponse } from "../model/glucose/glucose.response";
import type { RequestStatus } from "../model/request-status";
import { api } from "../service/axios";
import { useAuth } from "./AuthContext";

interface GlucoseProviderProps {
  children: ReactNode;
}

interface GlucoseContextProps {
  glucose: GlucoseByIdResponse | null;

  getCurrentUserGlucose: () => Promise<GlucoseResponse | void>;
  getGlucoseByIdRequestStatus: RequestStatus;

  createGlucose: (data: GlucoseRequest) => Promise<void>;
  createGlucoseRequestStatus: RequestStatus;
}

const GlucoseContext = createContext<GlucoseContextProps>(
  {} as GlucoseContextProps,
);

export const useGlucose = () => {
  return useContext(GlucoseContext);
};

export const GlucoseProvider = ({ children }: GlucoseProviderProps) => {
  const [glucose, setGlucose] = useState<GlucoseByIdResponse | null>(null);

  const { sessionUser } = useAuth();

  const [getGlucoseByIdRequestStatus, setGetGlucoseByIdRequestStatus] =
    useState<RequestStatus>({ status: "idle" });

  const [createGlucoseRequestStatus, setCreateGlucoseRequestStatus] =
    useState<RequestStatus>({ status: "idle" });

  const getCurrentUserGlucose = async () => {
    setGetGlucoseByIdRequestStatus({
      status: "pending",
    });

    const id = sessionUser?.id;

    try {
      const response = await api.get(`/glucose/get/${id}`);
      setGlucose(response.data);
      setGetGlucoseByIdRequestStatus({
        status: "succeeded",
      });
      console.log(response.data);

      return response.data;
    } catch (error: any) {
      const message =
        error?.message || error?.code || "Erro inesperado. Tente novamente.";

      console.log(message);

      setGetGlucoseByIdRequestStatus({
        status: "failed",
        message,
      });

      alert(message);

      return;
    }
  };

  const createGlucose = async (data: GlucoseRequest) => {
    setCreateGlucoseRequestStatus({ status: "pending" });

    try {
      await api.post("glucose/create", data);

      setCreateGlucoseRequestStatus({ status: "succeeded" });
    } catch (error: any) {
      const message =
        error?.message || error?.code || "Erro inesperado. Tente novamente.";
      setCreateGlucoseRequestStatus({ status: "failed", message });
      console.log(error.response.data);

      alert(message);
    }
  };

  return (
    <GlucoseContext.Provider
      value={{
        glucose,
        getCurrentUserGlucose,
        createGlucose,
        createGlucoseRequestStatus,
        getGlucoseByIdRequestStatus,
      }}
    >
      {children}
    </GlucoseContext.Provider>
  );
};
