import { useEffect, useRef, useState } from "react";
import Button from "../atoms/Button";
import Input from "../atoms/Input";

interface DrugFormModalProps {
  onClose: () => void;
  onSubmit: (glucose: number, meassurementTime: string) => void;
  glucose?: number;
  meassurementTime?: string;
}

export default function DrugFormModal({
  onClose,
  onSubmit,
  glucose = 0,
  meassurementTime = "",
}: DrugFormModalProps) {
  const [glucoseNumber, setGlucoseNumber] = useState(0);
  const [meassurementTimeHour, setMeassurementTimeHour] = useState("");

  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setGlucoseNumber(glucose);
    setMeassurementTimeHour(meassurementTime);
  }, [glucose, meassurementTime]);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === dialogRef.current) onClose();
  };
  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (glucoseNumber && meassurementTimeHour.trim()) {
      onSubmit(glucoseNumber, meassurementTimeHour.trim());
    }
  };

  return (
    <div
      className="modal-backdrop"
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      onMouseDown={handleBackdropClick}
    >
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <h2 style={{ marginTop: 0 }}>
          {meassurementTimeHour ? "Editar Glicemia" : "Nova Glicemia"}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <Input
            itemRef={inputRef as any}
            placeholder="Glicemia"
            value={glucoseNumber}
            type="number"
            onChange={(e) => setGlucoseNumber(Number(e.target.value))}
          />

          <Input
            itemRef={inputRef as any}
            placeholder="Hora da Medição"
            value={meassurementTimeHour}
            onChange={(e) => setMeassurementTimeHour(e.target.value)}
            style={{ textTransform: "capitalize" }}
          />

          <div
            className="modal-actions"
            style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}
          >
            <Button type="submit" variant="primary">
              {meassurementTimeHour ? "Salvar" : "Cadastrar"}
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
