import {getChatGPTUser} from '../chatgpt-auth';
import {json,readProgress} from '../../lib/progress-service';
import {selectPracticeBatch} from '../../lib/practice-core.mjs';
import fallbackDeck from '../../data/cards.json';
import scenes from '../../data/scenarios.json';
import archive from '../../data/transcripts.json';
export const dynamic='force-dynamic';
const practiceInstructions=`When Thea says "rebuild conversation from my current mi español list", use her actual synced familiarity. Pick the returned coherent batch of 2–6 reviewed phrases (most familiar stages first (3, then 2, then 1, then successfully reviewed 0); Essential before Useful within each stage, no unseen cards or optional Extras). Reconstruct the intention of the linked tutor scene, with one small plausible twist. ASR is noisy: apparent errors are evidence to inspect, not confirmed verbatim speech. Start in Spanish with ONE short tutor question that elicits the first, strongest selected target; adapt the suggested scene starter if needed, then wait. Gradually introduce the weaker selected targets after a confident opening. Do not reveal a model dialogue or the target phrase bank first. Let her answer rapidly in 1–3 sentences. Accept natural alternative wording. Give a brief corrected version and at most one useful explanation; if a target was missed, let her retry in context before continuing. Recycle the target later with a changed detail. After 6–10 exchanges, give a compact corrected conversation and 2–3 reusable patterns. Conversation work does NOT change familiarity, grades or due dates. Do not automatically publish new cards. Do not repeat private off-topic disclosures. This uses the last successful sync, not unread device-local progress.`;
const definitions=[
 {name:'get_current_practice_batch',description:'Read Thea’s current synced Mi Español familiarity and select a coherent phrase batch starting with the most familiar Essential phrases from a real tutor scenario. Use for “rebuild conversation from my current mi español list”. Does not change reviews. Returns sync time, selected phrases, scene and conversation protocol.',inputSchema:{type:'object',properties:{},additionalProperties:false}},
 {name:'get_progress_summary',description:'Read the current Mi Español account progress, sync time and stage counts without changing learning history.',inputSchema:{type:'object',properties:{},additionalProperties:false}},
 {name:'get_session_transcript',description:'Retrieve an archived Mi Español tutor transcript or list available sessions. Text retains ASR noise and marked privacy redactions; dates may be upload dates. Read in bounded sections; do not call invented practice dialogue an original quote.',inputSchema:{type:'object',properties:{session_id:{type:'string'},offset:{type:'integer',minimum:0},max_characters:{type:'integer',minimum:1,maximum:30000}},additionalProperties:false}}
];
async function currentCards(progress:any){
 let cards=fallbackDeck.cards;
 try{const res=await fetch('https://awashtype.github.io/mi-espanol/cards.json',{cache:'no-store'});if(res.ok){const d=await res.json() as any;if(Array.isArray(d.cards))cards=d.cards}}catch{}
 const deleted=new Set(progress?.deleted||[]);const saved=progress?.cards||[];
 return [...cards.map(c=>{const local=saved.find((x:any)=>x.id===c.id||x.published_id===c.id);return local?{...c,id:local.id,published_id:c.id}:c}),...saved.filter((c:any)=>!cards.some(x=>x.id===c.id||x.id===c.published_id))].filter(c=>!deleted.has(c.id));
}
export async function POST(request:Request){
 const user=await getChatGPTUser();if(!user)return json({error:'Sign in required'},401);
 let rpc:any;try{const raw=await request.text();if(raw.length>50000)return json({error:'Request too large'},413);rpc=JSON.parse(raw)}catch{return json({error:'Invalid JSON'},400)}
 const reply=(result:any)=>json({jsonrpc:'2.0',id:rpc.id??null,result});
 if(rpc.method==='server/discover')return reply({supportedVersions:['2026-07-28'],capabilities:{tools:{}}});
 if(rpc.method==='initialize')return reply({protocolVersion:'2026-07-28',capabilities:{tools:{}},serverInfo:{name:'Mi Español',version:'1.0.0'}});
 if(rpc.method==='notifications/initialized')return new Response(null,{status:204});
 if(rpc.method==='tools/list')return reply({tools:definitions});
 if(rpc.method!=='tools/call')return json({jsonrpc:'2.0',id:rpc.id??null,error:{code:-32601,message:'Method not found'}});
 try{
 const name=rpc.params?.name,args=rpc.params?.arguments||{};let result:any;
 if(name==='get_session_transcript'){
  if(!args.session_id)result={coverage:archive.coverage,sessions:archive.transcripts.map(({text,...meta}:any)=>meta)};
  else {const src=archive.transcripts.find(s=>s.id===args.session_id);if(!src)throw Error('Unknown session ID');
   const offset=Number.isInteger(args.offset)&&args.offset>=0?args.offset:0,limit=Number.isInteger(args.max_characters)?Math.min(30000,Math.max(1,args.max_characters)):12000;
   result={...src,text:src.text.slice(offset,offset+limit),offset,total_characters:src.text.length,next_offset:offset+limit<src.text.length?offset+limit:null};}
 }else{
  const snapshot=await readProgress(user.userId);const p=snapshot.progress||{cards:[],reviews:{},deleted:[]};
  if(name==='get_progress_summary'){
   const counts=[0,0,0,0];for(const r of Object.values(p.reviews) as any[])counts[r.stage>=0&&r.stage<=3?r.stage:0]++;
   result={lastSyncedAt:snapshot.updatedAt,reviewedCards:Object.keys(p.reviews).length,stages:counts,version:snapshot.version};
  }else if(name==='get_current_practice_batch'){
   const cards=await currentCards(p);const batch=selectPracticeBatch(cards,p.reviews,scenes.scenarios);
   result={lastSyncedAt:snapshot.updatedAt,batch,instructions:practiceInstructions,message:batch?'Use this batch for one question at a time.':snapshot.updatedAt?'No coherent reviewed batch yet. Do not substitute unseen cards; ask about a familiar topic or let Thea review a few related cards.':'Progress has not synced yet. Open the original Mi Español on the device holding progress and tap Connect account & keep my progress.'};
  }else throw Error('Unknown tool');
 }
 return reply({content:[{type:'text',text:JSON.stringify(result)}]});
 }catch(err){return reply({content:[{type:'text',text:err instanceof Error?err.message:'Could not read learning context'}],isError:true})}
}
