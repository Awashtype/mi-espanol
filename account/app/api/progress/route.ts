import {getChatGPTUser} from '../../chatgpt-auth';
import {json,readProgress,writeProgress,validProgress} from '../../../lib/progress-service';
export const dynamic='force-dynamic';
export async function GET(){
 const user=await getChatGPTUser();if(!user)return json({error:'Sign in required'},401);
 return json(await readProgress(user.userId));
}
export async function PUT(request:Request){
 const user=await getChatGPTUser();if(!user)return json({error:'Sign in required'},401);
 if(request.headers.get('origin')!==new URL(request.url).origin)return json({error:'Origin rejected'},403);
 if(!request.headers.get('content-type')?.startsWith('application/json'))return json({error:'JSON required'},415);
 if(Number(request.headers.get('content-length'))>2000000)return json({error:'Progress is too large'},413);
 let body:any;try{const raw=await request.text();if(raw.length>2000000)return json({error:'Progress is too large'},413);body=JSON.parse(raw)}catch{return json({error:'Invalid JSON'},400)}
 if(!Number.isSafeInteger(body.baseVersion)||body.baseVersion<0||!validProgress(body.progress))return json({error:'Invalid progress'},400);
 const result=await writeProgress(user.userId,body.baseVersion,body.progress);
 return result?json(result):json({error:'Another device saved first; merge and retry'},409);
}
