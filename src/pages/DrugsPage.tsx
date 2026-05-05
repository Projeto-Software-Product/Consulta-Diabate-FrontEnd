import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGlucose } from "../context/Glucose";
import DrugFormModal from "../presentation/atomic/organisms/DrugFormModal";
import DrugList from "../presentation/atomic/organisms/DrugList";

export interface Drug {
  id: string;
  glucose: number;
  meassurementTime: string;
  createdAt?: string;
}

export default function DrugsPage() {
  const navigate = useNavigate();
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingDrug, setEditingDrug] = useState<Drug | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const { getCurrentUserGlucose, createGlucose, deleteGlucose, updateGlucose } =
    useGlucose();
  const { sessionUser, signOut } = useAuth();

  const normalizeDrugs = (response: any): Drug[] => {
    if (!Array.isArray(response)) return [];
    return response.map((item) => ({
      id: item.id,
      glucose: item.glucose,
      meassurementTime: item.meassurementTime,
      createdAt: item.createdAt || new Date().toISOString(),
    }));
  };

  useEffect(() => {
    async function fetchDrugs() {
      const response = await getCurrentUserGlucose();
      const normalized = normalizeDrugs(response);
      setDrugs(normalized);
    }

    fetchDrugs();
  }, []);

  const handleLogout = () => {
    signOut();
    navigate("/");
  };

  const handleAddOrUpdateDrug = async (
    glucose: number,
    meassurementTime: string
  ) => {
    const userId = sessionUser?.id || "";

    try {
      if (editingDrug) {
        await updateGlucose({ glucose, meassurementTime }, editingDrug.id);
      } else {
        await createGlucose({ glucose, meassurementTime, userId });
      }

      const response = await getCurrentUserGlucose();
      const normalized = normalizeDrugs(response);
      setDrugs(normalized);

      setEditingDrug(null);
      setModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar glicose:", error);
    }
  };

  const handleEdit = (drug: Drug) => {
    setEditingDrug(drug);
    setModalOpen(true);
  };

  const handleDeleteConfirm = (id: string) => {
    setDeletingId(id);
  };

  const handleDelete = async () => {
    if (deletingId !== null) {
      try {
        await deleteGlucose(deletingId);

        setDrugs((d) => d.filter((x) => x.id !== deletingId));

        setDeletingId(null);
      } catch (error) {
        console.error("Erro ao deletar glicose:", error);
      }
    }
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <header className="page-header">
          <div className="header-content">
            <h1>
              {" "}
              <img
                src="https://aquamarine-hornet-945619.hostingersite.com/wp-content/uploads/2025/10/59b67dc0-c292-4c60-92bb-9693854710d4-removebg-preview.png"
                alt="Logo"
                className="login-logo"
                style={{ width: "80px", height: "auto", marginRight: "8px" }}
              />
              Glicoses
            </h1>
            <p className="subtitle" style={{ paddingLeft: "24px" }}>
              Gerencie sua lista de glicoses
            </p>
          </div>
          <div className="header-actions">
            <button
              className="btn-primary"
              onClick={() => {
                setEditingDrug(null);
                setModalOpen(true);
              }}
            >
              <span className="btn-icon">+</span>
              Adicionar Glicose
            </button>
            <button
              className="btn-logout"
              onClick={() => setShowLogoutConfirm(true)}
              title="Sair"
            >
              <span className="logout-icon">🚪</span>
              Sair
            </button>
          </div>
        </header>

        {drugs.length === 0 ? (
          <div className="empty-state">
            <h2 className="empty-state-title">Nenhuma glicose cadastrada</h2>
            <p className="empty-state-description">
              Comece adicionando sua primeira glicose à lista
            </p>
            <button
              className="btn-primary"
              onClick={() => {
                setEditingDrug(null);
                setModalOpen(true);
              }}
            >
              <span className="btn-icon">+</span>
              Adicionar Primeira Glicose
            </button>
          </div>
        ) : (
          <DrugList
            drugs={drugs}
            onEdit={handleEdit}
            onDelete={handleDeleteConfirm}
          />
        )}

        {isModalOpen && (
          <DrugFormModal
            onClose={() => {
              setModalOpen(false);
              setEditingDrug(null);
            }}
            onSubmit={handleAddOrUpdateDrug}
            glucose={editingDrug?.glucose}
            meassurementTime={editingDrug?.meassurementTime}
          />
        )}

        {deletingId && (
          <div className="modal-backdrop" onClick={() => setDeletingId(null)}>
            <div
              className="modal modal-confirm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Confirmar exclusão</h2>
              </div>
              <div className="modal-body">
                <p>
                  Tem certeza que deseja excluir esta glicose? Esta ação não
                  pode ser desfeita.
                </p>
              </div>
              <div className="modal-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setDeletingId(null)}
                >
                  Cancelar
                </button>
                <button className="btn btn-danger" onClick={handleDelete}>
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}

        {showLogoutConfirm && (
          <div
            className="modal-backdrop"
            onClick={() => setShowLogoutConfirm(false)}
          >
            <div
              className="modal modal-confirm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Sair da conta</h2>
              </div>
              <div className="modal-body">
                <p>
                  Tem certeza que deseja sair? Você precisará fazer login
                  novamente para acessar o sistema.
                </p>
              </div>
              <div className="modal-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  Cancelar
                </button>
                <button
                  className="btn btn-logout-confirm"
                  onClick={handleLogout}
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}