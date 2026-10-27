import {test} from 'node:test';
import assert from 'node:assert/strict';
import {analytics} from '../server/analytics.js';
import {allowedOrigin} from '../server/origins.js';
test('only exact GitHub origin and same-origin requests are allowed',()=>{
 const env={ALLOWED_ORIGINS:'https://aryanparab.github.io'};
 for(const origin of ['https://aryanparab.github.io','https://backend.test'])assert.equal(allowedOrigin(new Request('https://backend.test/api/profile',{headers:{Origin:origin}}),env),origin);
 for(const origin of ['https://evil.test','https://aryanparab.github.io.evil.test'])assert.equal(allowedOrigin(new Request('https://backend.test/api/profile',{headers:{Origin:origin}}),env),null);
});
test('GitHub analytics preflight permits POST but does not expose private reports',async()=>{
 const headers={Origin:'https://aryanparab.github.io'};const env={ALLOWED_ORIGINS:headers.Origin};
 const response=await analytics(new Request('https://backend.test/api/analytics/event',{method:'OPTIONS',headers}),env);
 assert.equal(response.status,204);assert.equal(response.headers.get('Access-Control-Allow-Origin'),headers.Origin);
 assert.equal((await analytics(new Request('https://backend.test/api/analytics/report',{headers}),env)).status,403);
});
