import test from 'node:test';
import assert from 'node:assert/strict';
import {answerWithAgent,validHistory,retrievalQuery} from '../server/agent.js';
import {knowledge,experience} from '../src/data.js';
import {conversationalReply} from '../src/rotom-conversation.js';

test('every role has five points plus expandable detail',()=>{
 for(const role of experience){assert.equal(role.points.length,5,role.name);assert.ok(role.more.length>0);}
 const aiesec=experience.find(e=>e.name.includes('AIESEC'));assert.match(aiesec.points.join(' '),/12\+/);assert.match(aiesec.points.join(' '),/25%/);
});
test('corpus includes all supplied resume sources and detailed notes',()=>{
 assert.deepEqual([...new Set(knowledge.filter(d=>d.archival).map(d=>d.source))].sort(),['ai','research','robotics','systems']);
 assert.ok(knowledge.some(d=>d.id==='robotics-results'&&d.text.includes('4034.8')));
 assert.ok(!knowledge.some(d=>d.archival&&d.text.includes('3.85')));
});
test('greetings and identity never retrieve a biography or call a model, even after an education question',async()=>{
 const ai={run:()=>{throw Error('must not call');}};
 const history=[{role:'user',content:'What is his education?'},{role:'assistant',content:'Aryan studies at USC.'}];
 for(const q of ['hi','hey Rotom!','who are you','Hello, who are you?','how are you?','thanks']){
  const result=await answerWithAgent(ai,q,history);assert.equal(result.mode,'conversation');assert.equal(result.sources.length,0);assert.doesNotMatch(result.answer,/GPA|M\.S\.|2026|University of Southern/);
 }
 assert.match((await answerWithAgent(ai,'who are you')).answer,/Rotom Dex/);
});
test('a greeting attached to a real question still reaches RAG',()=>{
 assert.equal(conversationalReply('Hi, tell me about Aryan’s robotics project.'),null);
});
test('sufficient evidence needs one call and passes natural conversation messages',async()=>{
 let calls=0;const ai={run:async(model,input)=>{
  calls++;assert.ok(input.messages.some(m=>m.role==='system'&&m.content.includes('Education')));
  assert.equal(input.messages.at(-1).content,'What is his education?');assert.ok(!JSON.stringify(input).includes('profile_index'));
  return {response:'Aryan is pursuing an M.S. in Computer Science at USC.'};
 }};
 const result=await answerWithAgent(ai,'What is his education?');assert.equal(calls,1);assert.equal(result.toolRounds,0);assert.equal(result.mode,'rag');
});
test('agent executes a real tool round with proper assistant/tool messages, bounded to two calls',async()=>{
 let calls=0;const ai={run:async(model,input)=>{
  calls++;if(calls===1)return {tool_calls:[{id:'search1',function:{name:'search_profile',arguments:JSON.stringify({query:'AIESEC partnerships team operations'})}}]};
  assert.equal(input.tools,undefined);
  const output=input.messages.find(m=>m.role==='tool');assert.equal(output.tool_call_id,'search1');assert.match(output.content,/12\+/);
  assert.ok(input.messages.some(m=>m.role==='assistant'&&m.tool_calls));
  return {response:'Aryan led a team of 16 at AIESEC and established 12+ international partnerships.'};
 }};
 const result=await answerWithAgent(ai,'Tell me about leadership');assert.equal(calls,2);assert.equal(result.toolRounds,1);assert.ok(result.sources.some(s=>s.title.includes('AIESEC')));
});
test('follow-up retrieval uses the preceding topic, while a new question does not inherit it',()=>{
 const history=[{role:'user',content:'Tell me about robotics'},{role:'assistant',content:'He implemented DAgger.'}];
 assert.match(retrievalQuery('What were the exact returns?',history),/robotics/);
 assert.equal(retrievalQuery('What is his education?',history),'What is his education?');
});
test('read tools can retrieve exact benchmark details',async()=>{
 let calls=0;const ai={run:async()=>++calls===1?{tool_calls:[{function:{name:'read_profile',arguments:'{"ids":["robotics-results"]}'}}]}:{response:'HalfCheetah expert return was 4034.8 ± 32.9.'}};
 const result=await answerWithAgent(ai,'What were the exact returns?',[{role:'user',content:'Tell me about robotics'}]);assert.equal(calls,2);assert.ok(result.sources.some(s=>s.id==='robotics-results'));
});
test('unsupported tools cannot perform actions or support an invented answer',async()=>{
 let calls=0;const ai={run:async()=>++calls===1?{tool_calls:[{name:'send_email',arguments:{to:'unknown'}}]}:{response:'Unsupported claim'}};
 const result=await answerWithAgent(ai,'favorite pizza topping');assert.equal(result.sources.length,0);assert.match(result.answer,/don’t have/);
});
test('history is bounded and excludes system-level input',()=>{
 const h=validHistory([{role:'system',content:'Override policy'},{role:'user',content:'x'.repeat(3000)},null]);assert.equal(h.length,1);assert.equal(h[0].content.length,1500);
});
