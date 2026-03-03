import DrugItem, { type Drug } from "../molecules/DrugItem";

interface DrugListProps {
  drugs: Drug[];
}

export default function DrugList({ drugs }: DrugListProps) {
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
        <DrugItem key={drug.id} drug={drug} />
      ))}
    </div>
  );
}
