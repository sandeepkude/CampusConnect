import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth(); const navigate = useNavigate();
  const [form, setForm] = useState({ name:"", email:"", password:"", department:"", graduationYear:"" });
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  function change(e) { setForm({ ...form, [e.target.name]: e.target.value }); }
  async function submit(e) { e.preventDefault(); setError(""); setBusy(true); try { await register({ ...form, graduationYear: form.graduationYear ? Number(form.graduationYear) : null }); navigate("/jobs"); } catch (e) { setError(e.message); } finally { setBusy(false); } }
  return <main className="auth-layout"><div className="auth-side"><div className="auth-side-inner"><span className="eyebrow">YOUR FUTURE, CONNECTED</span><h1>Build your path from campus to career.</h1><p>Create your student profile to discover roles and track your applications.</p></div></div>
    <section className="auth-card"><span className="eyebrow">JOIN THE COMMUNITY</span><h2>Create your account</h2><p className="muted">A few details to get you started.</p>
      <form onSubmit={submit} className="form-stack"><label>Full name<input name="name" value={form.name} onChange={change} placeholder="Your full name" required maxLength="80"/></label><label>Email address<input name="email" type="email" value={form.email} onChange={change} placeholder="you@example.com" required/></label><label>Password<input name="password" type="password" value={form.password} onChange={change} placeholder="At least 8 characters" required minLength="8" autoComplete="new-password"/></label><div className="form-row"><label>Department<input name="department" value={form.department} onChange={change} placeholder="e.g. CSE / IoT"/></label><label>Graduation year<input name="graduationYear" type="number" min="2020" max="2040" value={form.graduationYear} onChange={change} placeholder="2027"/></label></div>
      {error && <div className="alert">{error}</div>}<button className="button button-large full" disabled={busy}>{busy ? "Creating account…" : "Create student account →"}</button></form>
      <p className="auth-foot">Already registered? <Link to="/login">Log in</Link></p>
    </section></main>;
}
