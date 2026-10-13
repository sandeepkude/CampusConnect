import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  return <main>
    <section className="hero">
      <div className="hero-copy">
        <div className="eyebrow"><span className="pulse"></span> YOUR CAREER STARTS HERE</div>
        <h1>From campus<br/>to <span>career.</span></h1>
        <p className="hero-lead">Discover placement opportunities, track your applications, and take the next step toward your future.</p>
        <div className="hero-actions"><Link className="button button-large" to="/jobs">Explore opportunities <span>↗</span></Link>{!user && <Link className="button button-outline button-large" to="/register">Create student account</Link>}</div>
        <div className="hero-note"><span className="note-icon">✓</span> One place for your placement journey</div>
      </div>
      <div className="hero-art" aria-label="CampusConnect dashboard preview">
        <div className="art-orbit orbit-one"></div><div className="art-orbit orbit-two"></div>
        <div className="float-card card-top"><span className="company-icon purple">✦</span><span><b>New opportunity</b><small>Graduate Software Engineer</small></span><span className="tiny-dot"></span></div>
        <div className="dashboard-card">
          <div className="dash-head"><span className="dash-logo">CC</span><span>Career dashboard</span><span className="dash-menu">•••</span></div>
          <div className="dash-welcome">Your next chapter<br/><b>starts with one click.</b></div>
          <div className="dash-stats"><div><small>Open roles</small><b>12<span>+</span></b></div><div><small>Applications</small><b>04</b></div></div>
          <div className="dash-job"><span className="company-icon blue">N</span><span><b>Software Engineer</b><small>NovaTech · Hyderabad</small></span><span className="arrow-round">↗</span></div>
          <div className="dash-job"><span className="company-icon orange">B</span><span><b>Frontend Intern</b><small>BrightLabs · Hybrid</small></span><span className="arrow-round">↗</span></div>
        </div>
        <div className="float-card card-bottom"><span className="success-icon">✓</span><span><b>Application tracked</b><small>Your journey, organized.</small></span></div>
      </div>
    </section>
    <section className="features-section">
      <div className="section-heading"><span className="eyebrow">MADE FOR STUDENTS</span><h2>Your placement journey, simplified.</h2><p>Tools that help you move from searching to applying with confidence.</p></div>
      <div className="feature-grid">
        <article className="feature"><span className="feature-icon blue-bg">⌕</span><h3>Find opportunities</h3><p>Explore openings and filter roles by title, company, location, and job type.</p></article>
        <article className="feature"><span className="feature-icon violet-bg">↗</span><h3>Apply with confidence</h3><p>Submit applications and keep your placement activity in one organized place.</p></article>
        <article className="feature"><span className="feature-icon green-bg">◷</span><h3>Track your progress</h3><p>Review application statuses and know where each opportunity stands.</p></article>
      </div>
    </section>
  </main>;
}
