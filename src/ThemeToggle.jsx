import React,{useEffect,useState} from 'react';
import {themeForHour} from './personal.js';
export default function ThemeToggle(){
 const [mode,setMode]=useState(()=>{try{return ['auto','day','night'].includes(localStorage.getItem('portfolio-theme'))?localStorage.getItem('portfolio-theme'):'auto';}catch{return 'auto';}});
 const [hour,setHour]=useState(()=>new Date().getHours());
 useEffect(()=>{const id=setInterval(()=>setHour(new Date().getHours()),60000);return()=>clearInterval(id);},[]);
 const resolved=mode==='auto'?themeForHour(hour):mode;
 useEffect(()=>{document.documentElement.dataset.theme=resolved;document.querySelector('meta[name="theme-color"]')?.setAttribute('content',resolved==='night'?'#171e28':'#f7f6f0');try{localStorage.setItem('portfolio-theme',mode);}catch{}},[mode,resolved]);
 return <button className="theme-toggle" onClick={()=>setMode(mode==='auto'?'day':mode==='day'?'night':'auto')} aria-label={`Theme: ${mode}, currently ${resolved}. Switch to ${mode==='auto'?'day':mode==='day'?'night':'automatic'} mode.`} title="Cycle automatic, day, and night themes"><span aria-hidden="true">{resolved==='night'?'☾':'☀'}</span><span>{mode==='auto'?'Local time':mode==='day'?'Day mode':'Night mode'}</span></button>;
}
