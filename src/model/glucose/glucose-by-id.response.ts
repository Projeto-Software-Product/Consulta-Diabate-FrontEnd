export type Root = GlucoseByIdResponse[];

export interface GlucoseByIdResponse {
  glucose: number;
  meassurementTime: string;
  userName: string;
}
