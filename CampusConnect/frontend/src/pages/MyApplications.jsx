import { useEffect, useState } from "react";
import { api } from "../api";

export default function MyApplications() {
  const [applications, setApplications] = useState([]); const [error, setError] = useState(""); const [loading, setLoading] = useState(true);
  useEffect(() => { api("/applications/mine").then(d=>setApplications(d.applications)).catch(e=>setError(e.message)).finally(()=>setLoading(false)); }, []);
  return <main className="page-wrap"><div className="page-intro"><div><span className="eyebrow">YOUR CAREER ACTIVITY</span><h1>My applications.</h1><p>Keep track of the opportunities you have applied for.</p></div><div className="result-count"><b>{applications.length}</b><span>submitted</span></div></div>
    {error && <div className="alert">{error}</div>}{loading ? <div className="empty-state">Loading applications…</div> : applications.length === 0 ? <div className="empty-state"><h3>Your journey starts here</h3><p>You haven't applied to any roles yet. Explore opportunities and submit your first application.</p></div> :
    <div className="application-list">{applications.map(a=><article className="application-row" key={a._id}><div className="company-icon blue">{(a.job?.company||"C").slice(0,1)}</div><div className="application-info"><h3>{a.job?.title || "Position removed"}</h3><p>{a.job?.company || "—"} · {a.job?.location || "—"}</p><small>Applied on {new Date(a.createdAt).toLocaleDateString()} · Contact: {a.phone || "—"}</small><small>Resume: {a.resumeOriginalName || "Not attached"}</small>{a.coverLetter && <small className="application-cover-letter">Cover letter: {a.coverLetter}</small>}</div><div className="application-status"><span className={`status status-${a.status.toLowerCase().replaceAll(" ","-")}`}>{a.status}</span><small>Last updated {new Date(a.updatedAt || a.createdAt).toLocaleDateString()}</small></div></article>)}</div>}
  </main>;
}
