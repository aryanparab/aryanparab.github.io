import test from 'node:test';
import assert from 'node:assert/strict';
import {themeForHour,nextFact,funFacts} from '../src/personal.js';
import {localAnswer} from '../src/retrieval.js';
test('automatic themes switch at 7am and 7pm in visitor local time',()=>{
 for(const [hour,theme] of [[0,'night'],[6,'night'],[7,'day'],[12,'day'],[18,'day'],[19,'night'],[23,'night']])assert.equal(themeForHour(hour),theme);
});
test('random companion facts never repeat the previous entry',()=>{
 for(let i=0;i<funFacts.length;i++)for(const r of [0,.5,.9999]){const next=nextFact(i,()=>r);assert.notEqual(next,i);assert.ok(next>=0&&next<funFacts.length);}
});
test('new profile corrections and prior roles are searchable',()=>{
 assert.match(localAnswer('education').answer,/4.0\/4.0/);
 assert.match(localAnswer('Deloitte').answer,/100K\+/);
 assert.match(localAnswer('Springwood').answer,/WebEngage/);
 assert.match(localAnswer('Mahabharata').answer,/favorite text/);
 assert.match(localAnswer('GitHub contact').answer,/github.com\/aryanparab/);
});
