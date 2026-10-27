// Anonymous, same-origin analytics. Never send form values, chat text, or full URLs.
export function track(name,label='',value=0){
 if(import.meta.env.DEV || navigator.doNotTrack==='1')return;
 const data=JSON.stringify({name,label,value,device:innerWidth<768?'mobile':'desktop'});
 fetch(import.meta.env.VITE_ANALYTICS_API_URL||'/api/analytics/event',{method:'POST',headers:{'Content-Type':'application/json'},body:data,keepalive:true}).catch(()=>{});
}
export function startAnalytics(){
 track('page_view',document.referrer?(()=>{try{return new URL(document.referrer).hostname}catch{return ''}})():'direct');
 const seen=new Set();
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting&&!seen.has(e.target.id)){seen.add(e.target.id);track('section_view',e.target.id)}}),{threshold:0.25});
 document.querySelectorAll('main section[id]').forEach(e=>observer.observe(e));
 const click=e=>{const a=e.target.closest('a');if(a){const href=a.getAttribute('href')||'';if(href.startsWith('mailto:'))track('contact_click','email');else if(href.startsWith('https:'))track('outbound_click',new URL(href).hostname)}};
 const toggle=e=>{if(e.target.matches('details[open]'))track('notes_open',e.target.closest('article')?.querySelector('h3')?.textContent||'experience')};
 document.addEventListener('click',click);document.addEventListener('toggle',toggle,true);
 let lcp=0,cls=0;const observers=[];
 for(const type of ['largest-contentful-paint','layout-shift'])try{const o=new PerformanceObserver(list=>list.getEntries().forEach(e=>{if(type==='largest-contentful-paint')lcp=e.startTime;else if(!e.hadRecentInput)cls+=e.value}));o.observe({type,buffered:true});observers.push(o)}catch{}
 let sent=false;const flush=()=>{if(sent)return;sent=true;const nav=performance.getEntriesByType('navigation')[0];if(nav)track('load_ms','',Math.round(nav.loadEventEnd||performance.now()));if(lcp)track('lcp_ms','',Math.round(lcp));track('cls','',Math.round(cls*1000));};
 const visibility=()=>{if(document.visibilityState==='hidden')flush()};
 document.addEventListener('visibilitychange',visibility);addEventListener('pagehide',flush);const timer=setTimeout(flush,15000);
 return ()=>{observer.disconnect();observers.forEach(o=>o.disconnect());clearTimeout(timer);document.removeEventListener('click',click);document.removeEventListener('toggle',toggle,true);document.removeEventListener('visibilitychange',visibility);removeEventListener('pagehide',flush)};
}
