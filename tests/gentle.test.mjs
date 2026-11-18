import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import {selectGentleCards} from '../practice-core.mjs';

const date='2026-11-17';
function review({introducedOn='2026-10-01',stage=0,due='2026-11-01',completed=false}={}){
  return {introducedOn,stage,dirs:{
    es:{due:stage===0?due:null,last:completed?date:null},
    en:{due:stage!==0?due:null,last:completed?date:null}
  }};
}
test('Quick Refresh includes introduced cards only, due first, with Essential before Useful',()=>{
  const cards=[
    {id:'notDue',priority:'essential'},
    {id:'dueUseful',priority:'useful'},
    {id:'dueEssential',priority:'essential'},
    {id:'unseen',priority:'essential'},
    {id:'dueExtra',priority:'extra'},
    {id:'completed',priority:'essential'}
  ];
  const reviews={
    notDue:review({due:'2026-12-01'}),
    dueUseful:review({stage:3}),
    dueEssential:review(),
    dueExtra:review(),
    completed:review({due:'2026-12-03',completed:true})
  };
  const frozen=structuredClone(reviews),frozenCards=structuredClone(cards);
  const selected=selectGentleCards(cards,reviews,date);
  assert.deepEqual(selected.map(c=>c.id),['dueEssential','dueUseful','dueExtra','notDue','completed']);
  assert.deepEqual(reviews,frozen,'reading cards must not grade, reschedule, or mutate familiarity');
  assert.deepEqual(cards,frozenCards,'original ordering must not change');
});
test('Quick Refresh is distinct from graded study and survives offline shell refresh',()=>{
  const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
  const worker=readFileSync(new URL('../sw.js',import.meta.url),'utf8');
  for(const id of ['gentleIntro','gentlePass','gentleStart','gentleNext','gentleContinue','gentleExit']){
    assert.ok(html.includes('id="'+id+'"'),id+' exists');
  }
  const script=html.split('<script type="module">')[1].split('</script>')[0];
  assert.doesNotThrow(()=>new Function(script.replace(/^\s*import[^\n]*\n/,'')));
  assert.ok(script.includes("const GENTLE_STORAGE='mi-espanol-gentle-pass-v1'"));
  assert.ok(script.includes("if(gentleActive){speechLastKey=''"));
  for(const id of ['gentleAutoAudio','gentleReplay','gentleAudioStatus','gentleSettingsStart','gentleLength','todayReviewLimit','todayNewLimit']){
    assert.ok(html.includes('id="'+id+'"'),id+' exists');
  }
  assert.ok(script.includes("const b64=gentleClips.get(id)||await getClip(audioKey(c.es))"));
  assert.ok(script.includes("const limitedDue=scope==='due'?due.slice(0,dueReviewSlots()):due"));
  assert.ok(script.includes("state.daily.reviewLimit=review==='all'?'all':Number(review)"));
  assert.ok(script.includes("if(!state.daily)state.daily={date:today(),newLimit:20,reviewLimit:'all'}"));
  assert.ok(html.includes('#studyPage.gentle-mode > :not(#gentleIntro):not(#gentlePass)'));
  assert.ok(worker.includes("mi-espanol-shell-v16"));
});
