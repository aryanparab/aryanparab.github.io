import { knowledge } from './data.js';
const stop = new Set('a an the is are was were be do does did can could would will what which who how tell me about his he him aryan parab you your has have and or of in to for with i s favorite favourite'.split(' '));
const aliases = { hackathons:'hackathon', wins:'winner hackathon', win:'winner hackathon', leadership:'aiesec team partnerships', leader:'aiesec team', volunteer:'aiesec', hobbies:'interests', likes:'interests', hobby:'interests', interests:'personal interests', soccer:'football interests', certifications:'certifications', background:'profile education', study:'education', studied:'education', university:'education', school:'education', degree:'education', contact:'email linkedin', reach:'email contact', work:'cadence research', job:'cadence research', internship:'cadence', intern:'cadence', robot:'robotics', robotic:'robotics dagger', robotics:'dagger mujoco robotics', coding:'languages', stack:'technologies skills', awards:'hackathon', award:'hackathon', achievements:'hackathon', achievement:'hackathon', llm:'ai agents', databases:'database leveldb', speed:'leveldb', memory:'supermemory', graduation:'education december 2026' };
function tokens(text) { return text.toLowerCase().replace(/[^a-z0-9+#.]/g,' ').split(/\s+/).filter(t=>t.length>1&&!stop.has(t)); }
export function retrieve(question, limit=3) {
 const original=tokens(question); if(!original.length)return [];
 const query=[...new Set(original.flatMap(t=>[t,...tokens(aliases[t]||'')]))];
 const docs=knowledge.map(d=>tokens(d.title+' '+d.text));
 return knowledge.map((doc,i)=>{
 let score=0; for(const q of query){const df=docs.filter(ts=>ts.includes(q)).length; const tf=docs[i].filter(t=>t===q).length; if(tf)score+=(Math.log(1+(knowledge.length-df+.5)/(df+.5)) * tf*2.2/(tf+1.2*(.25+.75*docs[i].length/70))) * (tokens(doc.title).includes(q)?1.8:1);}
 return {...doc,score:score*(doc.archival?.65:1.25)};
 }).filter(d=>d.score>1.2).sort((a,b)=>b.score-a.score).slice(0,limit);
}
export function localAnswer(question) {
 const sources=retrieve(question);
 return {mode:'retrieval', answer:sources.length?sources.map(s=>s.text).join('\n\n'):"I couldn’t find that in Aryan’s profile. Try asking about his experience, education, skills, or a specific project. For anything else, email amparab@usc.edu.",sources};
}
