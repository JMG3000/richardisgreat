"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { awardedPoints, moveDelay, scoreMultiplier } from "@/lib/game";

const cheers = ["Stellar!", "Richard energy!", "Cosmic catch!", "Unreasonably quick!", "Supernova!"];

export default function Game({ authenticated }) {
  const arena = useRef(null);
  const [profile, setProfile] = useState(null);
  const [needsName, setNeedsName] = useState(false);
  const [username, setUsername] = useState("");
  const [nameError, setNameError] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [speed, setSpeed] = useState(4);
  const [stars, setStars] = useState(1);
  const [catches, setCatches] = useState(0);
  const [positions, setPositions] = useState([{ x: 50, y: 50 }]);
  const [message, setMessage] = useState("Ready when you are, Richard.");
  const [leaders, setLeaders] = useState([]);
  const score = awardedPoints(catches, speed, stars);
  const multiplier = useMemo(() => scoreMultiplier(speed, stars), [speed, stars]);

  const scatter = useCallback(() => {
    setPositions(Array.from({ length: stars }, () => ({ x: 9 + Math.random() * 82, y: 14 + Math.random() * 70 })));
  }, [stars]);

  useEffect(() => { scatter(); }, [scatter]);
  useEffect(() => {
    const timer = setInterval(scatter, moveDelay(speed));
    return () => clearInterval(timer);
  }, [speed, scatter]);

  useEffect(() => {
    if (!authenticated) return;
    fetch("/api/profile").then(r => r.json()).then(data => {
      if (data.profile) {
        setProfile(data.profile); setSpeed(data.profile.speed_level); setStars(data.profile.star_level);
      } else setNeedsName(true);
    });
  }, [authenticated]);

  useEffect(() => {
    const load = () => fetch("/api/leaderboard").then(r => r.ok ? r.json() : { leaders: [] }).then(data => setLeaders(data.leaders));
    load();
    const timer = setInterval(load, 30000);
    return () => clearInterval(timer);
  }, []);

  async function saveProfile(event) {
    event?.preventDefault(); setNameError("");
    const response = await fetch("/api/profile", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, speed, stars }) });
    const data = await response.json();
    if (!response.ok) return setNameError(data.error);
    setProfile(data.profile); setNeedsName(false); setSettingsOpen(false);
  }

  async function catchStar(index) {
    setCatches(value => value + 1);
    setMessage(cheers[catches % cheers.length]);
    setPositions(current => current.map((position, i) => i === index ? { x: 9 + Math.random() * 82, y: 14 + Math.random() * 70 } : position));
    if (authenticated && profile) {
      const next = catches + 1;
      const response = await fetch("/api/score", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ catches: next, speed, stars }) });
      if (response.ok) { const data = await response.json(); setProfile(value => ({ ...value, high_score: data.highScore })); }
    }
  }

  function reset() { setCatches(0); setMessage("Ready when you are, Richard."); scatter(); }

  return <main>
    <div className="space" aria-hidden="true"><i/><i/><i/><i/><i/></div>
    <nav><span className="brand">★ RICHARDVERSE</span><div className="nav-actions">
      {authenticated ? <><span className="player-name">{profile?.username || "New player"}</span><a href="/api/auth/signout">Sign out</a></> : <a className="google" href="/api/auth/signin/google">Continue with Google</a>}
      <button className="icon-button" onClick={() => setSettingsOpen(true)} aria-label="Open settings">⚙</button>
    </div></nav>
    <header><h1>Hello <span>Richard.</span></h1><p>Catch stars. Bend space. Make Richard proud.</p></header>
    <section className="game-shell">
      <div className="hud"><div><small>SCORE</small><strong>{score}</strong></div><div><small>HIGH SCORE</small><strong>{profile?.high_score ?? "—"}</strong></div><div><small>MULTIPLIER</small><strong>{multiplier}×</strong></div></div>
      <div className="arena" ref={arena}>
        <div className="speed-lines" />
        {positions.map((position, index) => <button key={index} className="star" style={{ left:`${position.x}%`, top:`${position.y}%` }} onClick={() => catchStar(index)} aria-label={`Catch star ${index + 1}`}>★<span>•‿•</span></button>)}
        <p className="message">{message}</p>
      </div>
      <div className="game-foot"><span>Speed {speed} · Stars {stars}</span><button onClick={reset}>Reset run</button></div>
    </section>
    <section className="leaderboard"><div><h2>Global star board</h2><p>Public usernames only. No profile details.</p></div><ol>{leaders.length ? leaders.map((leader, index) => <li key={leader.username}><span><b>{index + 1}</b>{leader.username}</span><strong>{leader.high_score}</strong></li>) : <li className="empty">The cosmos is waiting for its first champion.</li>}</ol></section>

    {settingsOpen && <div className="modal-backdrop"><section className="modal" role="dialog" aria-modal="true" aria-labelledby="settings-title"><button className="close" onClick={() => setSettingsOpen(false)}>×</button><h2 id="settings-title">Cosmic controls</h2><p>More speed and stars earn a bigger multiplier.</p><Slider label="Star speed" value={speed} onChange={setSpeed}/><Slider label="Stars on screen" value={stars} onChange={setStars}/><div className="multiplier-preview">Current multiplier <strong>{multiplier}×</strong></div><button className="primary" onClick={authenticated && profile ? saveProfile : () => setSettingsOpen(false)}>{authenticated && profile ? "Save settings" : "Play with these settings"}</button></section></div>}

    {needsName && <div className="modal-backdrop"><form className="modal" onSubmit={saveProfile}><h2>Choose your star name</h2><p>This is the only name shown on the global scoreboard. We never store your Google profile details.</p><label className="text-label">Username<input autoFocus value={username} onChange={e => setUsername(e.target.value)} minLength="3" maxLength="18" pattern="[A-Za-z0-9_]+" placeholder="CosmicRichard" required /></label>{nameError && <p className="error" role="alert">{nameError}</p>}<button className="primary" type="submit">Claim username</button></form></div>}
  </main>;
}

function Slider({ label, value, onChange }) {
  return <label className="slider-label"><span>{label}<b>{value}</b></span><input type="range" min="0" max="10" value={value} onChange={event => onChange(Number(event.target.value))}/><span className="range"><i>0</i><i>10</i></span></label>;
}
