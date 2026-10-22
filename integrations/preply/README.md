# Automatic Preply lessons → Mi Español

This Mac integration records a registered Preply browser classroom with OBS, sends the
finished recording to local transcription, curates new flashcards with a local text model,
and appends them to `Awashtype/mi-espanol/cards.json`. The existing **Generate Spanish
Audio** GitHub workflow then generates only missing pronunciation clips. Mi Español
fetches the new cards when opened online; open it and wait for audio to cache before
going offline. This does not synchronize review progress between devices.

**Written and tested with mocked service boundaries; not yet tested on Thea's Mac.**
OBS audio permissions, the classroom address, browser Automation permission, actual
transcription accuracy, the local model's Spanish judgments, and the GitHub audio build
must be checked during setup. No recording or background task has been installed by
adding these source files to GitHub.

## What triggers recording

The integration checks the URLs of all tabs in **one chosen browser** every five seconds.
It starts when an exactly registered classroom path is open, including in a background
tab. Query strings are ignored and never stored. It does **not** inspect the page, read
chat messages, use the Preply API, or detect the actual call's connected state.

Close the classroom tab when class ends. Recording stops after 60 seconds without a
matching tab, or after the configured maximum (100 minutes by default). It will not
immediately restart after reaching the maximum or receiving a stop request; leave the
classroom and reopen it for another session. Leaving a classroom tab open overnight can
start a recording when the agent first launches: close old classroom tabs before enabling.
Rescheduling works when the classroom URL is unchanged. If Preply uses a different path
for another lesson, register that actual URL too. We intentionally do not guess a broad
Preply URL pattern that might record on a profile, messages, or scheduling page.

Supported browsers: Chrome, Safari, Brave, and Edge, using their macOS AppleScript tab
interfaces. The Mac must be logged in, awake, and connected. The agent starts at login
after installation; it cannot wake a sleeping Mac or run while the Mac is shut down.

## One-time prerequisites

- macOS 13+ and Python 3.9+.
- OBS Studio with a dedicated **Mi Espanol** scene. Include microphone input and **only
  the browser application's audio**, not all desktop audio. Use a black/empty video scene
  if you only want audio. Disable global audio devices that duplicate the scene sources.
  In OBS Advanced Audio Properties, put BOTH sources on the same enabled recording track
  (normally track 1). FFmpeg extracts the first audio stream. Use headphones to avoid echo.
- OBS → Tools → WebSocket Server Settings: enable server, leave port **4455**, and enable
  password authentication. The integration connects only to `127.0.0.1`; do not expose
  this server to the internet. The password is stored in macOS Keychain during setup.
- FFmpeg and GitHub CLI (`ffmpeg` and `gh`). If you already use Homebrew:

  ```bash
  brew install ffmpeg gh
  gh auth login
  ```

  Sign in with the GitHub account that can write `Awashtype/mi-espanol`. No credentials
  belong in this repository. No GitHub Actions secret is needed for lesson curation.
- Choose a transcription backend:
  - **MacWhisper Pro:** enable Settings → Watch Folders → Auto-Transcribe and TXT export.
    Watch the directory printed by setup. Export beside the audio with the **same filename
    stem**, or set `transcript_directory` to the export folder. The watcher searches that
    folder recursively for `<session-id>.txt`. Select a multilingual local model and
    transcribe the spoken languages; do not translate the whole lesson into English.
  - **Free fallback:** install/build [whisper.cpp](https://github.com/ggml-org/whisper.cpp)
    using its official instructions, and download a **multilingual** model (not `.en`).
    Setup accepts the full `whisper-cli` binary path and the model `.bin` path. This replaces
    MacWhisper's paid folder automation, while still transcribing locally. The integration
    does not claim to automate MacWhisper's free GUI through an undocumented interface.
- A local **text** model served by [Ollama](https://ollama.com/). `ollama list` shows installed
  model names. Start Ollama, install a multilingual instruction model appropriate for your
  Mac's memory, and enter its exact name during setup. Whisper is a speech model and
  cannot perform this editorial step. Curation uses the local Ollama `/api/chat` API with
  a 32K context request and JSON output. Model quality and available memory matter; inspect
  a sample before enabling automatic publication. No paid model API or ChatGPT subscription
  is used by this script. Ollama cloud/remote endpoints are deliberately rejected.
- Get your tutor's agreement to recording. Grant OBS microphone/system-audio capture
  permissions, and allow Terminal/Python to control the selected browser when macOS asks.
  Run the manual doctor check before installing the login agent so permission prompts are
  visible. If macOS later blocks the login agent's Automation access, run the agent manually
  in Terminal and adjust System Settings → Privacy & Security → Automation as needed.

References: [MacWhisper Watch Folders (requires Pro)](https://docs.macwhisper.com/article/35-automatically-transcribing-files-in-watch-folders),
[OBS macOS audio capture](https://obsproject.com/kb/macos-desktop-audio-capture-guide),
[OBS WebSocket SDK](https://github.com/aatikturk/obsws-python),
[Ollama local API](https://docs.ollama.com/api).

## Setup

Download/clone this repository to a permanent folder on your Mac. Do not run it from a
temporary Downloads folder that you plan to remove. The LaunchAgent refers to these
absolute script and virtual-environment paths.

Open `integrations/preply/Setup.command` (or run it in Terminal with `bash`). It creates
an isolated Python environment and asks for your browser, actual classroom address,
OBS password, transcription backend, and installed Ollama model. It starts in **preview
mode**, with automatic recording disabled, so test material is not published accidentally.

From Terminal, inside `integrations/preply`:

```bash
.venv/bin/python lesson_sync.py doctor
```

Each check should pass. The MacWhisper Watch Folder check remains `CHECK`: it requires
an actual export test because this script cannot inspect that app's settings/license.
`doctor` checks GitHub read access; the sample/publish verifies write access later.

## Test once, then enable

1. In OBS, manually record 20–30 seconds with your voice **and some browser speech**.
   Stop and listen to the file. Confirm both voices are present and intelligible.
2. Import that saved recording. Substitute its real path:

   ```bash
   .venv/bin/python lesson_sync.py import-audio '/path/to/test-recording.mkv'
   ```

   For MacWhisper Pro, keep MacWhisper open, wait for its TXT export, then run:

   ```bash
   .venv/bin/python lesson_sync.py process
   .venv/bin/python lesson_sync.py status
   ```

   A zero-card result is fine for a recording without actual Spanish learning gaps. For
   a meaningful card-quality test, import a transcript from a real previous lesson instead:

   ```bash
   .venv/bin/python lesson_sync.py import-text '/path/to/previous-lesson.txt'
   ```

3. Open this local folder in Finder:

   ```bash
   open "$HOME/Library/Application Support/Mi Espanol Lessons"
   ```

   In `jobs/<job-id>/`, inspect `proposed-cards.json`. Evidence and candidate analysis are
   in `candidates.json`; the transcript is local too. Nothing is published in preview mode.
   Don't publish the audio test. You can publish a real lesson preview explicitly:

   ```bash
   .venv/bin/python lesson_sync.py publish JOB_ID_FROM_STATUS
   ```

4. Open `config.json` in that same Finder folder. Set `enabled` to `true`, `auto_publish`
   to `true`, and make sure `tutor_consent` and `audio_tested` are `true` after completing
   those steps. The transcript and audio paths are local; never copy this folder into GitHub.
5. Close old classroom tabs, then run a foreground test:

   ```bash
   .venv/bin/python lesson_sync.py run
   ```

   Open the registered classroom tab. Confirm OBS starts and a notification appears.
   Close the classroom tab and wait 60 seconds; verify OBS stops. During this test use
   `auto_publish: false` if you do not want practice audio to produce published cards.
   Stop the foreground runner with Control-C. Then enable `auto_publish` for real lessons.
6. Install the login agent:

   ```bash
   .venv/bin/python lesson_sync.py install
   ```

From then on, open your classroom as usual, keep MacWhisper open if using its backend,
and close the classroom tab after class. Allow notifications so recording/processing
failures are visible. The agent's log is `agent.log` in the same local data folder.

## Everyday controls

```bash
# See recording state, pending/finished lessons, new-card counts, and errors
.venv/bin/python lesson_sync.py status

# Request that the running agent stop its current recording
.venv/bin/python lesson_sync.py stop

# Add another actual classroom URL (quote it; query strings are discarded)
.venv/bin/python lesson_sync.py register 'https://preply.com/YOUR-ACTUAL-CLASSROOM-PATH'

# Retry queued processing once without starting browser monitoring
.venv/bin/python lesson_sync.py process

# Disable login automation; retains local lessons
.venv/bin/python lesson_sync.py uninstall
```

## Reliability and privacy

- Audio conversion uses an **unwatched staging directory**, then atomically moves the
  completed WAV into MacWhisper's Watch Folder. It never asks MacWhisper to transcribe
  a recording that OBS is still writing.
- Jobs are saved before model/network work and retried every five minutes on failures.
  The recording monitor and processing queue run separately so a slow model does not
  prevent the next lesson from being recorded. Only one processor can run at a time.
- Extraction processes the full transcript in overlapping chunks. A separate model pass
  checks Spanish accuracy, privacy, and semantic overlap against the **whole published
  deck** and other candidates. It returns a small batch, including zero cards when warranted.
  Exact Spanish matching and deterministic IDs provide a final technical duplicate guard.
  These checks reduce errors; they do not guarantee perfect ASR, grammar, or editorial judgment.
- Candidates must include a verbatim evidence excerpt from the lesson. Only the selected
  card fields are published; excerpts, transcripts, model responses, and recording files
  stay on the Mac. Card notes/examples must generalize private conversation. Because the
  model is fallible, keep preview mode if disclosure/accuracy concerns need human review.
- No existing card is edited, reordered, or deleted. IDs, old audio keys, the app's local
  review storage, and deleted-card behavior are unchanged. `updated_at` changes only
  when cards are added. GitHub writes use the current file SHA; a conflict triggers a
  fresh fetch and semantic review, rather than overwriting someone else's changes.
- A network failure after GitHub accepted a write may leave an unfinished job. Retrying
  checks the latest deck first, avoiding duplicate additions. The recorded count can then
  be zero even though the previous request added cards; check the GitHub commit history.
- GitHub CLI writes trigger the existing audio workflow. A successful cards commit is
  **not** proof that Google audio generation or Pages deployment succeeded. Check the
  repository's Actions tab if audio is missing. This script does not upload recordings
  to GitHub Actions or perform TTS itself.
- The recorder refuses to take over an existing OBS recording, stream, or virtual camera.
  If the agent crashes mid-recording, it refuses to adopt a recording on restart. Check OBS,
  stop recording manually, then run `recover` and `import-audio` on the saved recording.
  Abrupt shutdown or manually stopping OBS can require this recovery step. No script can
  guarantee a recording through power loss, sleep, revoked permissions, or another app
  taking over OBS. If you interrupt the recording manually, close the classroom tab too.
- Local files are created with private permissions under
  `~/Library/Application Support/Mi Espanol Lessons`; the OBS source recording remains in
  OBS's own output folder. Files are not automatically deleted. Periodically remove old
  recordings/transcripts once you no longer need them; published card data stays in GitHub.
- The integration is a local Mac login agent, **not a ChatGPT scheduled task**. It does not
  depend on this conversation being open and cannot be activated remotely by this chat.

## Development checks

```bash
python3 -m unittest discover -s integrations/preply/tests -v
```

Tests cover classroom scoping, evidence/grammar validation, semantic-review plumbing,
preview mode, exact duplicate/idempotency guards, concurrent GitHub updates, preservation
of every existing card field/audio key, completed transcript-to-GitHub payload, OBS
ownership, and atomic audio delivery. Service calls are mocked: these are not live
browser/OBS/MacWhisper/Ollama/Google integration tests.
