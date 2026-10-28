import {allowedOrigin,corsHeaders} from './origins.js';
const names=new Set(['project_select','page_view','section_view','notes_open','contact_click','outbound_click','rotom_question','rotom_success','rotom_error','load_ms','lcp_ms','cls']);
const rate=new Map();
const json=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export function owner(request,env){return !!env.ANALYTICS_OWNER_EMAIL&&request.headers.get('oai-authenticated-user-email')?.toLowerCase()===env.ANALYTICS_OWNER_EMAIL.toLowerCase()&&!!request.headers.get('oai-authenticated-user-id');}
export async function analytics(request,env){
 const path=new URL(request.url).pathname;
 if(path!=='/api/analytics/event')return handleAnalytics(request,env);
 const origin=allowedOrigin(request,env);if(!origin)return json({error:'Origin not allowed'},403);
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers:corsHeaders(origin)});
 const response=await handleAnalytics(request,env);const headers=new Headers(response.headers);for(const [key,value]of Object.entries(corsHeaders(origin)))headers.set(key,value);return new Response(response.body,{status:response.status,headers});
}
async function handleAnalytics(request,env){
 const url=new URL(request.url);
 if(url.pathname==='/analytics'){
  if(request.method!=='GET')return new Response(null,{status:405});
  if(!owner(request,env))return new Response('<!doctype html><title>Private analytics</title><main style="font:18px system-ui;max-width:600px;margin:15vh auto;padding:24px"><h1>Aryan’s field report</h1><p>This dashboard is private to Aryan.</p><a href="/signin-with-chatgpt?return_to=%2Fanalytics" target="_top">Sign in with ChatGPT →</a></main>',{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}});
  return new Response(dashboard,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow'}});
 }
 if(url.pathname==='/api/analytics/report'){
  if(!owner(request,env))return json({error:'Owner access required'},403);
  if(request.method!=='GET')return json({error:'Use GET'},405);
  if(!env.DB)return json({error:'Analytics storage is unavailable'},503);
  const days=[7,30,90].includes(Number(url.searchParams.get('days')))?Number(url.searchParams.get('days')):30;
  const since=new Date(Date.now()-(days-1)*86400000).toISOString().slice(0,10);
  const {results}=await env.DB.prepare('SELECT day,name,label,device,count,total FROM analytics_daily WHERE day >= ? ORDER BY day').bind(since).all();
  return json({days,rows:results});
 }
 if(url.pathname!=='/api/analytics/event')return null;
 if(request.method!=='POST')return json({error:'Use POST'},405);
 if(!allowedOrigin(request,env))return json({error:'Origin not allowed'},403);
 if(request.headers.get('DNT')==='1'||/bot|crawler|spider|headless/i.test(request.headers.get('User-Agent')||''))return new Response(null,{status:204});
 if(!env.DB)return json({error:'Analytics storage is unavailable'},503);
 const now=Date.now();for(const [key,v]of rate)if(now-v.start>60000)rate.delete(key);
 const ip=request.headers.get('CF-Connecting-IP')||'anonymous',v=rate.get(ip)||{start:now,count:0};rate.set(ip,v);if(++v.count>80)return json({error:'Rate limited'},429);
 const raw=await request.text();if(raw.length>1024)return json({error:'Too large'},413);
 let data;try{data=JSON.parse(raw)}catch{return json({error:'Invalid JSON'},400)}
 if(!names.has(data.name)||!['mobile','desktop'].includes(data.device))return json({error:'Invalid event'},400);
 // Only fixed labels or public headings/domains; never persist raw URL queries or messages.
 const label=typeof data.label==='string'?data.label.replace(/[^a-zA-Z0-9 ._’'–/-]/g,'').slice(0,100):'';
 const value=Number.isFinite(data.value)?Math.max(0,Math.min(data.value,300000)):0;
 await env.DB.prepare('INSERT INTO analytics_daily(day,name,label,device,count,total) VALUES(?,?,?,?,1,?) ON CONFLICT(day,name,label,device) DO UPDATE SET count=count+1,total=total+excluded.total').bind(new Date().toISOString().slice(0,10),data.name,label,data.device,value).run();
 // Keep only a rolling 90-day aggregate; no individual event records.
 if(data.name==='page_view')await env.DB.prepare('DELETE FROM analytics_daily WHERE day < ?').bind(new Date(now-90*86400000).toISOString().slice(0,10)).run();
 return new Response(null,{status:204});
}
const dashboard=`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Aryan · Field report</title><style>
*{box-sizing:border-box}body{margin:0;background:#f5f4ed;color:#28372f;font:16px system-ui}main{max-width:1100px;margin:auto;padding:50px 24px}a{color:inherit}header{display:flex;justify-content:space-between;gap:20px;align-items:center}h1{font-size:clamp(30px,6vw,48px);letter-spacing:-2px;margin:12px 0}select,button{font:inherit;border:1px solid #ccd1c5;padding:10px;border-radius:10px;background:#fff}.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:16px;margin:30px 0}.card,section{background:#fffdf8;border:1px solid #dfe1d6;border-radius:16px;padding:22px}.card strong{display:block;font-size:32px;margin-top:10px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}section{margin-bottom:18px}h2{font-size:20px;margin-top:0}.row{display:flex;justify-content:space-between;gap:16px;border-bottom:1px solid #eeeee7;padding:10px 0}.bar{height:7px;border-radius:8px;background:#83a18c;margin:7px 0 12px}.muted{color:#66756b}#status{margin:18px 0}@media(max-width:650px){.grid{grid-template-columns:1fr}header{align-items:start;flex-direction:column}}
</style><main><header><div><a href="/">← Portfolio</a><h1>Aryan’s field report<span style="color:#c55d50">.</span></h1><p class="muted">A little insight into who’s exploring your world.</p></div><div><label for="days">Period </label><select id="days"><option value="7">7 days</option><option value="30" selected>30 days</option><option value="90">90 days</option></select> <button id="refresh">Refresh</button></div></header><p id="status" role="status">Loading…</p><div id="cards" class="cards"></div><section><h2>Daily page views</h2><div id="daily"></div></section><div class="grid"><section><h2>Sections explored</h2><div id="sections"></div></section><section><h2>Project & experience notes</h2><div id="notes"></div></section><section><h2>Traffic sources</h2><div id="sources"></div></section><section><h2>Devices</h2><div id="devices"></div></section><section><h2>Rotom & connections</h2><div id="actions"></div></section><section><h2>Page performance</h2><div id="performance"></div></section></div><p class="muted">Anonymous counts · UTC dates · 90-day retention · Do Not Track respected. Page views include repeat visits; these are not unique visitor counts. No cookies, visitor IDs, IP addresses, or chat text are stored. Browser blockers and bots can affect totals. Load and LCP are averages; CLS is an average layout-shift score.</p></main><script>
const el=id=>document.getElementById(id);function row(target,label,value){const r=document.createElement('div');r.className='row';const a=document.createElement('span'),b=document.createElement('strong');a.textContent=label;b.textContent=value;r.append(a,b);el(target).append(r)}
async function load(){el('status').textContent='Loading…';try{const response=await fetch('/api/analytics/report?days='+el('days').value);if(!response.ok)throw Error('Unable to load analytics. Sign in as Aryan and try again.');const {rows}=await response.json();const count=name=>rows.filter(r=>r.name===name).reduce((s,r)=>s+r.count,0);const metric=name=>{const data=rows.filter(r=>r.name===name),n=data.reduce((s,r)=>s+r.count,0);return n?data.reduce((s,r)=>s+r.total,0)/n:null};for(const id of ['cards','daily','sections','notes','sources','devices','actions','performance'])el(id).replaceChildren();for(const [label,value]of [['Page views',count('page_view')],['Rotom questions',count('rotom_question')],['Notes opened',count('notes_open')],['Contact clicks',count('contact_click')]]){const card=document.createElement('div');card.className='card';card.textContent=label;const n=document.createElement('strong');n.textContent=value;card.append(n);el('cards').append(card)}
function group(target,name,key='label'){const map={};rows.filter(r=>r.name===name).forEach(r=>map[r[key]]=(map[r[key]]||0)+r.count);const list=Object.entries(map).sort((a,b)=>b[1]-a[1]);if(!list.length)row(target,'No data yet','—');list.forEach(([label,n])=>row(target,label||'Direct',n))}group('daily','page_view','day');group('sections','section_view');group('notes','notes_open');group('sources','page_view');group('devices','page_view','device');for(const [label,name]of [['Rotom answers','rotom_success'],['Rotom errors','rotom_error'],['External link clicks','outbound_click'],['Email clicks','contact_click']])row('actions',label,count(name));for(const [label,name,scale,suffix]of [['Page load','load_ms',1000,' s'],['Largest contentful paint','lcp_ms',1000,' s'],['Layout shift','cls',1000,'']]){const n=metric(name);row('performance',label,n===null?'Awaiting samples':(n/scale).toFixed(2)+suffix)}el('status').textContent='Updated '+new Date().toLocaleTimeString()+' · Real traffic starts from this update.';}catch(e){el('status').textContent=e.message}}
el('days').onchange=load;el('refresh').onclick=load;load();
</script></html>`;
