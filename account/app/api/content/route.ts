import {getChatGPTUser} from '../../chatgpt-auth';
import {json} from '../../../lib/progress-service';
export const dynamic='force-dynamic';
export async function GET(request:Request){
 if(!await getChatGPTUser())return json({error:'Sign in required'},401);
 const file=new URL(request.url).searchParams.get('file');
 if(!['cards.json','mi_espanol_google_audio.json'].includes(file||''))return json({error:'Unknown file'},400);
 const res=await fetch('https://awashtype.github.io/mi-espanol/'+file,{cache:'no-store'});
 if(!res.ok)return json({error:'Published content temporarily unavailable'},502);
 return new Response(res.body,{headers:{'Content-Type':'application/json','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
}
