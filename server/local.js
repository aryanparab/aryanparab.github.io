import {createServer} from 'node:http';
import {pathToFileURL} from 'node:url';
import {answerWithAgent,validHistory} from './agent.js';
import {createModelProvider} from './providers.js';
import {conversationalReply} from '../src/rotom-conversation.js';

export function createLocalHandler(env={}){
 const limits=new Map();
 const origins=(env.ALLOWED_ORIGINS||'http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174').split(',').map(s=>s.trim());
 return async function handle(req,res){
  const origin=req.headers.origin;
  if(origin&&!origins.includes(origin)){res.writeHead(403);res.end('Origin not allowed');return;}
  const headers={'Content-Type':'application/json','Cache-Control':'no-store',...(origin?{'Access-Control-Allow-Origin':origin,'Vary':'Origin'}:{}),'Access-Control-Allow-Headers':'Content-Type','Access-Control-Allow-Methods':'POST, OPTIONS'};
  const send=(status,data)=>{if(!res.writableEnded){res.writeHead(status,headers);res.end(JSON.stringify(data));}};
  if(req.method==='OPTIONS'){res.writeHead(204,headers);res.end();return;}
  if(req.method==='GET'){send(200,{status:'ready',provider:'groq',connection:env.GROQ_API_KEY?'direct':'hosted'});return;}
  if(req.method!=='POST'){send(405,{error:'Use POST'});return;}
  const now=Date.now(),ip=req.socket.remoteAddress||'local';
  for(const [key,value]of limits)if(now-value.start>60000)limits.delete(key);
  const entry=limits.get(ip)||{start:now,count:0};entry.count++;limits.set(ip,entry);
  if(entry.count>10){send(429,{error:'Try again in a minute'});return;}
  try{
   let body='';for await(const chunk of req){body+=chunk;if(body.length>16000){send(413,{error:'Request too large'});return;}}
   let data;try{data=JSON.parse(body);}catch{send(400,{error:'Invalid JSON'});return;}
   const {question,history}=data;
   if(typeof question!=='string'||!question.trim()||question.length>600){send(400,{error:'Question must be 1–600 characters'});return;}
   const social=conversationalReply(question);if(social){send(200,social);return;}
   if(!env.GROQ_API_KEY){
    const upstream=await fetch(env.ROTOM_HOSTED_API_URL||'https://aryan-parab-pokedex.kindbow12.chatgpt.site/api/profile',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:question.trim(),history:validHistory(history)}),signal:AbortSignal.timeout(40000)});
    const result=await upstream.json();
    if(!upstream.ok){send(upstream.status,{error:'Hosted Groq connection is unavailable',code:result.code||'AI_UNAVAILABLE'});return;}
    send(200,result);return;
   }
   send(200,await answerWithAgent(createModelProvider(env),question.trim(),validHistory(history)));
  }catch{send(503,{error:'AI service unavailable. Check the Groq connection.'});}
 };
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 try{process.loadEnvFile?.('.env.local');}catch(error){if(error.code!=='ENOENT')throw error;}
 const port=Number(process.env.PORT||8787);
 createServer(createLocalHandler(process.env)).listen(port,'127.0.0.1',()=>console.log(`Rotom API ready at http://127.0.0.1:${port}`));
}
