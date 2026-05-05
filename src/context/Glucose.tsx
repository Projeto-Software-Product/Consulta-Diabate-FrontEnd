import { createContext, useContext, useState, type ReactNode } from "react";
import type { GlucoseResponse } from "../model/glucose/glucose.response";
import type { RequestStatus } from "../model/request-status";
import type { GlucoseByIdResponse } from "../model/glucose/glucose-by-id.response";
import type { GlucoseRequest } from "../model/glucose/glucose.request";
import { useAuth } from "./AuthContext";
import { api } from "../service/axios";
import type { UpdateGlucoseRequest } from "../model/glucose/update-glucose.request";

interface GlucoseProviderProps {
  children: ReactNode;
}

interface GlucoseContextProps {
  glucose: GlucoseByIdResponse | null;

  getCurrentUserGlucose: () => Promise<GlucoseResponse | void>;
  getGlucoseByIdRequestStatus: RequestStatus;

  createGlucose: (data: GlucoseRequest) => Promise<void>;
  createGlucoseRequestStatus: RequestStatus;

  deleteGlucose: (id: string) => Promise<void>;
  deleteGlucoseRequestStatus: RequestStatus;

  updateGlucose: (data: UpdateGlucoseRequest, id: string) => Promise<void>;
  updateGlucoseRequestStatus: RequestStatus;
}

const GlucoseContext = createContext<GlucoseContextProps>(
  {} as GlucoseContextProps
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

  const [deleteGlucoseRequestStatus, setDeleteGlucoseRequestStatus] =
    useState<RequestStatus>({ status: "idle" });

  const [updateGlucoseRequestStatus, setUpdateGlucoseRequestStatus] =
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

  const deleteGlucose = async (id: string) => {
    setDeleteGlucoseRequestStatus({ status: "pending" });

    try {
      await api.delete(`/glucose/delete/${id}`);

      setDeleteGlucoseRequestStatus({ status: "succeeded" });
    } catch (error: any) {
      const message =
        error?.message || error?.code || "Erro inesperado. Tente novamente.";
      setDeleteGlucoseRequestStatus({ status: "failed", message });

      console.log(error.response.data);

      alert(message);
    }
  };

  const updateGlucose = async (data: UpdateGlucoseRequest, id: string) => {
    setUpdateGlucoseRequestStatus({ status: "pending" });

    try {
      await api.put(`/glucose/edit/${id}`, data);

      setUpdateGlucoseRequestStatus({ status: "succeeded" });

      console.log(data);
    } catch (error: any) {
      const message =
        error?.message || error?.code || "Erro inesperado. Tente novamente.";
      setDeleteGlucoseRequestStatus({ status: "failed", message });

      setUpdateGlucoseRequestStatus({ status: "failed", message });
      console.log(error.response.data);

      console.log(data);

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
        deleteGlucose,
        deleteGlucoseRequestStatus,
        updateGlucose,
        updateGlucoseRequestStatus,
      }}
    >
      {children}
    </GlucoseContext.Provider>
  );
};