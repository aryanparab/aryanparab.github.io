import {answerWithAgent,validHistory} from './agent.js';
import {createModelProvider} from './providers.js';
import {conversationalReply} from '../src/rotom-conversation.js';
export default {
 async fetch(request,env){
  const origin=request.headers.get('Origin');
  const allowed=(env.ALLOWED_ORIGINS||'').split(',').map(s=>s.trim());
  const cors={'Access-Control-Allow-Origin':origin||'','Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Vary':'Origin'};
  const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{...cors,'Content-Type':'application/json','Cache-Control':'no-store'}});
  if(!origin||!allowed.includes(origin))return new Response('Origin not allowed',{status:403});
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
  if(request.method!=='POST')return json({error:'Use POST'},405);
  const ip=request.headers.get('CF-Connecting-IP');
  if(!ip||!env.QUESTION_LIMITER)return json({error:'Rate limiter unavailable'},503);
  const {success}=await env.QUESTION_LIMITER.limit({key:ip});
  if(!success)return json({error:'Please try again in a minute'},429);
  try{
   const body=await request.text();if(body.length>16000)return json({error:'Request too large'},413);
   const {question,history}=JSON.parse(body);
   if(typeof question!=='string'||!question.trim()||question.length>600)return json({error:'Question must be 1–600 characters'},400);
   const social=conversationalReply(question);if(social)return json(social);
   let ai;try{ai=createModelProvider(env);}catch{return json({error:'Groq needs a valid API key',code:'AI_NOT_CONFIGURED'},503);}
   return json(await answerWithAgent(ai,question.trim(),validHistory(history)));
  }catch{return json({error:'Unable to answer right now'},503);}
 }
};
