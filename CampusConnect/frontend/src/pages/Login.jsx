import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth(); const navigate = useNavigate();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(e) { e.preventDefault(); setError(""); setBusy(true); try { await login(email, password); navigate("/jobs"); } catch (e) { setError(e.message); } finally { setBusy(false); } }
  return <main className="auth-layout"><div className="auth-side"><div className="auth-side-inner"><span className="eyebrow">WELCOME BACK</span><h1>Your next opportunity is waiting.</h1><p>Sign in to explore roles and keep your placement journey moving.</p><div className="auth-quote">“Small steps every day lead to big careers.”</div></div></div>
    <section className="auth-card"><span className="eyebrow">STUDENT & ADMIN ACCESS</span><h2>Log in to CampusConnect</h2><p className="muted">Enter your account details to continue.</p>
      <form onSubmit={submit} className="form-stack"><label>Email address<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email"/></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password" required autoComplete="current-password"/></label>
      {error && <div className="alert">{error}</div>}<button className="button button-large full" disabled={busy}>{busy ? "Signing in…" : "Log in securely →"}</button></form>
      <p className="auth-foot">New to CampusConnect? <Link to="/register">Create an account</Link></p>
    </section></main>;
}
