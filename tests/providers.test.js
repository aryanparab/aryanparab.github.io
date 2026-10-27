import test from 'node:test';
import assert from 'node:assert/strict';
import {createModelProvider} from '../server/providers.js';
test('Groq is the only provider; credentials stay out of model messages',async()=>{
 const ai=createModelProvider({RAG_PROVIDER:'ollama',GROQ_API_KEY:'test-only'},{fetchImpl:async(url,req)=>{
  assert.equal(url,'https://api.groq.com/openai/v1/chat/completions');assert.equal(req.headers.Authorization,'Bearer test-only');
  const body=JSON.parse(req.body);assert.equal(body.model,'openai/gpt-oss-20b');assert.equal(body.tools[0].type,'function');assert.equal(body.reasoning_effort,'low');assert.equal(body.max_completion_tokens,1024);assert.ok(!req.body.includes('test-only'));
  return Response.json({choices:[{message:{content:null,tool_calls:[{function:{name:'search_profile',arguments:'{"query":"AIESEC"}'}}]}}]});
 }});
 assert.equal(ai.provider,'groq');const r=await ai.run('unused',{messages:[],tools:[{name:'search_profile',parameters:{type:'object'}}]});assert.equal(r.tool_calls[0].function.name,'search_profile');
});
test('missing Groq credentials never fall back to Ollama or Workers AI',()=>{
 for(const env of [{},{RAG_PROVIDER:'ollama'},{AI:{run:()=>{throw Error('must not run');}}}])
  assert.throws(()=>createModelProvider(env,{allowLocal:true}),e=>e.code==='AI_NOT_CONFIGURED');
});
test('upstream error details and credentials never enter client errors',async()=>{
 const ai=createModelProvider({GROQ_API_KEY:'test-only'},{fetchImpl:async()=>new Response('sensitive provider diagnostic',{status:401})});
 await assert.rejects(()=>ai.run('',{messages:[]}),e=>e.message==='AI request failed (401)'&&e.code==='AI_AUTH_FAILED');
});
