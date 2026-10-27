// Server-only Groq adapter. Provider secrets never enter React or request bodies.
export function createModelProvider(env={}, {fetchImpl=fetch}={}){
 if(!env.GROQ_API_KEY){const error=new Error('Groq is not configured');error.code='AI_NOT_CONFIGURED';throw error;}
 const model=env.GROQ_MODEL||'openai/gpt-oss-20b';
 return {provider:'groq',async run(_model,input){
  const body={model,messages:input.messages,temperature:input.temperature??.35,stream:false,max_completion_tokens:1024};
  if(input.tools?.length)body.tools=input.tools.map(tool=>({type:'function',function:tool}));
  if(model.startsWith('openai/gpt-oss'))body.reasoning_effort='low';
  const response=await fetchImpl('https://api.groq.com/openai/v1/chat/completions',{
   method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${env.GROQ_API_KEY}`},body:JSON.stringify(body),signal:AbortSignal.timeout(20000)
  });
  if(!response.ok){const error=new Error(`AI request failed (${response.status})`);error.code=[401,403].includes(response.status)?'AI_AUTH_FAILED':response.status===429?'AI_RATE_LIMIT':'AI_UNAVAILABLE';throw error;}
  const result=await response.json();const message=result.choices?.[0]?.message;
  if(!message)throw new Error('AI service returned no message');
  return {response:typeof message.content==='string'?message.content:'',tool_calls:message.tool_calls||[]};
 }};
}
