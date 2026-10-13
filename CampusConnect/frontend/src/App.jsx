import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import MyApplications from "./pages/MyApplications";
import Admin from "./pages/Admin";
import { AuthProvider, useAuth } from "./context/AuthContext";

function Guard({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/jobs" replace />;
  return children;
}
function Layout() {
  return <><NavBar/><Routes><Route path="/" element={<Home/>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/><Route path="/jobs" element={<Jobs/>}/><Route path="/applications" element={<Guard roles={["student"]}><MyApplications/></Guard>}/><Route path="/admin" element={<Guard roles={["admin"]}><Admin/></Guard>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes><footer className="footer"><div className="footer-brand">CampusConnect<span> · </span>Connecting students with opportunities.</div><div>Built as a full-stack placement portal project</div></footer></>;
}
export default function App() { return <BrowserRouter><AuthProvider><Layout/></AuthProvider></BrowserRouter>; }
