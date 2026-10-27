import React,{useState,useEffect,useRef} from 'react';
import {funFacts,nextFact} from './personal.js';
const base=import.meta.env.BASE_URL;
export default function Companions(){
 const [fact,setFact]=useState(-1),[visible,setVisible]=useState(false),[enabled,setEnabled]=useState(true),[speaker,setSpeaker]=useState('Riolu');
 const last=useRef(0),lastY=useRef(0),index=useRef(-1),timer=useRef(null);
 function reveal(name){index.current=nextFact(index.current);setFact(index.current);setSpeaker(name);setVisible(true);last.current=Date.now();clearTimeout(timer.current);timer.current=setTimeout(()=>setVisible(false),11000);}
 useEffect(()=>{if(!enabled)return;lastY.current=window.scrollY;
 const scroll=()=>{const distance=Math.abs(window.scrollY-lastY.current);if(distance>650&&Date.now()-last.current>15000){reveal('Riolu');lastY.current=window.scrollY;}};
 window.addEventListener('scroll',scroll,{passive:true});return()=>window.removeEventListener('scroll',scroll);
 },[enabled]);
 useEffect(()=>()=>clearTimeout(timer.current),[]);
 const current=funFacts[fact];
 return <aside className={'companions '+(!enabled?'sleeping':'')} aria-label="Riolu companion">
 {enabled&&visible&&current&&<div className="fact-bubble" role="status"><div className="fact-top"><span>Riolu</span><button aria-label="Dismiss fun fact" onClick={()=>setVisible(false)}>×</button></div><p>{current.text}</p><div className="fact-actions"><button onClick={()=>reveal('Riolu')}>Another little fact ↻</button>{current.url&&<a href={current.url} target="_blank" rel="noreferrer">{current.label} ↗</a>}</div></div>}
 <div className="companion-party">{enabled&&['Riolu'].map(name=><button key={name} className={'sprite-button '+(speaker===name&&visible?'speaking':'')} onClick={()=>reveal(name)} aria-label={`${name}: show a fun fact`}><picture><source media="(prefers-reduced-motion: reduce)" srcSet={`${base}sprites/${name.toLowerCase()}.png`}/><img src={`${base}sprites/${name.toLowerCase()}.gif`} width="48" height="48" alt={name}/></picture></button>)}<button className="companion-toggle" aria-label={enabled?'Hide Riolu':'Show Riolu'} title={enabled?'Let the companions rest':'Bring back the companions'} onClick={()=>{setEnabled(!enabled);setVisible(false);clearTimeout(timer.current);}}>{enabled?'−':'✧'}</button></div>
 </aside>;
}
