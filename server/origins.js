export function allowedOrigin(request,env){
 const origin=request.headers.get('Origin');
 const configured=(env.ALLOWED_ORIGINS||'').split(',').map(s=>s.trim()).filter(Boolean);
 return origin&&(origin===new URL(request.url).origin||configured.includes(origin))?origin:null;
}
export function corsHeaders(origin){return {'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Vary':'Origin'};}
