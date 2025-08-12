// App.jsx
import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";
import axios from "axios";

const _hehehe = `
██╗  ██╗███████╗██╗  ██╗███████╗██╗  ██╗███████╗██╗  ██╗███████╗
██║  ██║██╔════╝██║  ██║██╔════╝██║  ██║██╔════╝██║  ██║██╔════╝
███████║█████╗  ███████║█████╗  ███████║█████╗  ███████║█████╗  
██╔══██║██╔══╝  ██╔══██║██╔══╝  ██╔══██║██╔══╝  ██╔══██║██╔══╝  
██║  ██║███████╗██║  ██║███████╗██║  ██║███████╗██║  ██║███████╗
╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝
`
const _main_ascii = `
██╗      █████╗ ██╗   ██╗███████╗██████╗ ███████╗     ██████╗████████╗███████╗
██║     ██╔══██╗╚██╗ ██╔╝██╔════╝██╔══██╗╚════██║    ██╔════╝╚══██╔══╝██╔════╝
██║     ███████║ ╚████╔╝ █████╗  ██████╔╝    ██╔╝    ██║        ██║   █████╗  
██║     ██╔══██║  ╚██╔╝  ██╔══╝  ██╔══██╗   ██╔╝     ██║        ██║   ██╔══╝  
███████╗██║  ██║   ██║   ███████╗██║  ██║   ██║      ╚██████╗   ██║   ██║     
╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝   ╚═╝       ╚═════╝   ╚═╝   ╚═╝     
`
const _main_mobile = `
██╗      █████╗ ██╗   ██╗███████╗██████╗ ███████╗    
██║     ██╔══██╗╚██╗ ██╔╝██╔════╝██╔══██╗╚════██║    
██║     ███████║ ╚████╔╝ █████╗  ██████╔╝    ██╔╝    
██║     ██╔══██║  ╚██╔╝  ██╔══╝  ██╔══██╗   ██╔╝     
███████╗██║  ██║   ██║   ███████╗██║  ██║   ██║      
╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝   ╚═╝      
                                                    
 ██████╗████████╗███████╗
██╔════╝╚══██╔══╝██╔════╝
██║        ██║   █████╗  
██║        ██║   ██╔══╝  
╚██████╗   ██║   ██║     
 ╚═════╝   ╚═╝   ╚═╝     
`
const _login_ascii = `
██╗      ██████╗  ██████╗ ██╗███╗   ██╗    ██████╗ ██╗     ███████╗ █████╗ ███████╗███████╗
██║     ██╔═══██╗██╔════╝ ██║████╗  ██║    ██╔══██╗██║     ██╔════╝██╔══██╗██╔════╝██╔════╝
██║     ██║   ██║██║  ███╗██║██╔██╗ ██║    ██████╔╝██║     █████╗  ███████║███████╗█████╗  
██║     ██║   ██║██║   ██║██║██║╚██╗██║    ██╔═══╝ ██║     ██╔══╝  ██╔══██║╚════██║██╔══╝  
███████╗╚██████╔╝╚██████╔╝██║██║ ╚████║    ██║     ███████╗███████╗██║  ██║███████║███████╗
╚══════╝ ╚═════╝  ╚═════╝ ╚═╝╚═╝  ╚═══╝    ╚═╝     ╚══════╝╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝
`
const _login_mobile = `
██╗      ██████╗  ██████╗ ██╗███╗   ██╗    
██║     ██╔═══██╗██╔════╝ ██║████╗  ██║    
██║     ██║   ██║██║  ███╗██║██╔██╗ ██║    
██║     ██║   ██║██║   ██║██║██║╚██╗██║    
███████╗╚██████╔╝╚██████╔╝██║██║ ╚████║    
╚══════╝ ╚═════╝  ╚═════╝ ╚═╝╚═╝  ╚═══╝    
                                          
██████╗ ██╗     ███████╗ █████╗ ███████╗███████╗
██╔══██╗██║     ██╔════╝██╔══██╗██╔════╝██╔════╝
██████╔╝██║     █████╗  ███████║███████╗█████╗  
██╔═══╝ ██║     ██╔══╝  ██╔══██║╚════██║██╔══╝  
██║     ███████╗███████╗██║  ██║███████║███████╗
╚═╝     ╚══════╝╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝
`
const _register_ascii = `
██████╗ ███████╗ ██████╗ ██╗███████╗████████╗███████╗██████╗     ██████╗ ██╗     ███████╗ █████╗ ███████╗███████╗
██╔══██╗██╔════╝██╔════╝ ██║██╔════╝╚══██╔══╝██╔════╝██╔══██╗    ██╔══██╗██║     ██╔════╝██╔══██╗██╔════╝██╔════╝
██████╔╝█████╗  ██║  ███╗██║███████╗   ██║   █████╗  ██████╔╝    ██████╔╝██║     █████╗  ███████║███████╗█████╗  
██╔══██╗██╔══╝  ██║   ██║██║╚════██║   ██║   ██╔══╝  ██╔══██╗    ██╔═══╝ ██║     ██╔══╝  ██╔══██║╚════██║██╔══╝  
██║  ██║███████╗╚██████╔╝██║███████║   ██║   ███████╗██║  ██║    ██║     ███████╗███████╗██║  ██║███████║███████╗
╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝    ╚═╝     ╚══════╝╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝
`
const _register_mobile = `
██████╗ ███████╗ ██████╗ ██╗███████╗████████╗███████╗██████╗    
██╔══██╗██╔════╝██╔════╝ ██║██╔════╝╚══██╔══╝██╔════╝██╔══██╗   
██████╔╝█████╗  ██║  ███╗██║███████╗   ██║   █████╗  ██████╔╝   
██╔══██╗██╔══╝  ██║   ██║██║╚════██║   ██║   ██╔══╝  ██╔══██╗   
██║  ██║███████╗╚██████╔╝██║███████║   ██║   ███████╗██║  ██║   
╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝   
                                                              
██████╗ ██╗     ███████╗ █████╗ ███████╗███████╗
██╔══██╗██║     ██╔════╝██╔══██╗██╔════╝██╔════╝
██████╔╝██║     █████╗  ███████║███████╗█████╗  
██╔═══╝ ██║     ██╔══╝  ██╔══██║╚════██║██╔══╝  
██║     ███████╗███████╗██║  ██║███████║███████╗
╚═╝     ╚══════╝╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝
`
const _scoreboard = `
███████╗ ██████╗ ██████╗ ██████╗ ███████╗██████╗  ██████╗  █████╗ ██████╗ ██████╗ 
██╔════╝██╔════╝██╔═══██╗██╔══██╗██╔════╝██╔══██╗██╔═══██╗██╔══██╗██╔══██╗██╔══██╗
███████╗██║     ██║   ██║██████╔╝█████╗  ██████╔╝██║   ██║███████║██████╔╝██║  ██║
╚════██║██║     ██║   ██║██╔══██╗██╔══╝  ██╔══██╗██║   ██║██╔══██║██╔══██╗██║  ██║
███████║╚██████╗╚██████╔╝██║  ██║███████╗██████╔╝╚██████╔╝██║  ██║██║  ██║██████╔╝
╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ 
`
const _scoreboard_mobile = `
███████╗ ██████╗ ██████╗ ██████╗ ███████
██╔════╝██╔════╝██╔═══██╗██╔══██╗██╔════
███████╗██║     ██║   ██║██████╔╝█████╗ 
╚════██║██║     ██║   ██║██╔══██╗██╔══╝ 
███████║╚██████╗╚██████╔╝██║  ██║███████
╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════

██████╗  ██████╗  █████╗ ██████╗ ██████╗ 
██╔══██╗██╔═══██╗██╔══██╗██╔══██╗██╔══██╗
██████╔╝██║   ██║███████║██████╔╝██║  ██║
██╔══██╗██║   ██║██╔══██║██╔══██╗██║  ██║
██████╔╝╚██████╔╝██║  ██║██║  ██║██████╔╝
╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ 
`
const _challenges = `
 ██████╗██╗  ██╗ █████╗ ██╗     ██╗     ███████╗███╗   ██╗ ██████╗ ███████╗███████╗
██╔════╝██║  ██║██╔══██╗██║     ██║     ██╔════╝████╗  ██║██╔════╝ ██╔════╝██╔════╝
██║     ███████║███████║██║     ██║     █████╗  ██╔██╗ ██║██║  ███╗█████╗  ███████╗
██║     ██╔══██║██╔══██║██║     ██║     ██╔══╝  ██║╚██╗██║██║   ██║██╔══╝  ╚════██║
╚██████╗██║  ██║██║  ██║███████╗███████╗███████╗██║ ╚████║╚██████╔╝███████╗███████║
 ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝╚═╝  ╚═══╝ ╚═════╝ ╚══════╝╚══════╝
`
const _challenges_mobile = `
 ██████╗██╗  ██╗ █████╗ ██╗     ██╗     
██╔════╝██║  ██║██╔══██╗██║     ██║     
██║     ███████║███████║██║     ██║     
██║     ██╔══██║██╔══██║██║     ██║     
╚██████╗██║  ██║██║  ██║███████╗███████╗
 ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝
                                          
███████╗███╗   ██╗ ██████╗ ███████╗███████╗
██╔════╝████╗  ██║██╔════╝ ██╔════╝██╔════╝
█████╗  ██╔██╗ ██║██║  ███╗█████╗  ███████╗
██╔══╝  ██║╚██╗██║██║   ██║██╔══╝  ╚════██║
███████╗██║ ╚████║╚██████╔╝███████╗███████║
╚══════╝╚═╝  ╚═══╝ ╚═════╝ ╚══════╝╚══════╝
`

const API_BASE = "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE,
  headers: { Accept: "application/json" },
});

api.interceptors.request.use((config) => {
  const t = localStorage.getItem("token");
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

function parseJwt(t) {
  try {
    const b = t.split(".")[1];
    return JSON.parse(
      decodeURIComponent(
        atob(b)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      )
    );
  } catch {
    return null;
  }
}

function isAuthed() {
  return !!localStorage.getItem("token");
}
function isAdmin() {
  const t = localStorage.getItem("token");
  if (!t) return false;
  const p = parseJwt(t);
  return !!p?.is_admin;
}

function RequireAuth({ children }) {
  if (!isAuthed()) return <Navigate to="/login" replace />;
  return children;
}
function RequireAdmin({ children }) {
  if (!isAuthed()) return <Navigate to="/login" replace />;
  if (!isAdmin()) return <Navigate to="/" replace />;
  return children;
}

function useIsMobile(breakpoint = 768) {
  const get = () => (typeof window !== "undefined" ? window.innerWidth <= breakpoint : false);
  const [isMobile, setIsMobile] = useState(get());

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = (e) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, [breakpoint]);

  return isMobile;
}

const buttonStyles = {
  padding: "12px 24px",
  fontSize: "16px",
  fontWeight: "600",
  borderRadius: "8px",
  border: "2px solid #555",
  backgroundColor: "#222",
  color: "#fff",
  cursor: "pointer",
  transition: "all 0.3s ease",
  minWidth: "120px",
};

const inputStyles = {
  padding: "12px 16px",
  fontSize: "16px",
  borderRadius: "8px",
  border: "2px solid #555",
  backgroundColor: "#222",
  color: "#fff",
  outline: "none",
  transition: "border-color 0.3s ease",
};

function Main() {
  const nav = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div style={{ color: "#fff", textAlign: "center", padding: 40 }}>
      <pre style={{ color: "chartreuse", fontSize: "14px" }}>
        {isMobile ? _main_mobile : _main_ascii}
      </pre>
      <div style={{ 
        display: "flex", 
        gap: 16, 
        justifyContent: "center", 
        marginTop: 20, 
        flexWrap: "wrap" 
      }}>
        <button 
          style={{...buttonStyles, borderColor: "#4CAF50"}} 
          onMouseOver={(e) => e.target.style.backgroundColor = "#4CAF50"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#222"}
          onClick={() => nav("/login")}
        >
          Login
        </button>
        <button 
          style={{...buttonStyles, borderColor: "#2196F3"}} 
          onMouseOver={(e) => e.target.style.backgroundColor = "#2196F3"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#222"}
          onClick={() => nav("/register")}
        >
          Register
        </button>
        <button 
          style={{...buttonStyles, borderColor: "#FF9800"}} 
          onMouseOver={(e) => e.target.style.backgroundColor = "#FF9800"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#222"}
          onClick={() => nav("/scoreboard")}
        >
          Scoreboard
        </button>
        <button 
          style={{...buttonStyles, borderColor: "#E91E63"}} 
          onMouseOver={(e) => e.target.style.backgroundColor = "#E91E63"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#222"}
          onClick={() => nav("/challenges")}
        >
          Challenges
        </button>
        {isAdmin() && (
          <button 
            style={{...buttonStyles, borderColor: "#9C27B0"}} 
            onMouseOver={(e) => e.target.style.backgroundColor = "#9C27B0"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#222"}
            onClick={() => nav("/admin-panel")}
          >
            Admin Panel
          </button>
        )}
      </div>
    </div>
  );
}

function Login() {
  const isMobile = useIsMobile();
  async function handleLogin(e) {
    e.preventDefault();
    const f = e.currentTarget;
    const username = f.username.value.trim();
    const password = f.password.value;

    try {
      const { data } = await api.post("/auth/login", { username, password });
      const tok = data.access_token || data.token || data?.accessToken;
      if (!tok) throw new Error("no token");
      localStorage.setItem("token", tok);
      alert("로그인 성공");
      window.location.href = "/";
    } catch {
      alert("로그인 실패");
    }
  }

  return (
    <div style={{ color: "#fff", textAlign: "center", padding: 40 }}>
      <pre style={{ color: "aqua", fontSize: "14px" }}>
        {isMobile ? _login_mobile : _login_ascii}
      </pre>
      <form onSubmit={handleLogin} style={{ display: "inline-flex", flexDirection: "column", gap: 16 }}>
        <input 
          name="username" 
          placeholder="Username" 
          style={inputStyles}
          onFocus={(e) => e.target.style.borderColor = "#4CAF50"}
          onBlur={(e) => e.target.style.borderColor = "#555"}
        />
        <input 
          name="password" 
          placeholder="Password" 
          type="password" 
          style={inputStyles}
          onFocus={(e) => e.target.style.borderColor = "#4CAF50"}
          onBlur={(e) => e.target.style.borderColor = "#555"}
        />
        <button 
          type="submit" 
          style={{...buttonStyles, borderColor: "#4CAF50", backgroundColor: "#4CAF50"}}
          onMouseOver={(e) => e.target.style.backgroundColor = "#45a049"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#4CAF50"}
        >
          LOGIN
        </button>
      </form>
    </div>
  );
}

function Register() {
  const isMobile = useIsMobile();
  async function handleRegister(e) {
    e.preventDefault();
    const f = e.currentTarget;
    const username = f.username.value.trim();
    const password = f.password.value;

    try {
      const { data } = await api.post("/auth/register", { username, password });
      const tok = data.access_token || data.token || data?.accessToken;
      if (tok) localStorage.setItem("token", tok); 
      alert("회원가입 성공");
      window.location.href = "/login";
    } catch {
      alert("회원가입 실패");
    }
  }

  return (
    <div style={{ color: "#fff", textAlign: "center", padding: 40 }}>
      <pre style={{ color: "yellow", fontSize: "14px" }}>
        {isMobile ? _register_mobile : _register_ascii}
      </pre>
      <form onSubmit={handleRegister} style={{ display: "inline-flex", flexDirection: "column", gap: 16 }}>
        <input 
          name="username" 
          placeholder="Username" 
          style={inputStyles}
          onFocus={(e) => e.target.style.borderColor = "#2196F3"}
          onBlur={(e) => e.target.style.borderColor = "#555"}
        />
        <input 
          name="password" 
          placeholder="Password" 
          type="password" 
          style={inputStyles}
          onFocus={(e) => e.target.style.borderColor = "#2196F3"}
          onBlur={(e) => e.target.style.borderColor = "#555"}
        />
        <button 
          type="submit" 
          style={{...buttonStyles, borderColor: "#2196F3", backgroundColor: "#2196F3"}}
          onMouseOver={(e) => e.target.style.backgroundColor = "#1976D2"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#2196F3"}
        >
          REGISTER
        </button>
      </form>
    </div>
  );
}

function Scoreboard() {
  const isMobile = useIsMobile();
  const [rows, setRows] = useState([]);
  const [names, scores] = useMemo(
    () => [rows.map((r) => r.username), rows.map((r) => r.score)],
    [rows]
  );

  useEffect(() => {
    let alive = true;
    const tick = async () => {
      try {
        const { data } = await api.get("/scoreboard");
        const sorted = Array.isArray(data) ? [...data].sort((a, b) => b.score - a.score) : [];
        if (alive) setRows(sorted);
      } catch {}
    };
    tick();
    const id = setInterval(tick, 3000);
    return () => { alive = false; clearInterval(id); };
  }, []);

  const options = {
    chart: { id: "scoreboard", parentHeightOffset: 0 },
    grid: { padding: { top: 0, right: 8, left: 8, bottom: 0 } },
    dataLabels: { enabled: false },
    legend: { show: false },
    xaxis: {
      categories: names,
      labels: { rotate: -30, style: { colors: "#FFFFFF", fontSize: isMobile ? "10px" : "12px" } },
      tickAmount: Math.min(names.length, isMobile ? 5 : 8)
    },
    yaxis: { labels: { style: { colors: "#FFFFFF", fontSize: isMobile ? "10px" : "12px" } } },
    title: { text: "Scoreboard", style: { color: "#FFFFFF", fontSize: isMobile ? "16px" : "20px" } },
    tooltip: { theme: "dark" }
  };
  const series = [{ name: "score", data: scores }];

  return (
    <div style={{ color: "#fff", textAlign: "center", padding: 20 }}>
      
      <pre className="scoreboard-header" style={{ display: "flex", justifyContent: "center" }}>
        <span className="rainbow scoreboard-ascii" style={{ whiteSpace: "pre" }}>
          {isMobile ? _scoreboard_mobile : _scoreboard}
        </span>
      </pre>

      <div className="scoreboard-wrap" style={{marginBottom: 30}}>
        <h1 style={{color: "#FFD700", fontSize: "24px", margin: "10px 0"}}>
          {rows[0] ? <>🥇 1등: {rows[0].username} [{rows[0].score}점]</> : "데이터 없음"}
        </h1>
        <h1 style={{color: "#C0C0C0", fontSize: "20px", margin: "8px 0"}}>
          {rows[1] ? <>🥈 2등: {rows[1].username} [{rows[1].score}점]</> : null}
        </h1>
        <h1 style={{color: "#CD7F32", fontSize: "18px", margin: "6px 0"}}>
          {rows[2] ? <>🥉 3등: {rows[2].username} [{rows[2].score}점]</> : null}
        </h1>
      </div>

      {/* 4등 이후 전체 순위 표시 */}
      {rows.length > 3 && (
        <div style={{marginBottom: 30}}>
          <h3 style={{color: "#888", marginBottom: 15}}>전체 순위</h3>
          <div style={{
            display: "grid", 
            gap: "8px", 
            maxWidth: "600px", 
            margin: "0 auto",
            textAlign: "left"
          }}>
            {rows.map((user, index) => (
              <div key={user.username || index} style={{
                padding: "10px 15px",
                backgroundColor: index < 3 ? "#333" : "#222",
                borderRadius: "6px",
                border: index < 3 ? "2px solid #555" : "1px solid #444",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <span style={{fontWeight: index < 3 ? "bold" : "normal"}}>
                  {index + 1}등. {user.username}
                </span>
                <span style={{color: "#4CAF50", fontWeight: "bold"}}>
                  {user.score}점
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 차트 정확히 가운데 */}
      <div className="chart-wrap" style={{ display: "flex", justifyContent: "center" }}>
        <div className="chart-container" style={{ width: "100%", maxWidth: 1000 }}>
          <Chart
            options={options}
            series={series}
            type="bar"
            width="100%"               // 컨테이너 기준 100%
            height={isMobile ? 280 : 480}
          />
        </div>
      </div>
    </div>
  );
}

function Challenges() {
  const isMobile = useIsMobile();
  const [list, setList] = useState([]);
  const [openStates, setOpenStates] = useState({}); // 개별 상태 관리

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await api.get("/challenges");
        if (!alive) return;
        // 백엔드 응답에 맞게 ID 추출 - title을 기준으로 고유 키 생성
        const normalized = Array.isArray(data)
          ? data.map((it, idx) => ({
              ...it,
              __uniqueId: it.title + "_" + idx, // title + index로 고유 키 생성
            }))
          : [];
        setList(normalized);
      } catch {
        setList([]);
      }
    })();
    return () => { alive = false; };
  }, []);

  function toggleDetail(uniqueId) {
    setOpenStates(prev => ({
      ...prev,
      [uniqueId]: !prev[uniqueId]
    }));
  }

  return (
    <div style={{ color: "#fff", padding: 20 }}>
      
      <pre className="challenges-header" style={{ display: "flex", justifyContent: "center" }}>
        <span className="rainbow2 challenges-ascii" style={{ whiteSpace: "pre" }}>
          {isMobile ? _challenges_mobile : _challenges}
        </span>
      </pre>

      
      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(350px, 1fr))",
          maxWidth: "1200px",
          margin: "0 auto"
        }}
      >
        {list.map((ch) => (
          <div
            key={ch.__uniqueId}
            style={{
              border: "2px solid #555",
              borderRadius: 12,
              padding: 16,
              backgroundColor: "#111",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 8px rgba(0,0,0,0.3)"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                marginBottom: 12
              }}
            >
              <div>
                <div style={{fontSize: "18px", fontWeight: "bold", color: "#4CAF50"}}>
                  {ch.title}
                </div>
                <div style={{fontSize: "14px", color: "#888", marginTop: 4}}>
                  [{ch.field}] • {ch.points}점
                </div>
              </div>
              <button
                onClick={() => toggleDetail(ch.__uniqueId)}
                style={{
                  ...buttonStyles,
                  borderColor: "#FF9800",
                  minWidth: "100px",
                  fontSize: "14px",
                  padding: "8px 16px"
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#FF9800"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#222"}
              >
                {openStates[ch.__uniqueId] ? "Hide" : "Detail"}
              </button>
            </div>
            {openStates[ch.__uniqueId] && <ChallengeCard ch={ch} />}
            {console.log(ch)}
          </div>
        ))}
      </div>
    </div>
  );
}

function ChallengeCard({ ch }) {
  const [msg, setMsg] = useState("");
  const [lastSubmission, setLastSubmission] = useState({ challengeId: null, flag: null });

  async function handleSubmitFlag(e) {
    e.preventDefault();
    const flag = e.currentTarget.flag.value.trim();
    if (!flag) {
      setMsg("플래그를 입력해주세요");
      return;
    }

    let challengeId = ch?.id;

    // 같은 문제 + 같은 플래그 중복 제출 방지
    if (lastSubmission.challengeId === challengeId && lastSubmission.flag === flag) {
      setMsg("이미 제출함");
      return;
    }

    if (!challengeId) {
      try {
        const { data: publicList } = await api.get("/challenges");
        const matched = publicList.find(c => c.title === ch.title);
        if (matched) {
          const { data: adminList } = await api.get("/admin/challenges", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          });
          const adminMatched = adminList.find(a => a.title === ch.title);
          if (adminMatched) challengeId = adminMatched.id;
        }
      } catch {
        setMsg("Challenge ID를 찾을 수 없습니다");
        return;
      }
    }

    if (!challengeId) {
      setMsg("Challenge ID를 찾을 수 없습니다");
      return;
    }

    try {
      const { data } = await api.post(`/challenges/${challengeId}/submit`, { flag });
      console.log(data);
      setMsg(data?.message || "제출됨");

      setLastSubmission({ challengeId, flag });

      if (data?.success) e.currentTarget.flag.value = "";
    } catch (err) {
    const s = err?.response?.status;
    const errMsg = err?.response?.data?.detail || err?.message || "";

    if (errMsg.includes("UNIQUE constraint failed")) {
      setMsg("이미 제출함");
    }
    
    else if (s === 400 || s === 422) {
      setMsg("틀린 플래그입니다");
    }
    
    else if (s === 404) {
      setMsg("문제를 찾을 수 없습니다");
    }
    
    else if (s === 401) {
      setMsg("로그인이 필요합니다");
    }
    
    else {
      setMsg(errMsg || "제출 실패");
    }

      // 실패 시에도 마지막 시도 기록
      setLastSubmission({ challengeId, flag });
    }
  }



  async function handleDownload() {
    let challengeId = null;
    
    if (ch.id) {
      challengeId = ch.id;
    } else {
      try {
        const { data: allChallenges } = await api.get("/admin/challenges");
        const matchedChallenge = allChallenges.find(c => c.title === ch.title);
        if (matchedChallenge) {
          challengeId = matchedChallenge.id;
        }
      } catch {
        alert("Challenge ID를 찾을 수 없습니다");
        return;
      }
    }

    if (!challengeId) {
      alert("Challenge ID를 찾을 수 없습니다");
      return;
    }

    try {
      const res = await api.get(`/challenges/${challengeId}/download`, { responseType: "blob" });
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = (ch.title || "challenge") + ".bin";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      alert("다운로드 실패 (로그인 필요하거나 파일 없음)");
    }
  }

  return (
    <div style={{ 
      marginTop: 15, 
      padding: 15, 
      backgroundColor: "#222", 
      borderRadius: 8,
      border: "1px solid #444"
    }}>
      <div style={{ 
        marginBottom: 15, 
        lineHeight: 1.6,
        color: "#ccc",
        whiteSpace: "pre-wrap"
      }}>
        {ch.content}
      </div>
      
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 15 }}>
        <button 
          onClick={handleDownload}
          style={{
            ...buttonStyles,
            borderColor: "#2196F3",
            fontSize: "14px",
            padding: "8px 16px",
            minWidth: "auto"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#2196F3"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#222"}
        >
          📁 파일 다운로드
        </button>
        {ch.file && /^https?:\/\//i.test(ch.file) && (
          <a 
            href={ch.file} 
            target="_blank" 
            rel="noreferrer"
            style={{
              color: "#4CAF50",
              textDecoration: "none",
              padding: "8px 16px",
              border: "1px solid #4CAF50",
              borderRadius: "6px",
              fontSize: "14px"
            }}
          >
            🔗 외부 파일 링크
          </a>
        )}
      </div>
      
      <form onSubmit={handleSubmitFlag} style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <input 
          name="flag" 
          placeholder="codegate2025{...}" 
          style={{
            ...inputStyles,
            flex: 1,
            fontSize: "14px",
            padding: "10px 14px"
          }}
          onFocus={(e) => e.target.style.borderColor = "#E91E63"}
          onBlur={(e) => e.target.style.borderColor = "#555"}
        />
        <button 
          type="submit"
          style={{
            ...buttonStyles,
            borderColor: "#E91E63",
            backgroundColor: "#E91E63",
            fontSize: "14px",
            padding: "10px 20px",
            minWidth: "auto"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#C2185B"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#E91E63"}
        >
          Submit
        </button>
      </form>
      
      {msg && (
        <div style={{ 
          marginTop: 12, 
          padding: "8px 12px",
          backgroundColor: msg.includes("성공") || msg.includes("Correct") ? "#4CAF50" : "#f44336",
          borderRadius: 6,
          fontSize: "14px"
        }}>
          {msg}
        </div>
      )}
    </div>
  );
}

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [form, setForm] = useState({
    title: "",
    content: "",
    field: "web",
    flag: "",
    points: 100,
    is_visible: true,
    scoring_type: "static",
    initial_value: "",
    decay_function: "",
    decay_value: "",
    minimum_value: "",
    fileObj: null
  });

  const [edit, setEdit] = useState({});
  const setUE = (id, patch) => setEdit(p => ({ ...p, [id]: { ...(p[id]||{}), ...patch } }));

  async function loadUsers() {
    try {
      const { data } = await api.get("/admin/users");
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setUsers([]);
    }
  }

  async function loadChallenges() {
    try {
      const { data } = await api.get("/admin/challenges");
      setChallenges(Array.isArray(data) ? data : []);
    } catch {
      setChallenges([]);
    }
  }

  useEffect(() => {
    loadUsers();
    loadChallenges();
  }, []);

  async function createChallenge(e) {
    e.preventDefault();

    const fd = new FormData();
    fd.append("title", form.title.trim());
    fd.append("content", form.content.trim());
    fd.append("points", String(form.points ?? 100));
    fd.append("field", form.field);
    fd.append("flag", form.flag);
    fd.append("is_visible", form.is_visible ? "true" : "false");
    fd.append("scoring_type", form.scoring_type || "static"); 

    if (form.initial_value !== "" && form.initial_value != null)
      fd.append("initial_value", String(form.initial_value));
    if (form.decay_function)
      fd.append("decay_function", form.decay_function); 
    if (form.decay_value !== "" && form.decay_value != null)
      fd.append("decay_value", String(form.decay_value));
    if (form.minimum_value !== "" && form.minimum_value != null)
      fd.append("minimum_value", String(form.minimum_value));

    if (form.fileObj instanceof File) {
      fd.append("file", form.fileObj, form.fileObj.name);
    }

    try {
      await api.post("/admin/challenges", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Challenge created");
      setForm({
        title: "",
        content: "",
        field: "web",
        flag: "",
        points: 100,
        is_visible: true,
        scoring_type: "static",
        initial_value: "",
        decay_function: "",
        decay_value: "",
        minimum_value: "",
        fileObj: null
      });
      loadChallenges();
    } catch (err) {
      console.error(err?.response?.data || err);
      alert("Create failed: " + (err?.response?.data?.detail || "Unknown error"));
    }
  }

  async function updateUser(id) {
    const e = edit[id] || {};
    const params = {};
    if (typeof e.is_admin === "boolean") params.is_admin = e.is_admin;
    if (typeof e.is_visible === "boolean") params.is_visible = e.is_visible;
    if (e.new_password && e.new_password.trim()) params.new_password = e.new_password;
    if (typeof e.score === "number") params.score = e.score;

    if (Object.keys(params).length === 0) return alert("변경사항 없음");

    try {
      await api.patch(`/admin/users/${id}`, null, {params});
      await loadUsers();
      setUE(id, { new_password: "" });
      alert("User updated");
    } catch (err) {
      console.error(err?.response?.data || err);
      alert("Update failed: " + (err?.response?.data?.detail || "Unknown error"));
    }
  }

  return (
    <div style={{ color: "#fff", padding: 20, maxWidth: "1400px", margin: "0 auto" }}>
      <h2 style={{textAlign: "center", marginBottom: 30, fontSize: "28px"}}>🛠️ Admin Panel</h2>

      <div style={{display: "grid", gap: 40, gridTemplateColumns: "1fr 1fr"}}>
        
        {/* Challenge Creation */}
        <div>
          <h3 style={{ marginBottom: 20, color: "#4CAF50" }}>📝 Create Challenge</h3>
          <form onSubmit={createChallenge} style={{ display: "grid", gap: 12 }}>
            <input 
              placeholder="Challenge Title" 
              value={form.title} 
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              style={inputStyles}
              required
            />
            <textarea 
              placeholder="Challenge Description" 
              value={form.content} 
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              style={{...inputStyles, minHeight: "80px", resize: "vertical"}}
              required
            />
            
            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12}}>
              <select 
                value={form.field} 
                onChange={(e) => setForm({ ...form, field: e.target.value })}
                style={inputStyles}
              >
                <option value="web">Web</option>
                <option value="pwn">Pwn</option>
                <option value="rev">Reverse</option>
                <option value="misc">Misc</option>
                <option value="crypto">Crypto</option>
              </select>
              
              <input 
                type="number" 
                placeholder="Points" 
                value={form.points} 
                onChange={(e) => setForm({ ...form, points: Number(e.target.value) })}
                style={inputStyles}
              />
            </div>
            
            <input 
              placeholder="Flag (e.g., codegate2025{...})" 
              value={form.flag} 
              onChange={(e) => setForm({ ...form, flag: e.target.value })}
              style={inputStyles}
              required
            />

            <select 
              value={form.scoring_type} 
              onChange={(e) => setForm({ ...form, scoring_type: e.target.value })}
              style={inputStyles}
            >
              <option value="static">Static Scoring</option>
              <option value="dynamic">Dynamic Scoring</option>
            </select>

            {form.scoring_type === "dynamic" && (
              <>
                <input 
                  type="number" 
                  placeholder="Initial Value" 
                  value={form.initial_value} 
                  onChange={(e) => setForm({ ...form, initial_value: e.target.value })}
                  style={inputStyles}
                />
                <input 
                  placeholder="Decay Function (linear/logarithmic)" 
                  value={form.decay_function} 
                  onChange={(e) => setForm({ ...form, decay_function: e.target.value })}
                  style={inputStyles}
                />
                <input 
                  type="number" 
                  step="0.01" 
                  placeholder="Decay Value" 
                  value={form.decay_value} 
                  onChange={(e) => setForm({ ...form, decay_value: e.target.value })}
                  style={inputStyles}
                />
                <input 
                  type="number" 
                  placeholder="Minimum Value" 
                  value={form.minimum_value} 
                  onChange={(e) => setForm({ ...form, minimum_value: e.target.value })}
                  style={inputStyles}
                />
              </>
            )}

            <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#ccc" }}>
              <input 
                type="checkbox" 
                checked={form.is_visible} 
                onChange={(e) => setForm({ ...form, is_visible: e.target.checked })}
              />
              Visible to Users
            </label>

            <input 
              type="file" 
              onChange={(e) => setForm({ ...form, fileObj: e.target.files?.[0] || null })}
              style={{...inputStyles, padding: "8px"}}
            />
            
            <button 
              type="submit"
              style={{
                ...buttonStyles,
                borderColor: "#4CAF50",
                backgroundColor: "#4CAF50",
                marginTop: 8
              }}
            >
              Create Challenge
            </button>
          </form>
        </div>

        {/* User Management */}
        <div>
          <h3 style={{ marginBottom: 20, color: "#2196F3" }}>👥 User Management</h3>
          <div style={{ display: "grid", gap: 12, maxHeight: "600px", overflowY: "auto" }}>
            {users.map((u) => {
              const e = edit[u.id] || {};
              return (
                <div key={u.id} style={{ 
                  border: "1px solid #555", 
                  borderRadius: 8, 
                  padding: 12,
                  backgroundColor: "#222"
                }}>
                  <div style={{marginBottom: 8}}>
                    <strong>#{u.id}</strong> {u.username} 
                    {u.is_admin ? <span style={{color: "#E91E63"}}> (Admin)</span> : ""}
                    <br />
                    <span style={{color: "#4CAF50"}}>Score: {u.score}</span> • 
                    <span style={{color: u.is_visible ? "#4CAF50" : "#f44336"}}>
                      {u.is_visible ? "Visible" : "Hidden"}
                    </span>
                  </div>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, alignItems: "center" }}>
                    <label style={{fontSize: "14px"}}>
                      <input
                        type="checkbox"
                        checked={e.is_admin ?? u.is_admin}
                        onChange={(ev) => setUE(u.id, { is_admin: ev.target.checked })}
                      />{" "}
                      Admin
                    </label>
                    
                    <label style={{fontSize: "14px"}}>
                      <input
                        type="checkbox"
                        checked={e.is_visible ?? u.is_visible}
                        onChange={(ev) => setUE(u.id, { is_visible: ev.target.checked })}
                      />{" "}
                      Visible
                    </label>
                    
                    <input
                      placeholder="New Password"
                      type="password"
                      value={e.new_password || ""}
                      onChange={(ev) => setUE(u.id, { new_password: ev.target.value })}
                      style={{...inputStyles, fontSize: "12px", padding: "6px 8px"}}
                    />
                  </div>
                  
                  <button 
                    onClick={() => updateUser(u.id)}
                    style={{
                      ...buttonStyles,
                      borderColor: "#FF9800",
                      fontSize: "12px",
                      padding: "6px 12px",
                      marginTop: 8,
                      minWidth: "auto"
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Challenge List */}
      {challenges.length > 0 && (
        <div style={{marginTop: 40}}>
          <h3 style={{ marginBottom: 20, color: "#FF9800" }}>🎯 Current Challenges</h3>
          <div style={{
            display: "grid", 
            gap: 12,
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))"
          }}>
            {challenges.map((ch) => (
              <div key={ch.id} style={{
                border: "1px solid #555",
                borderRadius: 8,
                padding: 12,
                backgroundColor: "#222"
              }}>
                <div style={{fontWeight: "bold", marginBottom: 4}}>
                  {ch.title}
                </div>
                <div style={{fontSize: "12px", color: "#888"}}>
                  [{ch.field}] • {ch.points}pts • Solves: {ch.solves || 0} • 
                  <span style={{color: ch.is_visible ? "#4CAF50" : "#f44336"}}>
                    {ch.is_visible ? " Visible" : " Hidden"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ color: "#fff", textAlign: "center", padding: 40 }}>
      <h2 style={{fontSize: "48px", marginBottom: 20}}>404</h2>
      <div style={{fontSize: "18px", marginBottom: 30}}>Page not found</div>
      <img
        src="https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_16x9.jpg?w=1200"
        alt="고양이"
        style={{ maxWidth: "80%", marginTop: 20, borderRadius: 12 }}
      />
      <pre style={{ marginTop: 16, color: "chartreuse" }}>{_hehehe}</pre>
    </div>
  );
}

export default function App() {
  return (
    <div style={{ 
      background: "linear-gradient(135deg, #000 0%, #111 100%)", 
      minHeight: "100vh" 
    }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/scoreboard" element={<Scoreboard />} />
          <Route path="/challenges" element={<RequireAuth><Challenges /></RequireAuth>} />
          <Route path="/admin-panel" element={<RequireAdmin><AdminPanel /></RequireAdmin>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}