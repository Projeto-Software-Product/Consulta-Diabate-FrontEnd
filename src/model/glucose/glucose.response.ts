export type Root = GlucoseResponse[];

export interface GlucoseResponse {
  glucose: number;
  meassurementTime: string;
  userName: string;
}
