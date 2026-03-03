export interface RequestStatus {
  status: "idle" | "succeeded" | "failed" | "pending";
  message?: string;
}
