import React, {useState,useEffect,useRef} from 'react';
import {createRoot} from 'react-dom/client';
import {skills} from './data.js';
import Companions from './Companions.jsx';
import {conversationalReply} from './rotom-conversation.js';
import ThemeToggle from './ThemeToggle.jsx';
import Newspaper from './Newspaper.jsx';
import ProjectCarousel from './ProjectCarousel.jsx';
import ExperienceTimeline from './ExperienceTimeline.jsx';
import Coursework from './Coursework.jsx';
import useReveal from './useReveal.js';
import './style.css';
import {startAnalytics,track} from './analytics.js';
const base=import.meta.env.BASE_URL;
function Ball({small=false}){return <span className={'ball '+(small?'small':'')} aria-hidden="true"><i/></span>}

function Landscape(){
 const [paused,setPaused]=useState(false);
 return <div className="landscape team-scene"><picture><source media="(prefers-reduced-motion: reduce)" srcSet={`${base}images/team-hero-still.webp`}/><img className="team-hero-image" src={`${base}images/${paused?'team-hero-still.webp':'team-hero.gif'}`} width="600" height="600" alt="Aryan and his Pokémon team: Lucario, Garchomp, Gyarados, Glaceon, Infernape, and Milotic on a moonlit mountain path beside a Pokémon Center" fetchPriority="high"/></picture><button className="hero-motion-toggle" onClick={()=>setPaused(p=>!p)} aria-label={paused?'Play team animation':'Pause team animation'} aria-pressed={paused}>{paused?'▶':'Ⅱ'}</button></div>
}
function App(){
 useEffect(startAnalytics,[]);
 useReveal();
 const [messages,setMessages]=useState([]); const [question,setQuestion]=useState(''); const [busy,setBusy]=useState(false); const [menu,setMenu]=useState(false); const chatEnd=useRef(null);
 useEffect(()=>{if(messages.length)chatEnd.current?.scrollIntoView({behavior:'smooth',block:'nearest'});},[messages,busy]);
 async function ask(value){
 const q=(value||question).trim();if(!q||busy)return;
 track('rotom_question');const started=performance.now();
 const history=messages.filter(m=>m.role==='user'||['rag','conversation'].includes(m.mode)).slice(-8).map(m=>({role:m.role,content:m.text}));
 setQuestion('');setMessages(m=>[...m,{role:'user',text:q}]);
 const social=conversationalReply(q);if(social){track('rotom_success','conversation');setMessages(m=>[...m,{role:'assistant',text:social.answer,sources:[],mode:social.mode}]);return;}
 setBusy(true);
 try{
  const endpoint=import.meta.env.VITE_RAG_API_URL||(import.meta.env.DEV?'/api/profile':null);
  if(!endpoint)throw new Error('unconfigured');
  const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:q,history}),signal:AbortSignal.timeout(45000)});
  if(!response.ok){const failure=await response.json().catch(()=>({}));throw new Error(['AI_NOT_CONFIGURED','AI_AUTH_FAILED'].includes(failure.code)?'unconfigured':response.status===429||failure.code==='AI_RATE_LIMIT'?'limited':'unavailable');}
  const data=await response.json();if(typeof data.answer!=='string'||!Array.isArray(data.sources))throw new Error('unavailable');
  track('rotom_success','rag',Math.round(performance.now()-started));
  setMessages(m=>[...m,{role:'assistant',text:data.answer,sources:data.sources,mode:data.mode}]);
 }catch(e){track('rotom_error');setMessages(m=>[...m,{role:'assistant',mode:'unavailable',text:e.message==='unconfigured'?'My Groq connection isn’t ready yet. You can still explore Aryan’s experience and projects, or come back for a chat once it’s connected.':e.message==='limited'?'Rotom needs a short break. Try again in a minute.':'Rotom couldn’t reach its AI service. Please try again.'}]);}
 finally{setBusy(false);}
 }
 return <><header><a className="brand" href="#home" aria-label="Aryan Parab home"><Ball small/><strong>aryan.parab</strong></a><button className="menu-toggle" aria-expanded={menu} aria-label="Toggle navigation" onClick={()=>setMenu(!menu)}>☰</button><nav className={menu?'open':''} aria-label="Main navigation">{['Experience','Projects','About','Courses','Interests'].map(x=><a key={x} href={'#'+(x==='Courses'?'coursework':x.toLowerCase())} onClick={()=>setMenu(false)}>{x}</a>)}<a className="nav-ask" href="#ask" onClick={()=>setMenu(false)}>Ask Rotom <span>↗</span></a></nav><ThemeToggle/></header>
 <main id="home"><section className="hero"><div><h1>Curiosity is<br/>my <em>starting point.</em></h1><p className="hero-copy">I’m Aryan — an engineer building intelligent agents,<br className="desktop-break"/> thoughtful software, and systems that move.</p><div className="hero-tags"><span className="tag purple">AI & agents</span><span className="tag green">Software systems</span><span className="tag orange">Robotics</span></div><div className="hero-actions"><a className="button primary" href="#projects">Explore my work <span>↓</span></a><a className="text-link" href="mailto:amparab@usc.edu">Let’s connect ↗</a></div><p className="hero-foot">M.S. Computer Science @ USC <span>·</span> GenAI Intern @ Cadence</p></div><div className="hero-art"><Landscape/></div></section>
 <div className="achievement-strip"><span><b>✧</b> USC Claude AI Hackathon ’25 <span className="milestone-result">Winner</span></span><span><b>✧</b> USC ACM Hackathon ’26 <span className="milestone-result">Winner</span></span><span className="strip-gpa">4.0 / 4.0 <span className="milestone-result">USC GPA</span></span></div>
 <ExperienceTimeline/>
 <ProjectCarousel/>
 <section id="about" className="section about" data-reveal><div><h2>Engineer by training.<br/>Explorer by nature<span className="red-dot">.</span></h2><p className="about-copy">My work spans AI that reasons, software that scales, and robots that learn. I like connecting the research behind an idea to the engineering that makes it useful.</p><div className="education"><span className="education-symbol">⌂</span><div><h3>University of Southern California</h3><p>M.S. Computer Science · Jan 2025 – Dec 2026</p><p>GPA 4.0 / 4.0</p></div></div><div className="education"><span className="education-symbol">⌂</span><div><h3>Thadomal Shahani Engineering College</h3><p>B.E. Computer Engineering · Aug 2019 – May 2023</p><p>GPA 9.1 / 10</p></div></div><div className="profile-socials"><a href="https://github.com/aryanparab" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://www.linkedin.com/in/aryan-parab-0b44991b2" target="_blank" rel="noreferrer">LinkedIn ↗</a></div></div><div className="skill-panel" id="skills"><div className="skill-title"><Ball small/><h3>Moveset</h3></div>{skills.map(([title,items])=><div className="skill-group" key={title}><h4>{title}</h4><p>{items}</p></div>)}</div></section>
 <Coursework/>
 <section id="ask" className="assistant-section" data-reveal><div className="assistant-intro"><img className="rotom-dex" src={`${base}sprites/rotom-dex.svg`} width="150" height="150" alt="Rotom Dex"/><h2>Ask Rotom<span className="red-dot">.</span></h2><p>My experience, projects, and a few side quests. What would you like to know?</p></div><div className="chat"><div className="chat-header"><img src={`${base}sprites/rotom-dex.svg`} width="42" height="42" alt=""/><strong>Rotom Dex</strong>{messages.length>0&&<button className="clear-chat" onClick={()=>setMessages([])} disabled={busy}>Clear</button>}</div><div className="messages" aria-live="polite" aria-relevant="additions"><div className="chat-message assistant"><p>Bzzt! I’m Rotom, Aryan’s personal Dex. What would you like to discover about him?</p></div>{messages.map((m,i)=><div key={i} className={'chat-message '+m.role}><span className="message-label">{m.role==='user'?'You':'Rotom'}</span><p>{m.text}</p>{m.sources?.length>0&&<div className="chat-sources">{m.sources.map(s=><a key={s.id} href={`#${s.section||'about'}`}>{s.title} ↗</a>)}</div>}</div>)}{busy&&<p className="loading">Rotom is looking through the field notes…</p>}<div ref={chatEnd}/></div>{messages.length===0&&<div className="suggestions">{['What has Aryan built with AI?','Tell me about his leadership experience.','What does he enjoy outside work?'].map(q=><button key={q} onClick={()=>ask(q)}>{q}<span>↗</span></button>)}</div>}<form onSubmit={e=>{e.preventDefault();ask();}}><label className="sr-only" htmlFor="question">Ask Rotom a question</label><input id="question" value={question} maxLength={600} onChange={e=>setQuestion(e.target.value)} placeholder="Ask Rotom…" disabled={busy}/><button aria-label="Send question" disabled={busy||!question.trim()}>↑</button></form></div></section>
 <Newspaper/><section className="contact"><h2>Let’s build something interesting.</h2><a href="mailto:amparab@usc.edu">amparab@usc.edu <span>↗</span></a><p>Or find me on <a href="https://www.linkedin.com/in/aryan-parab-0b44991b2" target="_blank" rel="noreferrer">LinkedIn ↗</a></p></section></main><footer><a href="#home" className="brand"><Ball small/><strong>aryan.parab</strong></a><a href="#home">Back to top ↑</a></footer><Companions/></>;
}
createRoot(document.getElementById('root')).render(<App/>);
