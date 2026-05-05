import DrugItem, { type Drug } from "../molecules/DrugItem";

interface DrugListProps {
  drugs: Drug[];
  onEdit: (drug: Drug) => void;
  onDelete: (id: string) => void;
}

export default function DrugList({ drugs, onEdit, onDelete }: DrugListProps) {
  if (!drugs.length) {
    return (
      <div className="card" style={{ opacity: 0.85 }}>
        Nenhum medicamento cadastrado.
      </div>
    );
  }
  return (
    <div className="list">
      {drugs.map((drug) => (
        <DrugItem
          key={drug.id}
          drug={drug}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}