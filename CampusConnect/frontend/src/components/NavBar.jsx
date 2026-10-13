import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  function signOut() { logout(); navigate("/"); }
  return <header className="topbar">
    <Link className="brand" to="/"><span className="brand-mark">CC</span><span>CampusConnect<small>Placement Portal</small></span></Link>
    <nav>
      <NavLink to="/jobs">Explore Jobs</NavLink>
      {user?.role === "student" && <NavLink to="/applications">My Applications</NavLink>}
      {user?.role === "admin" && <NavLink to="/admin">Admin Panel</NavLink>}
    </nav>
    <div className="nav-user">{user ? <><span className="welcome">Hi, {user.name.split(" ")[0]}</span><button className="button button-light small" onClick={signOut}>Log out</button></> :
      <><Link className="nav-login" to="/login">Log in</Link><Link className="button small" to="/register">Get started</Link></>}</div>
  </header>;
}
