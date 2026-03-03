export interface Drug {
  id: string;
  glucose: number;
  meassurementTime: string;
  createdAt?: string;
}

interface DrugItemProps {
  drug: Drug;
}

export default function DrugItem({ drug }: DrugItemProps) {
  return (
    <div className="card item">
      <span className="title">Número da Glicose: {drug.glucose}</span>{" "}
      <span className="glucose">Horário: {drug.meassurementTime}</span>{" "}
    </div>
  );
}
