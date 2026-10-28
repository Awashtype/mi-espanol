import { env } from 'cloudflare:workers';
export function json(value:unknown,status=200){return Response.json(value,{status,headers:{'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}})}
export async function readProgress(userId:string){
  const row=await env.DB!.prepare('SELECT progress_json, version, updated_at FROM progress WHERE user_id = ?').bind(userId).first<{progress_json:string;version:number;updated_at:string}>();
  return row?{progress:JSON.parse(row.progress_json),version:row.version,updatedAt:row.updated_at}:{progress:null,version:0,updatedAt:null};
}
export function validProgress(p:any){
  if(!p||!Array.isArray(p.cards)||p.cards.length>5000||!p.reviews||typeof p.reviews!=='object'||Array.isArray(p.reviews)||!Array.isArray(p.deleted)||p.deleted.length>10000)return false;
  if(Object.keys(p.reviews).length>5000||p.deleted.some((id:any)=>typeof id!=='string'||id.length>150))return false;
  if(p.resetAt!==undefined&&(!Number.isFinite(p.resetAt)||p.resetAt<0||p.resetAt>Date.now()+60000))return false;
  for(const c of p.cards)if(!c||typeof c.id!=='string'||c.id.length>150||typeof c.en!=='string'||typeof c.es!=='string'||c.en.length>20000||c.es.length>20000)return false;
  for(const r of Object.values(p.reviews) as any[])if(!r||!r.dirs||typeof r.dirs!=='object'||(r.modifiedAt!==undefined&&(!Number.isFinite(r.modifiedAt)||r.modifiedAt>Date.now()+60000)))return false;
  return true;
}
export async function writeProgress(userId:string,baseVersion:number,p:any){
  const now=new Date().toISOString();
  const result=await env.DB!.prepare('INSERT INTO progress (user_id,progress_json,version,updated_at) VALUES (?,?,1,?) ON CONFLICT(user_id) DO UPDATE SET progress_json=excluded.progress_json, version=progress.version+1, updated_at=excluded.updated_at WHERE progress.version=? RETURNING version').bind(userId,JSON.stringify(p),now,baseVersion).first<{version:number}>();
  return result?{version:result.version,updatedAt:now}:null;
}
