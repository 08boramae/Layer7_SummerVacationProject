import logo from './logo.svg';
import Chart from 'react-apexcharts'
import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000';
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet"></link>

function isAuthed() {
  return !!localStorage.getItem('token');
}

function RequireAuth({ children }) {
  if (!isAuthed()) return <Navigate to="/login" replace state={{ from: '/challenges' }} />;
  return children;
}

const _t = localStorage.getItem('token');
if (_t) axios.defaults.headers.common['Authorization'] = `Bearer ${_t}`;

function parseJwt(t){
  try{
    const b = t.split('.')[1];
    return JSON.parse(decodeURIComponent(atob(b).split('').map(c=>'%' + ('00'+c.charCodeAt(0).toString(16)).slice(-2)).join('')));
  }catch{ return null; }
}
function isAdmin(){
  const t = localStorage.getItem('token');
  if(!t) return false;
  const p = parseJwt(t);
  return !!p?.is_admin;
}
function RequireAdmin({ children }) {
  if (!isAuthed()) return <Navigate to="/login" replace state={{ from: '/admin-panel' }} />;
  if (!isAdmin())  return <Navigate to="/" replace />;
  return children;
}

const _hehehe = `
██╗  ██╗███████╗██╗  ██╗███████╗██╗  ██╗███████╗██╗  ██╗███████╗
██║  ██║██╔════╝██║  ██║██╔════╝██║  ██║██╔════╝██║  ██║██╔════╝
███████║█████╗  ███████║█████╗  ███████║█████╗  ███████║█████╗  
██╔══██║██╔══╝  ██╔══██║██╔══╝  ██╔══██║██╔══╝  ██╔══██║██╔══╝  
██║  ██║███████╗██║  ██║███████╗██║  ██║███████╗██║  ██║███████╗
╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝
`
const _main = `
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
const _login = `
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
const _register = `
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

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Main des={{textAlign: "center", fontSize : "xx-large", color:"white", width: "1920px"}}/>}/>
        <Route path='/login'element={<Login/>}/>
        <Route path='/register'element={<Register/>}/>
        <Route path='/scoreboard'element={<Scoreboard/>}/>
        <Route path='/challenges'element={<RequireAuth><Challenges/></RequireAuth>}/>
        <Route path='/admin-panel' element={<RequireAdmin><Admin/></RequireAdmin>} />
        <Route path='*' element={<Wtf/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

function ChartTest() {
  let [place, SetPlace] = useState(0);
  let [username, SetUsername] = useState([]);
  let [scores, setScores] = useState([]);
  useEffect(()=> {
    function fix() {
      axios.get('http://localhost:8000/scoreboard')
      .then(res => {
        const data = res.data;
        const sorted = data.sort((a, b) => b.score - a.score);
        const names = sorted.map(users => users.username);
        const scores = sorted.map(scores => scores.score);
        SetUsername(names);
        setScores(scores);
      })
      .catch(err => {});
    };
    const interval = setInterval(fix, 100)
    return () => clearInterval(interval);
  }, [])

  const options = {
    chart: { id: 'scoreboard', parentHeightOffset: 0 },
    grid: { padding: { top: 0, right: 8, left: 8, bottom: 0 } },
    dataLabels: { enabled: false },
    legend: { show: false },
    xaxis: {
      categories: username,
      labels: {
        rotateAlways: false,
        rotate: -30,
        hideOverlappingLabels: true,
        trim: true,
        style: { colors: '#FFFFFF', fontSize: '14px' }
      },
      tickAmount: Math.min(username.length, 6)
    },
    yaxis: { labels: { style: { colors: '#FFFFFF', fontSize: '12px' } } },
    title: { text: 'Scoreboard', offsetY: 0, style: { color: '#FFFFFF', fontSize: '20px' } },
    colors: ['#FF0000'],
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: { width: '100%', height: 280 },
          xaxis: { labels: { style: { fontSize: '11px' } }, tickAmount: Math.min(username.length, 5) },
          yaxis: { labels: { style: { fontSize: '11px' } } },
          title: { style: { fontSize: '16px' } },
          grid: { padding: { top: 0, right: 4, left: 4, bottom: 0 } }
        }
      }
    ]
  };

  const series = [{ name: 'swap', data: scores }];

  return (
    <div className="scoreboard-wrap">
      <h1 className="rank rank-1">1등 : {username[0]} [{scores[0]}점] 🥇</h1>
      <h1 className="rank rank-2">2등 : {username[1]} [{scores[1]}점] 🥈</h1>
      <h1 className="rank rank-3">3등 : {username[2]} [{scores[2]}점] 🥉</h1>
      {!place ? (
        <h1 className='state-more more-btn' onClick={() => SetPlace(1)}>
          [아래 순위 더보기]
        </h1>
      ) : null}
      {place ? <UserState username={username} scores={scores}/> : null}
      <div className="chart-container">
        <Chart options={options} series={series} type="bar" width="1000" height="600" />
      </div>
    </div>
  );
}

function UserState({username, scores}) {
  return (
    <div className="userstate-list">
      {username.map(function(a,b) {
        return (
          <div key={b}>
            {a !== username[0] && a !== username[1] && a !== username[2] ? (
              <h1 className="rank other-rank">{b+1}등: {a} [{scores[b]}점]</h1>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

function Register() {
  return (
    <div>
      <pre className="ascii-pre center white">{window.innerWidth <= 768 ? _register_mobile : _register}</pre>
      <div className="fullvh center-flex black-bg">
        <form onSubmit={handleRegister} className="form-card">
          <input name='username' placeholder='enter id' className="input-lg" />
          <input name='password' placeholder='enter password' className="input-lg mt-60" />
          <button type='submit' className="btn-lg mt-60">REGISTER</button>
        </form>
      </div>
    </div>
  )
}

function Wtf() {
  return (
    <div className="center">
      <h1 className="white playfair xlarge">Something Wrong....</h1>
      <img className="responsive-img" src="https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_16x9.jpg?w=1200" />
      <pre className="white">{_hehehe}</pre>
    </div>
  )
}

function Login() {
  return (
    <div>
      <pre className="ascii-pre center white">{window.innerWidth <= 768 ? _login_mobile :_login}</pre>
      <div className="fullvh center-flex black-bg">
        <form onSubmit={handleLogin} className="form-card">
          <input name='username' placeholder='enter id' className="input-lg" />
          <input name='password' placeholder='enter password' className="input-lg mt-60" />
          <button type='submit' className="btn-lg mt-60">LOGIN</button>
        </form>
      </div>
    </div>
  )
}

function Scoreboard() {
  return (
    <div>
      <div>
        <pre className="scoreboard-header">
          <h1 className='rainbow scoreboard-ascii'>
            {window.innerWidth <= 768 ? _scoreboard_mobile : _scoreboard}
          </h1>
        </pre>
        <div className="chart-wrap">
          <ChartTest/>
        </div>
      </div>
    </div>
  )
}

function Challenges() {
  let [challenges, setChallenge] = useState([]);
  let [show, setShow]= useState([0,0,0,0]);

  function toggle(b) {
    const tmp = [...show];
    tmp[b] = tmp[b] ? 0 : 1;
    setShow(tmp);
  }

  const [test2, changeTest2] = useState(0);

  useEffect(()=> {
    async function loadAll() {
      try {
        const pub = await axios.get(`${API_BASE}/challenges`);
        const data = Array.isArray(pub.data) ? pub.data : [];
        const normalized = data.map(it => {
          const cands = [it.id, it.challenge_id, it.challengeId, it.challengeID, it.cid, it.pk];
          const found = cands.find(v => Number.isInteger(Number(v)) && Number(v) > 0);
          return { ...it, __id: found ? Number(found) : null };
        });
        let solvedSet = new Set();
        const t = localStorage.getItem('token');
        if (t) {
          try {
            const res = await axios.get(`${API_BASE}/challenges/me/solves`, {
              headers: { Authorization: `Bearer ${t}` }
            });
            (res.data || []).forEach(n => {
              const idNum = Number(n);
              if (Number.isInteger(idNum)) solvedSet.add(idNum);
            });
          } catch(_) {}
        }
        const merged = normalized.map(x => ({ ...x, __solved: solvedSet.has(Number(x.__id)) }));
        setChallenge(merged);
      } catch (e) {
        setChallenge([]);
      }
    }
    loadAll();
  }, [test2]);

  return (
    <div>
      <div>
        <pre className="challenges-header">
          <h1 className='rainbow2 challenges-ascii'>{window.innerWidth <= 768 ? _challenges_mobile : _challenges}</h1>
        </pre>
      </div>
      <div className='challenges'>
        {challenges ? challenges.map(function (a, b) {
          if (challenges[b].field === "web") {
            return (
              <div key={b} className="challenge-block">
                {challenges.findIndex(x => x.field === "web") === b ? (
                  <div>
                    <h1 className="white xxlarge">WEB</h1>
                    <br/>
                  </div>
                ) : null}
                <h1 className="white pointer" onClick={()=>{toggle(b);}}>[{challenges[b].title}]</h1>
                {show[b] === 1 ? <Content challenges={challenges} b={b}/> : null}
              </div>
            );
          } else if (challenges[b].field === "pwn") {
            return (
              <div key={b} className="challenge-block white">
                {challenges.findIndex(x => x.field === "pwn") === b ? (
                  <div>
                    <br/>
                    <hr className="w50"/>
                    <br/>
                    <h1 className="white">PWN</h1>
                    <br/>
                  </div>
                ) : null}
                <h1 className="white pointer" onClick={()=>{toggle(b);}}>[{challenges[b].title}]</h1>
                {show[b] === 1 ? <Content challenges={challenges} b={b}/> : null}
              </div>
            );
          } else if(challenges[b].field === "rev") {
            return (
              <div key={b} className="challenge-block white">
                {challenges.findIndex(x => x.field === "rev") === b ? (
                  <div>
                    <br/>
                    <hr className="w50"/>
                    <br/>
                    <h1 className="white">REV</h1>
                    <br/>
                  </div>
                ) : null}
                <h1 className="white pointer" onClick={()=>{toggle(b);}}>[{challenges[b].title}]</h1>
                {show[b] === 1 ? <Content challenges={challenges} b={b}/> : null}
              </div>
            );
          } else if(challenges[b].field === "misc") {
            return (
              <div key={b} className="challenge-block">
                {challenges.findIndex(x => x.field === "misc") === b ? (
                  <div>
                    <br/>
                    <hr className="w50"/>
                    <br/>
                    <h1 className="white">MISC</h1>
                    <br/>
                  </div>
                ) : null}
                <h1 className="white pointer" onClick={()=>{toggle(b);}}>[{challenges[b].title}]</h1>
                {show[b] === 1 ? <Content challenges={challenges} b={b}/> : null}
              </div>
            );
          }
          return null;
        }) : null}
      </div>
    </div>
  )
}

function saveToken(token) {
  if (!token) throw new Error('empty token');
  localStorage.setItem('token', token);
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const _existing = localStorage.getItem('token');
if (_existing) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${_existing}`;
}

function Content({challenges, b}) {
  const [ok, setOk] = useState(null);
  const ch = challenges[b];
  const chId = Number(ch?.__id);
  const initiallySolved = !!ch?.__solved;

  useEffect(() => {
    if (initiallySolved) setOk(true);
  }, [initiallySolved]);

  async function onSubmit(e){
    const success = await handleSubmitFlag(e);
    if (success === true) {
      setOk(true);
      ch.__solved = true;
    } else if (success === false) {
      setOk(false);
    }
  }

  const bgColor =
    ok === null ? undefined :
    ok === true ? 'aqua' : 'red';

  return (
    <div className='root'>
      <div className="challenge-card" style={{ backgroundColor: bgColor }}>
        <form data-challenge-id={chId} onSubmit={onSubmit}>
          <br/>
          <h1>{ch?.content}</h1>
          <h1 className="link-like" onClick={()=> {window.location.href = (ch?.file)}}>{ch?.file}</h1>
          <span className="flags-label">FLAGS :</span>
          <input className="flag-input" name="flag" />
        </form>
      </div>
    </div>
  );
}

function Main({des}) {
  const navigate = useNavigate();
  return (
    <div>
      <div>
        <pre className="ascii-pre center white">{window.innerWidth <= 768 ? _main_mobile : _main}</pre>
      </div>
      <div className="nav-row">
        <h1 className='login nav-item' onClick={() => navigate('/login')}>[Login]</h1>
        <h1 className='register nav-item' onClick={() => {navigate('/register')}}>[Register]</h1>
        <h1 className='scoreboard nav-item' onClick={() => {navigate('/scoreboard')}}>[Scoreboard]</h1>
        <h1 className='challenges nav-item' onClick={() => {navigate('/challenges')}}>[Challenges]</h1>
        <h1 className='settings nav-item' onClick={() => {navigate('/settings')}}>[Settings]</h1>
        {isAdmin() && (
          <h1 className='admin-panel nav-item' onClick={() => {navigate('/admin-panel')}}>[Admin-Panel]</h1>
        )}
      </div>
    </div>
  );
}

function buildFormData(o){
  const fd = new FormData();
  fd.append('title', o.title.trim());
  fd.append('content', o.content.trim());
  fd.append('field', o.field);
  fd.append('flag', o.flag);
  fd.append('is_visible', o.is_visible ? 'true' : 'false');
  fd.append('scoring_type', o.scoring_type || 'static');
  fd.append('initial_value', String(+o.initial_value || 100));
  fd.append('minimum_value', String(+o.minimum_value || 100));
  if (o.file && o.file.trim()) {
    const v = o.file.trim();
    if (/^https?:\/\//i.test(v)) {
      fd.append('file_url', v);
    } else if (o.fileObj instanceof File) {
      fd.append('file', o.fileObj, o.fileObj.name);
    }
  }
  if ((o.scoring_type || 'static') === 'dynamic') {
    if (o.decay_function && o.decay_function.trim()) fd.append('decay_function', o.decay_function.trim());
    if (o.decay_value !== '' && o.decay_value !== null && o.decay_value !== undefined) {
      fd.append('decay_value', String(+o.decay_value));
    }
  }
  return fd;
}

function Admin() {
  const [list, setList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [users, setUsers] = useState([]);
  const [userEdits, setUserEdits] = useState({});
  const [form, setForm] = useState({
    title: "", content: "", field: "web", flag: "",
    file: "", is_visible: true, scoring_type: "static",
    initial_value: 100, minimum_value: 100, decay_function: "", decay_value: ""
  });

  useEffect(() => { load(); }, []);

  async function load() {
    const r = await axios.get(`${API_BASE}/admin/challenges`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setList(r.data || []);
    const u = await axios.get(`${API_BASE}/admin/users`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setUsers(Array.isArray(u.data) ? u.data : []);
  }

  function setUE(id, patch){
    setUserEdits(prev => ({ ...prev, [id]: { ...(prev[id]||{}), ...patch } }));
  }

  async function updateUser(id){
    const body = {};
    const e = userEdits[id] || {};
    if (e.username && e.username.trim()) body.username = e.username.trim();
    if (e.password && e.password.length > 0) body.password = e.password;
    if (e.score !== undefined && e.score !== null && e.score !== '') body.score = Number(e.score);
    if (Object.keys(body).length === 0) { alert('변경사항 없음'); return; }
    try{
      await axios.patch(`${API_BASE}/admin/users/${id}`, body, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type':'application/json' }
      });
      await load();
      alert('user updated');
      setUE(id, { username:'', password:'', score:'' });
    }catch(err){
      alert('update failed');
    }
  }

  async function createChallenge(e){
    e.preventDefault();
    try{
      const body = buildFormData(form);
      await axios.post(`${API_BASE}/admin/challenges`, body, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setForm({ title:"", content:"", field:"web", flag:"", file:"", is_visible:true,
                scoring_type:"static", initial_value:100, minimum_value:100,
                decay_function:"", decay_value:"" });
      await load();
      alert('created');
    }catch(err){
      alert('create failed');
    }
  }

  async function saveEdit(e){
    e.preventDefault();
    if(!editingId) return;
    try{
      const body = buildFormData(form);
      await axios.patch(`${API_BASE}/admin/challenges/${editingId}`, body, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setEditingId(null);
      await load();
      alert('updated');
    }catch(err){
      alert('update failed');
    }
  }

  function startEdit(ch){
    setEditingId(ch.id);
    setForm({
      title: ch.title ?? "",
      content: ch.content ?? "",
      field: ch.field ?? "web",
      flag: ch.flag ?? "",
      file: ch.file ?? "",
      is_visible: !!ch.is_visible,
      scoring_type: ch.scoring_type ?? "static",
      initial_value: ch.initial_value ?? 100,
      minimum_value: ch.minimum_value ?? 100,
      decay_function: ch.decay_function ?? "",
      decay_value: ch.decay_value ?? ""
    });
  }

  async function removeChallenge(id){
    await axios.delete(`${API_BASE}/admin/challenges/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    await load();
  }

  return (
    <div className='admin-panel'>
      <h1>Admin Panel</h1>
      <form className='admin-create-challenge' onSubmit={editingId ? saveEdit : createChallenge}>
        <input placeholder='title' value={form.title} onChange={e=>setForm({...form, title:e.target.value})}/>
        <input placeholder='content' value={form.content} onChange={e=>setForm({...form, content:e.target.value})}/>
        <select value={form.field} onChange={e=>setForm({...form, field:e.target.value})}>
          <option value="web">web</option>
          <option value="pwn">pwn</option>
          <option value="rev">rev</option>
          <option value="misc">misc</option>
        </select>
        <input placeholder='flag' value={form.flag} onChange={e=>setForm({...form, flag:e.target.value})}/>
        <input placeholder='file url' value={form.file} onChange={e=>setForm({...form, file:e.target.value})}/>
        <select value={form.scoring_type} onChange={e=>setForm({...form, scoring_type:e.target.value})}>
          <option value="static">static</option>
          <option value="dynamic">dynamic</option>
        </select>
        <input type='number' placeholder='initial_value' value={form.initial_value} onChange={e=>setForm({...form, initial_value:e.target.value})}/>
        <input type='number' placeholder='minimum_value' value={form.minimum_value} onChange={e=>setForm({...form, minimum_value:e.target.value})}/>
        <input placeholder='decay_function' value={form.decay_function} onChange={e=>setForm({...form, decay_function:e.target.value})}/>
        <input type='number' step='0.01' placeholder='decay_value' value={form.decay_value} onChange={e=>setForm({...form, decay_value:e.target.value})}/>
        <button type='submit' style={{marginLeft:8}}>{editingId ? 'save' : 'create challenge'}</button>
        {editingId ? <button type='button' onClick={()=>{setEditingId(null); setForm({ title:"", content:"", field:"web", flag:"", file:"", is_visible:true, scoring_type:"static", initial_value:100, minimum_value:100, decay_function:"", decay_value:"" });}} style={{marginLeft:8}}>cancel</button> : null}
      </form>
      <hr/>
      {list.map(ch => (
        <div key={ch.id} style={{color:'#fff', marginBottom:12}}>
          <b>#{ch.id}</b> [{ch.field}] {ch.title} {ch.is_visible ? '' : '(hidden)'}
          <div style={{marginTop:6}}>
            <button onClick={()=>startEdit(ch)}>edit</button>
            <button onClick={()=>removeChallenge(ch.id)} style={{marginLeft:8}}>delete</button>
          </div>
        </div>
      ))}
      <hr/>
      <h2 style={{color:'#fff'}}>User Management</h2>
      <div style={{color:'#fff', marginTop:8}}>
        {users.map(u => {
          const e = userEdits[u.id] || {};
          return (
            <div key={u.id} style={{border:'1px solid #555', borderRadius:8, padding:8, marginBottom:10}}>
              <div><b>#{u.id}</b> {u.username} {u.is_admin ? '(admin)' : ''}</div>
              <div>score: {u.score}</div>
              <div style={{marginTop:6, display:'flex', gap:8, flexWrap:'wrap'}}>
                <input placeholder='new username'
                       value={e.username||''}
                       onChange={ev=>setUE(u.id, {username: ev.target.value})}/>
                <input placeholder='new password'
                       type='password'
                       value={e.password||''}
                       onChange={ev=>setUE(u.id, {password: ev.target.value})}/>
                <input type='number' placeholder='set score'
                       value={e.score??''}
                       onChange={ev=>setUE(u.id, {score: ev.target.value})}/>
                <button onClick={()=>updateUser(u.id)}>save</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

async function handleLogin(e){
  e.preventDefault();
  const form = e.target;
  const username = form.querySelector("input[name='username']").value.trim();
  const password = form.querySelector("input[name='password']").value;

  try {
    const body = new URLSearchParams();
    body.append('username', username);
    body.append('password', password);

    const res = await axios.post(
      `${API_BASE}/auth/token`,
      body,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' }, timeout: 8000 }
    );

    const token = res?.data?.access_token;
    saveToken(token);
    alert('로그인 성공');
    window.location.href='/';
  } catch (err) {
    alert('로그인 실패');
  }
}

async function handleRegister(e){
  e.preventDefault();
  const form = e.target;
  const username = form.querySelector("input[name='username']").value;
  const password = form.querySelector("input[name='password']").value;
  try {
    const res = await axios.post(
      `${API_BASE}/auth/register`,
      { username, password },
      { headers: { 'Content-Type': 'application/json' } }
    );
    localStorage.setItem('token', res.data.access_token);
    alert('회원가입 성공');
    window.location.href='/login';
  } catch (err) {
    alert('회원가입 실패');
  }
}

async function handleSubmitFlag(e){
  e.preventDefault();
  const token = localStorage.getItem('token');
  if(!token){
    alert('먼저 로그인하세요');
    return false;
  }

  const challengeId = Number(e.currentTarget.dataset.challengeId);
  const flag = e.currentTarget.querySelector('.flag-input').value;

  if(!Number.isInteger(challengeId) || challengeId <= 0){
    alert('문제 ID를 찾을 수 없습니다');
    return false;
  }

  try{
    const res = await axios.post(`${API_BASE}/challenges/${challengeId}/submit`, { flag }, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type':'application/json' }
    });
    alert(res.data.message || '제출됨');
    return true;
  }catch(err){
    if (err?.response?.status === 404) alert(`문제 #${challengeId} 를 찾을 수 없습니다`);
    else if (err?.response?.status === 401) alert('로그인이 필요합니다');
    else alert('제출 실패');
    return false;
  }
}

export default App;
