// Shared by the offline notebook and the private account service.
export function selectPracticeBatch(cards,reviews,scenarios,recent=[]){
  const familiar=cards.filter(c=>{
    const r=reviews[c.id];
    return c.priority!=='extra'&&r&&Object.values(r.dirs||{}).some(d=>d.count>0&&['good','easy'].includes(d.lastGrade));
  });
  // Familiarity is primary; Essential wins only within the same stage.
  // Rotation breaks ties without sending shakier phrases to the front.
  const tier=c=>{
    const stage=reviews[c.id].stage;
    const strength=Number.isInteger(stage)&&stage>=0&&stage<=3?stage:0;
    return (3-strength)*2+(c.priority==='essential'?0:1);
  };
  const scored=scenarios.map(scene=>{
    const pool=familiar.filter(c=>scene.card_ids.includes(c.published_id||c.id));
    pool.sort((a,b)=>tier(a)-tier(b)||Number(recent.includes(a.id))-Number(recent.includes(b.id))||scene.card_ids.indexOf(a.published_id||a.id)-scene.card_ids.indexOf(b.published_id||b.id));
    const selected=pool.slice(0,6);
    // At most six cards: base 7 makes a stronger tier outweigh every weaker tier.
    const score=selected.reduce((n,c)=>n+7**(7-tier(c)),0)-selected.filter(c=>recent.includes(c.id)).length/100;
    return {scene,cards:selected,score};
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
  const all=[...(a.cards||[]),...(b.cards||[])];
  const canonical=new Map(all.map(c=>[c.id,c.published_id||c.id]));
  const preferred=new Map();
  for(const c of all)if(!preferred.has(c.published_id||c.id))preferred.set(c.published_id||c.id,c.id);
  const key=id=>canonical.get(id)||id;
  const deletedKeys=new Set([...(a.deleted||[]),...(b.deleted||[])].map(key));
  const deleted=[...new Set([...(a.deleted||[]),...(b.deleted||[]),...deletedKeys])];
  const byConcept=new Map();
  for(const source of [a,b])for(const [id,r] of Object.entries(source.reviews||{})){
    const concept=key(id);if(deletedKeys.has(concept)||resetAt&&reviewTime(r)<=resetAt)continue;
    const old=byConcept.get(concept);
    if(!old||reviewTime(r)>reviewTime(old)||reviewTime(r)===reviewTime(old)&&JSON.stringify(r)>JSON.stringify(old))byConcept.set(concept,r);
  }
  const reviews=Object.fromEntries([...byConcept].map(([concept,r])=>[preferred.get(concept)||concept,r]));
  const map=new Map();
  for(const c of all){
    if(!c||typeof c.id!=='string'||deletedKeys.has(key(c.id)))continue;
    const concept=key(c.id),old=map.get(concept),id=preferred.get(concept)||c.id;
    if(!old||(c.content_revision||0)>=(old.content_revision||0))map.set(concept,{...c,id,...(id!==concept?{published_id:concept}:{})});
  }
  return {cards:[...map.values()],reviews,deleted,resetAt};
}
