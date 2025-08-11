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
    // 즉시 동기화
    setIsMobile(mq.matches);
    // 브라우저별 이벤트 등록
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, [breakpoint]);

  return isMobile;
}

function Main() {
  const nav = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div style={{ color: "#fff", textAlign: "center", padding: 40 }}>
      <pre style={{ color: "chartreuse", fontSize: "14px" }}>
        {isMobile ? _main_mobile : _main_ascii}
      </pre>
      <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 20, flexWrap: "wrap" }}>
        <button onClick={() => nav("/login")}>Login</button>
        <button onClick={() => nav("/register")}>Register</button>
        <button onClick={() => nav("/scoreboard")}>Scoreboard</button>
        <button onClick={() => nav("/challenges")}>Challenges</button>
        {isAdmin() && <button onClick={() => nav("/admin-panel")}>Admin Panel</button>}
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
      <form onSubmit={handleLogin} style={{ display: "inline-flex", flexDirection: "column", gap: 12 }}>
        <input name="username" placeholder="username" />
        <input name="password" placeholder="password" type="password" />
        <button type="submit">LOGIN</button>
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
      <form onSubmit={handleRegister} style={{ display: "inline-flex", flexDirection: "column", gap: 12 }}>
        <input name="username" placeholder="username" />
        <input name="password" placeholder="password" type="password" />
        <button type="submit">REGISTER</button>
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

      <div className="scoreboard-wrap">
        <h1 className="rank rank-1">
          {rows[0] ? <>1등 : {rows[0].username} [{rows[0].score}] 🥇</> : "데이터 없음"}
        </h1>
        <h1 className="rank rank-2">
          {rows[1] ? <>2등 : {rows[1].username} [{rows[1].score}] 🥈</> : null}
        </h1>
        <h1 className="rank rank-3">
          {rows[2] ? <>3등 : {rows[2].username} [{rows[2].score}] 🥉</> : null}
        </h1>
      </div>

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
  const [open, setOpen] = useState({}); 

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await api.get("/challenges");
        if (!alive) return;
        const normalized = Array.isArray(data)
          ? data.map((it) => ({
              ...it,
              __id: Number(it.id ?? it.challenge_id ?? it.challengeId ?? it.cid ?? it.pk) || null,
            }))
          : [];
        setList(normalized);
      } catch {
        setList([]);
      }
    })();
    return () => { alive = false; };
  }, []);

  function toggle(id) {
    setOpen((p) => ({ ...p, [id]: !p[id] }));
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
          gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(300px, 1fr))",
        }}
      >
        {list.map((ch) => (
          <div
            key={ch.__id || ch.title}
            style={{
              border: "1px solid #555",
              borderRadius: 8,
              padding: 12,
              backgroundColor: "#111",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <b>[{ch.field}] {ch.title}</b>
              <button
                onClick={() => toggle(ch.__id)}
                style={{
                  background: "#333",
                  color: "#fff",
                  border: "none",
                  padding: "4px 8px",
                  cursor: "pointer",
                  borderRadius: 4,
                }}
              >
                Detail
              </button>
            </div>
            {open[ch.__id] && <ChallengeCard ch={ch} />}
          </div>
        ))}
      </div>
    </div>
  );
}




function ChallengeCard({ ch }) {
  const [msg, setMsg] = useState("");

  async function handleSubmitFlag(e) {
    e.preventDefault();
    const flag = e.currentTarget.flag.value;
    try {
      const { data } = await api.post(`/challenges/${ch.__id}/submit`, { flag });
      setMsg(data?.message || "제출됨");
    } catch (err) {
      const s = err?.response?.status;
      if (s === 404) setMsg(`문제 #${ch.__id} 를 찾을 수 없습니다`);
      else if (s === 401) setMsg("로그인이 필요합니다");
      else setMsg("제출 실패");
    }
  }

  async function handleDownload() {
    try {
      const res = await api.get(`/challenges/${ch.__id}/download`, { responseType: "blob" });
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
    <div style={{ marginTop: 10 }}>
      <div style={{ marginBottom: 8 }}>{ch.content}</div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <button onClick={handleDownload}>파일 다운로드</button>
        {ch.file && /^https?:\/\//i.test(ch.file) && (
          <a href={ch.file} target="_blank" rel="noreferrer">외부 파일 링크</a>
        )}
      </div>
      <form onSubmit={handleSubmitFlag} style={{ marginTop: 10, display: "flex", gap: 8 }}>
        <input name="flag" placeholder="codegate2025{...}" style={{ flex: 1 }} />
        <button type="submit">Submit</button>
      </form>
      {msg && <div style={{ marginTop: 8 }}>{msg}</div>}
    </div>
  );
}


function AdminPanel() {
  const [users, setUsers] = useState([]);
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

  useEffect(() => {
    loadUsers();
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
    } catch (err) {
      console.error(err?.response?.data || err);
      alert("Create failed");
    }
  }

  async function updateUser(id) {
    const e = edit[id] || {};
    const params = {};
    if (typeof e.is_admin === "boolean") params.is_admin = e.is_admin;
    if (typeof e.is_visible === "boolean") params.is_visible = e.is_visible;
    if (e.new_password && e.new_password.trim()) params.new_password = e.new_password;

    if (Object.keys(params).length === 0) return alert("변경사항 없음");

    try {
      await api.patch(`/admin/users/${id}`, null, { params });
      await loadUsers();
      setUE(id, { new_password: "" });
      alert("User updated");
    } catch (err) {
      console.error(err?.response?.data || err);
      alert("Update failed");
    }
  }

  return (
    <div style={{ color: "#fff", padding: 20 }}>
      <h2>Admin Panel</h2>

      <h3 style={{ marginTop: 16 }}>Create Challenge</h3>
      <form onSubmit={createChallenge} style={{ display: "grid", gap: 8, maxWidth: 640 }}>
        <input placeholder="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input placeholder="content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
        <select value={form.field} onChange={(e) => setForm({ ...form, field: e.target.value })}>
          <option value="web">web</option>
          <option value="pwn">pwn</option>
          <option value="rev">rev</option>
          <option value="misc">misc</option>
        </select>
        <input type="number" placeholder="points" value={form.points} onChange={(e) => setForm({ ...form, points: Number(e.target.value) })} />
        <input placeholder="flag" value={form.flag} onChange={(e) => setForm({ ...form, flag: e.target.value })} />

        <select value={form.scoring_type} onChange={(e) => setForm({ ...form, scoring_type: e.target.value })}>
          <option value="static">static</option>
          <option value="dynamic">dynamic</option>
        </select>

        <input type="number" placeholder="initial_value" value={form.initial_value} onChange={(e) => setForm({ ...form, initial_value: e.target.value })} />
        <input placeholder="decay_function (linear|logarithmic)" value={form.decay_function} onChange={(e) => setForm({ ...form, decay_function: e.target.value })} />
        <input type="number" step="0.01" placeholder="decay_value" value={form.decay_value} onChange={(e) => setForm({ ...form, decay_value: e.target.value })} />
        <input type="number" placeholder="minimum_value" value={form.minimum_value} onChange={(e) => setForm({ ...form, minimum_value: e.target.value })} />

        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input type="checkbox" checked={form.is_visible} onChange={(e) => setForm({ ...form, is_visible: e.target.checked })} />
          visible
        </label>

        <input type="file" onChange={(e) => setForm({ ...form, fileObj: e.target.files?.[0] || null })} />
        <button type="submit">Create</button>
      </form>

      <h3 style={{ marginTop: 24 }}>Users</h3>
      <div style={{ display: "grid", gap: 10, maxWidth: 800 }}>
        {users.map((u) => {
          const e = edit[u.id] || {};
          return (
            <div key={u.id} style={{ border: "1px solid #555", borderRadius: 8, padding: 10 }}>
              <div>
                <b>#{u.id}</b> {u.username} {u.is_admin ? "(admin)" : ""} &nbsp; score: {u.score} &nbsp; visible: {String(u.is_visible)}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap", alignItems: "center" }}>
                <label>
                  <input
                    type="checkbox"
                    checked={e.is_admin ?? u.is_admin}
                    onChange={(ev) => setUE(u.id, { is_admin: ev.target.checked })}
                  />{" "}
                  is_admin
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={e.is_visible ?? u.is_visible}
                    onChange={(ev) => setUE(u.id, { is_visible: ev.target.checked })}
                  />{" "}
                  is_visible
                </label>
                <input
                  placeholder="new password"
                  type="password"
                  value={e.new_password || ""}
                  onChange={(ev) => setUE(u.id, { new_password: ev.target.value })}
                />
                <button onClick={() => updateUser(u.id)}>save</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ color: "#fff", textAlign: "center", padding: 40 }}>
      <h2>404</h2>
      <div>Page not found</div>
      <img
        src="https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_16x9.jpg?w=1200"
        alt="고양이"
        style={{ maxWidth: "80%", marginTop: 20, borderRadius: 12 }}
      />
      <pre style={{ marginTop: 16 }}>{_hehehe}</pre>
    </div>
  );
}

export default function App() {
  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
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
