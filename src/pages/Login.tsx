import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../presentation/atomic/atoms/Button";
import Input from "../presentation/atomic/atoms/Input";

export default function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await signIn({ email, password: pass, name: "" });
      navigate("/drugs");
    } catch (e: any) {
      setErr(e.message ?? "Falha ao entrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-bg-decoration">
        <div className="decoration-circle decoration-circle-1"></div>
        <div className="decoration-circle decoration-circle-2"></div>
        <div className="decoration-circle decoration-circle-3"></div>
      </div>

      <div className="login-content">
        <div className="login-brand-section">
          <div className="brand-content">
            <div className="brand-icon-wrapper">
              <img
                src="https://aquamarine-hornet-945619.hostingersite.com/wp-content/uploads/2025/12/Vaccine-development-rafiki.png"
                alt="Logo"
                style={{ height: 500 }}
              />
            </div>
          </div>
        </div>

        <div className="login-form-section">
          <div className="login-card">
            <div className="login-header">
              <h2 className="login-title">Login</h2>
            </div>

            <form onSubmit={onSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  E-mail
                </label>
                <div className="input-wrapper">
                  <span className="input-icon">📧</span>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="input input-with-icon"
                    required
                    autoComplete="email"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Senha
                </label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    placeholder="••••••••"
                    className="input input-with-icon"
                    required
                    autoComplete="current-password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Ocultar senha" : "Mostrar senha"
                    }
                    disabled={loading}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              {err && (
                <div className="error-message" role="alert">
                  <span className="error-icon">⚠️</span>
                  <span>Senha ou E-mail Inválidos</span>
                </div>
              )}

              <Button
                variant="primary"
                type="submit"
                disabled={loading || !email || !pass}
                size="md"
                className="btn-primary btn-login"
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Entrando...
                  </>
                ) : (
                  <>
                    <span>Entrar</span>
                    <span className="btn-arrow">→</span>
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
