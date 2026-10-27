import {test} from 'node:test';
import assert from 'node:assert/strict';
import {analytics,owner} from '../server/analytics.js';
const env={ANALYTICS_OWNER_EMAIL:'owner@example.com'};
const req=(path,options={})=>new Request('https://portfolio.test'+path,options);
test('analytics reports require authenticated owner identity',async()=>{
 assert.equal(owner(req('/analytics'),env),false);
 assert.equal((await analytics(req('/api/analytics/report'),env)).status,403);
 assert.equal(owner(req('/analytics',{headers:{'oai-authenticated-user-email':'other@example.com','oai-authenticated-user-id':'id'}}),env),false);
 assert.equal(owner(req('/analytics',{headers:{'oai-authenticated-user-email':'owner@example.com','oai-authenticated-user-id':'id'}}),env),true);
});
test('collector validates origin and event before writing bounded aggregate',async()=>{
 const writes=[];const DB={prepare(sql){return {bind(...values){return {async run(){writes.push({sql,values})}}}}}};
 const post=(body,origin='https://portfolio.test')=>req('/api/analytics/event',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(body)});
 const data={name:'page_view',device:'mobile',label:'direct'};
 assert.equal((await analytics(post(data,'https://other.test'),{DB})).status,403);
 assert.equal((await analytics(post({...data,name:'private_chat'}),{DB})).status,400);
 assert.equal(writes.length,0);
 assert.equal((await analytics(post({...data,value:1e10}),{DB})).status,204);
 assert.match(writes[0].sql,/ON CONFLICT/);assert.equal(writes[0].values.at(-1),300000);
 assert.match(writes[1].sql,/DELETE/);
});
test('Do Not Track requests do not write data',async()=>{
 const r=req('/api/analytics/event',{method:'POST',headers:{Origin:'https://portfolio.test',DNT:'1'},body:'{}'});
 assert.equal((await analytics(r,{})).status,204);
});
