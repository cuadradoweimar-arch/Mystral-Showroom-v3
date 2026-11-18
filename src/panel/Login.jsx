import { useState } from "react";
import { api } from "./api";

export default function Login({ onLogin }) {

    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    const submit = async (event) => {
        event.preventDefault();
        setBusy(true);
        setError("");
        try {
            onLogin(await api("session", { method: "POST", body: { user, password } }));
        } catch (err) {
            setError(err.message);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="p-login">
            <form className="p-login-card" onSubmit={submit}>
                <img src="/icons/icon-180.png" alt="" />
                <h1>Mystral</h1>
                <p className="p-mono">Panel de vendedor</p>

                <label>
                    Usuario
                    <input value={user} onChange={(e) => setUser(e.target.value)} autoComplete="username" autoFocus required />
                </label>
                <label>
                    Contraseña
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
                </label>

                {error && <p className="p-login-error" role="alert">{error}</p>}

                <button type="submit" className="p-btn-primary" disabled={busy}>
                    {busy ? "Entrando…" : "Entrar"}
                </button>
                <p className="p-login-note">Acceso exclusivo del equipo comercial.</p>
            </form>
        </div>
    );
}
