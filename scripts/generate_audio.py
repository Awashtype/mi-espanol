import json, os, time, urllib.request, urllib.error
from pathlib import Path
root=Path(__file__).resolve().parent.parent
voice="es-US-Chirp3-HD-Aoede"
cards=json.loads((root/"cards.json").read_text())["cards"]
phrases=list(dict.fromkeys(c["es"].strip() for c in cards if c.get("es")))
path=root/"mi_espanol_google_audio.json"
pack=json.loads(path.read_text()) if path.exists() else {}
old={c["es"]:c["audio"] for c in pack.get("items",[]) if c.get("audio")} if pack.get("voice")==voice else {}
for phrase in phrases:
    if phrase in old: continue
    body=json.dumps({"input":{"text":phrase},"voice":{"languageCode":"es-US","name":voice},"audioConfig":{"audioEncoding":"MP3"}},ensure_ascii=False).encode()
    req=urllib.request.Request("https://texttospeech.googleapis.com/v1/text:synthesize",body,{
        "Authorization":"Bearer "+os.environ["GOOGLE_OAUTH_ACCESS_TOKEN"],
        "x-goog-user-project":os.environ["GOOGLE_CLOUD_PROJECT"],
        "Content-Type":"application/json; charset=utf-8"})
    for retry in range(5):
        try:
            with urllib.request.urlopen(req,timeout=60) as response:
                old[phrase]=json.load(response)["audioContent"]
            break
        except urllib.error.HTTPError as err:
            if err.code not in (429,500,502,503,504) or retry==4: raise
            time.sleep(2**retry)
    print("Generated:",phrase,flush=True)
path.write_text(json.dumps({"format":"mi-espanol-audio-v1","voice":voice,"items":[{"es":p,"audio":old[p]} for p in dict.fromkeys([*old,*phrases])]},ensure_ascii=False))
