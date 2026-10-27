import test,{beforeEach,afterEach,mock} from 'node:test';
beforeEach(()=>mock.method(globalThis,'fetch',async()=>Response.json({choices:[{message:{content:'Aryan works on AI agents.'}}]})));
afterEach(()=>mock.restoreAll());
import assert from 'node:assert/strict';
import { retrieve,localAnswer } from '../src/retrieval.js';
import worker from '../server/worker.js';
test('retrieves education, skills, and distinct project facts',()=>{
 for(const [q,id] of [['What is his education?','education'],['Tell me about SuperMemory','supermemory'],['LevelDB performance','leveldb'],['robotics DAgger Hopper','robotics'],['Which hackathons did he win?','awards']]){
  assert.ok(retrieve(q).some(s=>s.id===id),q);
 }
});
test('unknown and empty questions do not invent answers',()=>{
 assert.equal(retrieve('favorite pizza topping').length,0);
 assert.equal(retrieve('').length,0);
 assert.match(localAnswer('favorite pizza topping').answer,/couldn’t find/);
});
test('answers carry verifiable resume references',()=>{
 const a=localAnswer('LevelDB performance');assert.equal(a.mode,'retrieval');assert.ok(a.sources[0].source);assert.match(a.answer,/31.2/);
});
const env={ALLOWED_ORIGINS:'https://example.com',QUESTION_LIMITER:{limit:async()=>({success:true})},GROQ_API_KEY:'test-only'};
const req=(question,origin='https://example.com')=>new Request('https://worker.example',{method:'POST',headers:{Origin:origin,'CF-Connecting-IP':'127.0.0.1'},body:JSON.stringify({question})});
test('worker rejects other origins and invalid questions',async()=>{
 assert.equal((await worker.fetch(req('hello','https://other.com'),env)).status,403);
 assert.equal((await worker.fetch(req(''),env)).status,400);
 assert.equal((await worker.fetch(req('a'.repeat(601)),env)).status,400);
});
test('worker returns generated grounded answer with sources',async()=>{
 const r=await worker.fetch(req('What AI agents has Aryan built?'),env);assert.equal(r.status,200);
 const result=await r.json();assert.equal(result.mode,'rag');assert.ok(result.sources.length>0);
});
test('worker enforces rate limit and abstains on missing evidence',async()=>{
 assert.equal((await worker.fetch(req('AI'),{...env,QUESTION_LIMITER:{limit:async()=>({success:false})}})).status,429);
 const result=await (await worker.fetch(req('favorite pizza topping'),env)).json();assert.equal(result.mode,'rag');assert.equal(result.sources.length,0);
});
