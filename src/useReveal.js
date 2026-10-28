import {useEffect} from 'react';
export default function useReveal(){useEffect(()=>{
 if(!('IntersectionObserver'in window)||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const targets=[...document.querySelectorAll('[data-reveal]')];const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.08,rootMargin:'0px 0px -24px 0px'});
 targets.forEach((el,i)=>{el.style.setProperty('--reveal-delay',`${(i%3)*65}ms`);el.classList.add('reveal-ready');observer.observe(el)});
 return()=>{observer.disconnect();targets.forEach(el=>el.classList.remove('reveal-ready'))};
 },[])}
