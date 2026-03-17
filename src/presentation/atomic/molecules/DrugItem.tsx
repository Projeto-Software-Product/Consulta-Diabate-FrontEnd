import Button from "../atoms/Button";

export interface Drug {
  id: string;
  glucose: number;
  meassurementTime: string;
  createdAt?: string;
}

interface DrugItemProps {
  drug: Drug;
  onEdit: (drug: Drug) => void;
}

export default function DrugItem({ drug, onEdit }: DrugItemProps) {
  return (
    <div className="card item">
      <span className="title">Número da Glicose: {drug.glucose}</span>{" "}
      <span className="glucose">Horário: {drug.meassurementTime}</span>{" "}
      <div className="actions">
        <Button size="sm" onClick={() => onEdit(drug)}>
          Editar
        </Button>
      </div>
    </div>
  );
}