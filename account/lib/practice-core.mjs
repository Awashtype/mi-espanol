// Shared by the offline notebook and the private account service.
export function selectPracticeBatch(cards,reviews,scenarios,recent=[]){
  const familiar=cards.filter(c=>{
    const r=reviews[c.id];
    return c.priority!=='extra'&&r&&Object.values(r.dirs||{}).some(d=>d.count>0&&['good','easy'].includes(d.lastGrade));
  });
  const scored=scenarios.map(scene=>{
    const pool=familiar.filter(c=>scene.card_ids.includes(c.published_id||c.id));
    const rank=c=>{
      const r=reviews[c.id];
      return (r.stage===1||r.stage===2?0:r.stage===0?2:4)+(c.priority==='essential'?0:1)+(recent.includes(c.id)?8:0);
    };
    pool.sort((a,b)=>rank(a)-rank(b)||scene.card_ids.indexOf(a.published_id||a.id)-scene.card_ids.indexOf(b.published_id||b.id));
    const selected=pool.slice(0,6);
    return {scene,cards:selected,score:selected.length*10-selected.reduce((n,c)=>n+rank(c),0)};
  }).filter(b=>b.cards.length>=2).sort((a,b)=>b.score-a.score);
  return scored[0]||null;
}

function reviewTime(r){
  if(Number.isFinite(r?.modifiedAt))return r.modifiedAt;
  const last=Object.values(r?.dirs||{}).map(d=>Date.parse((d.last||'')+'T12:00:00Z')||0);
  return Math.max(0,...last);
}
export function mergeProgress(a={},b={}){
  const resetAt=Math.max(Number(a.resetAt)||0,Number(b.resetAt)||0);
  const deleted=[...new Set([...(a.deleted||[]),...(b.deleted||[])])];
  const reviews={};
  for(const id of new Set([...Object.keys(a.reviews||{}),...Object.keys(b.reviews||{})])){
    if(deleted.includes(id))continue;
    const x=a.reviews?.[id],y=b.reviews?.[id];
    // A later successful sync may not replace a newer offline review with an old snapshot.
    const r=!x?y:!y?x:reviewTime(x)>reviewTime(y)?x:reviewTime(y)>reviewTime(x)?y:
      JSON.stringify(x)>JSON.stringify(y)?x:y;
    if(!resetAt||reviewTime(r)>resetAt)reviews[id]=r;
  }
  const map=new Map();
  for(const c of [...(a.cards||[]),...(b.cards||[])]){
    if(!c||typeof c.id!=='string'||deleted.includes(c.id))continue;
    const old=map.get(c.id);
    if(!old||(c.content_revision||0)>=(old.content_revision||0))map.set(c.id,c);
  }
  return {cards:[...map.values()],reviews,deleted,resetAt};
}
