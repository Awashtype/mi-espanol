# Mi Español — vocabulary, grammar, publishing, and study guidelines

**Project:** [Mi Español](https://awashtype.github.io/mi-espanol/) · [GitHub repository](https://github.com/Awashtype/mi-espanol)  
**Purpose:** This is the durable reference for future ChatGPT conversations and coding assistants working on the user's personal Spanish flashcard app. Read it **before** proposing or publishing vocabulary, editing grammar metadata, modifying pronunciation/audio, or changing the study flow.  
**Last reviewed against the repository:** October 2026. If code or data have changed, inspect the actual files rather than assuming this document is still the complete technical specification.

## 1. What the user is trying to accomplish

Mi Español is a personal, offline-capable, minimal, focused Spanish flashcard application, not a general vocabulary database or a language-learning social app. The user studies Spanish through conversations with ChatGPT, tutoring, homework (tareas), questions about real-life speech, grammar drills, and translations. The application should keep **high-value gaps** in active spaced repetition and retain less useful but interesting discoveries for optional reference.

Principles, in descending order:

1. **Learn common missing vocabulary first.** A word appearing in a lesson, or being novel or interesting, does **not** automatically make it worthy of the day's limited study slots.
2. **Prioritize by usefulness, not by card type or date added.** Words, expressions, and complete sentences all compete for daily attention, with Essential > Useful. Extra is excluded by default.
3. **Protect study time and focus.** Make the interface quick, visually quiet, and easy to use while commuting. Do not overload it with controls, vocabulary trivia, or unnecessary features.
4. **Teach real Spanish accurately.** Keep grammatical tense, mood, form, aspect, pronouns, conjugation, and regional register distinctions correct. When uncertain, check before adding an annotation.
5. **Respect the user's Spanish dialect interests.** The user is particularly interested in Argentine/Rioplatense usage and voseo (vos), but generally useful Spanish normally outranks narrow slang.
6. **Protect existing data.** Do not reset, delete, duplicate, overwrite, or break cards, review history, or already-generated audio without an explicit request.

The user has practiced A1–A2 material and increasingly nuanced grammar, with the long-term goal of more fluent Spanish. Do not treat vocabulary as already mastered merely because it is elementary. Conversely, do not assume every basic word is unknown: use actual study errors and requests.

## 2. How to work across new ChatGPT conversations

If the user mentions "Mi Español," their flashcards, exporting a Spanish word list, or adding vocabulary to their app:

1. Open this file and check the current [cards.json](cards.json), plus [index.html](index.html) if the request affects behavior or grammar rendering.
2. Use the Spanish-learning conversation to identify candidate **unknown or repeatedly confused** material. Explain grammar or do the exercise first; publication is a separate task unless the user requested it.
3. Curate the candidates using the priority rubric below. Avoid dumping every term from a transcript into active review.
4. Check for existing cards, including near-duplicates and equivalent idioms. Correct existing metadata when appropriate rather than adding redundant flashcards.
5. If the user asks to publish/add/update cards, edit the repository directly when the necessary tool is available. Do not make the user manually copy code or files unless necessary. If you lack repository access, say so rather than implying a commit occurred.
6. Report succinctly what was added, updated, skipped as duplicates, and kept as reference-only. Distinguish a proposed list from a committed one.

**Do not assume all new chats automatically know every implementation detail.** This repository guide and the actual source files are the source of truth. Do not automatically add every vocabulary item from normal Spanish Q&A; respect the user's task in that chat. If they merely want help with Spanish, teach Spanish.

Suggested prompt that the user can give in a fresh chat:

> Help me with Spanish homework and vocabulary. When I ask to save a lesson, read Awashtype/mi-espanol/MI_ESPANOL_GUIDELINES.md, then curate and add the important missing words/expressions with the app's existing priority and grammar rules. Avoid duplicates, unnecessary audio regeneration, and changes to my review progress.

## 3. Learning priority: the most important rule

Every published card must have a **priority** field containing one of these exact lowercase values:

| Value | UI label | Meaning | Default daily queue? |
| --- | --- | --- | --- |
| essential | Essential | Common, widely reusable material; basic functional vocabulary; critical connectors; foundational or repeatedly missed grammar/expressions | **Yes, first** |
| useful | Useful | Realistically useful but more situational, topic-specific, stylistic, regional, or advanced | **Yes, after Essentials** |
| extra | Extra | Interesting, very niche or comparatively low-priority material; optional cultural or slang vocabulary that the user does not urgently need to produce | **No, reference by default** |

Use the following decision order:

- **Frequency and coverage:** Would this word or construction appear regularly in day-to-day spoken Spanish, everyday writing, or many contexts? Broad words and functional constructions receive priority.
- **Actual knowledge gap:** The user got this wrong, asked for it repeatedly, confused its forms, or explicitly says they cannot produce it. A recurring personal gap may justify Essential even if the word is not among the very most frequent words.
- **Generativity:** Does knowing the word or phrase unlock many new sentences (e.g., aunque, todavía, darse cuenta, quedar, volver, sin embargo, me cuesta)? Favor reusable building blocks.
- **Relevance to the user's life:** Everyday conversation, expressing feelings, scheduling, school/work, travel, Spanish lessons, and communication in Buenos Aires can lift a card's priority.
- **Register and regionality:** Voseo and natural Argentine usage matter, but a regional slang synonym should not displace a missing everyday word. Useful contextual regional speech can be Useful, or occasionally Essential when clearly central to the user's real speech.
- **Effort versus payoff:** Avoid spending a precious new-card slot on a highly specialized phrase, unusual idiom, rare noun, or near-duplicate unless asked.

Examples from current deck classification (check cards.json for current truth):

- **Essential:** responder, adecuado/adecuada, sin embargo, me cuesta, no me acuerdo de..., useful preterite/imperfect or subjunctive structures.
- **Useful:** laburar, el subte, ¡Che!, bancame un toque, some more specific polite or casual expressions.
- **Extra:** bondi, guita, un quilombo, un bife a caballo as currently tagged. **Extra is not a statement that these are never said.** For example, bondi is normal Argentine slang for a bus; the learner may get more general value from learning colectivo first.

The current published batch contains **39 Essential, 17 Useful, and 5 Extra cards** as of this guide's initial writing. Counts and judgments may change. Priority is an editorial decision, not an immutable linguistic claim. Do not relabel an entire batch to Essential by default.

### Daily queue behavior

- Normal mode: **Essential + Useful**, Essential before Useful, **irrespective of whether a card is a word, expression, or sentence**.
- The recommended default excludes Extras from the daily queue, but **keeps them searchable in My cards**.
- Study options let the user explicitly choose Essentials only, Useful only, Extras only, or all priorities, as well as filtering by type.
- The standard allowance is **20 new cards per day**. Due reviews can also appear; new cards are not a strict 20-total-cards limit.
- When a later batch contains an Essential, it can **cut ahead of older unstarted Useful cards** in the remaining session queue. Do not displace the current in-progress card or lose its state.
- Preserve existing spaced-repetition reviews and due dates. "Priority first" chiefly determines which **new** items to introduce; already-scheduled reviews still need to be honored.
- After finishing the day's batch, there is an optional **Learn 10 more** action. Do not automatically expand the daily limit.
- New items should not jump into the middle of an unrevealed answer or disrupt an active answer.

**Potential future project, not implemented:** a "Vocabulary Gap Check" that tests frequent words and detects knowledge gaps. Do **not** claim such a feature already exists.

## 4. Selecting vocabulary after lessons or tareas

When asked to summarize or save a Spanish study session:

1. Extract candidates: unfamiliar core words, productive collocations, actual corrections and misunderstandings, reusable expressions, and examples that clarify confusing grammar.
2. Favor **small, curated batches** of cards the user could actually benefit from reviewing over exhaustive transcription.
3. Give the most important items Essential and genuinely situational items Useful; keep low-value discoveries Extra **if** they are worth remembering at all. You do not have to save every interesting term even as Extra.
4. Prefer natural, correct **Spanish as actually spoken**, with a faithful and idiomatic English meaning. Don't generate stiff literal English or artificial Spanish simply to force a card.
5. Choose the most pedagogically useful granularity:
   - **word:** a standalone noun/verb/adjective or a short lexical phrase;
   - **expression:** a reusable chunk, idiom, connector, or conversational formula;
   - **sentence:** a contextualized sentence to practice a tense, mood, agreement, or useful structure.
6. Teach a basic word through a short reusable phrase or sentence that shows its actual use (collocation, preposition or situation). Avoid isolated lexical items; keep one learning objective per card. This supersedes the former preference for bare verbs.
7. Avoid overloading one card with unrelated lessons. Avoid three variants of the same sentence when one suffices.
8. Mark register only when meaningful (formal, informal, Argentina/vos, slang). Use the category and/or note field for guidance.
9. For previously discussed grammar, create actual useful examples **when warranted**, not a large memorization list of isolated inflections.
10. If an item is already present but the user has forgotten it, **let spaced repetition handle it**. Don't add duplicates to make it appear sooner.

### AI editorial deduplication is mandatory (no new script required)

**The assistant preparing a study-session summary is responsible for semantic deduplication before publishing any cards.** This is an expected part of the AI's reasoning and editorial work, **not** a feature the user needs to build in Python, run in the browser, or pay for via an additional semantic-detection service.

In a long lesson (including a multi-hour conversation with many vocabulary drills), first collect all candidate material, then **group it into word families and shared learning objectives** before choosing the final small set of cards:

1. **Normalize mentally by lemma and construction:** recognize inflected or reflexive variants, word order, English paraphrases, synonyms, and overlapping sentence patterns. E.g., `darse cuenta`, `darme cuenta`, and `me di cuenta` are related forms of the same expression, not three unrelated vocabulary items.
2. **Identify what is actually new for this learner:** is the key goal to know the expression `darse cuenta de`, to conjugate it in the preterite (`me di cuenta`), or to use it in a particular sentence? The underlying expression can normally be **one card**, with a short `note` explaining other forms if helpful.
3. **Create a separate card only for a distinct, worthwhile learning objective**: for example, if the user repeatedly struggles to produce `me di cuenta` in the past tense, a sentence specifically training that form can be justified. It needs an identifiable grammar contrast or production challenge, not merely different wording.
4. **Avoid teaching the same thing three times:** do not add three cards that only differ by subject pronoun, agreement, pronoun placement, tense, or slight English translation unless the grammatical distinction was itself a genuine learning problem. Likewise, do not save both a phrase and a near-identical sentence unless the sentence adds substantial transfer value.
5. **Do not over-deduplicate:** words can share a root yet differ in meaning, register, grammatical behavior, or a key construction. Keep distinct cards when those differences matter; evaluate semantics and pedagogy, not just string similarity.
6. **Check against both the proposed batch and existing cards.json:** an existing card may already teach the target construction. If so, prefer using it, augmenting a safe `note` or `grammar` annotation when warranted, rather than adding a new duplicate.
7. **Make the final selection intentionally concise.** Keep a few representative high-value examples, label each Essential / Useful / Extra, and discard redundant candidates. When publishing, briefly mention that related forms were consolidated if useful.

**Explicit user preference:** "When we spend three hours practicing vocabulary and sentences, don't turn three almost-identical forms into three separate cards. Organize them intelligently yourself."

The code's exact text-pair matching remains a technical safety net, **not a substitute for this human/AI editorial check**. No new automatic duplicate-detection system is necessary for this workflow.

Repeated areas to watch from Spanish discussions: **pretérito vs imperfecto**, **ser/estar/ir/andar**, present vs past, future vs conditional for conjecture/probability, **indicative vs subjunctive**, imperative forms (including vos), agreement, perfect/progressive constructions, time expressions, reported speech, and the differences between common colloquial and formal Spanish. This is guidance for noticing actual errors, **not** a directive to fabricate drills on every topic.

## 5. Regional conventions, translations, and pronunciation-friendly text

- Prefer **correct Argentine vos** forms where the sentence naturally addresses a single person from Argentina: podés, pasás, decís; vos imperatives such as hablá, vení, bancame, etc. Check the actual conjugation and accent; don't automatically replace every tú or usted in a context that requires it.
- For plural "you" in Argentina, use **ustedes** rather than vosotros in the relevant context.
- Preserve formal **usted** when a formal/polite construction calls for it.
- Distinguish neutral everyday Spanish from casual regional variants in a brief note when useful.
- Respect punctuation, accents, opening question/exclamation signs where appropriate, noun gender, articles, and agreement.
- For a masculine/feminine pair, prefer **comma + space** instead of slash in **new Spanish text**, e.g. **adecuado, adecuada** or **un compañero, una compañera**. The voice should read the two forms rather than interpreting a slash as a spoken word. Use comma-separated pairs only when it makes sense to learn them together; don't mix arbitrarily unrelated words.
- Existing cards might still store **adecuado / adecuada** or similar in their raw Spanish source. The app's displaySpanish() currently shows slash-surrounded-by-spaces as a comma **visually**. The underlying original Spanish text and audio lookup key are deliberately unchanged. The old audio may still pronounce the slash awkwardly. Do **not** change existing raw es solely to polish its on-screen punctuation unless the user specifically accepts audio and migration implications.
- Spoken audio is Google Chirp 3 HD (voice **es-US-Chirp3-HD-Aoede**) in the current setup, and the app downloads recordings so playback does not synthesize again each tap.
- Do not make claims that the old recordings were fixed merely because the displayed text was changed.

## 6. Grammar metadata: model and annotation discipline

Grammar isn't a single scale. **Tense**, **mood**, **form**, and **aspect** are different dimensions; combinations need to be linguistically accurate. The app currently performs **manual/curated** verb tagging; it does **not** automatically analyze every new sentence with an NLP parser.

The card's optional **grammar** field is an array of objects using these exact supported keys:

| Key | Supported values | Purpose |
| --- | --- | --- |
| text | exact Spanish substring (required) | Inflected verb/form to highlight; must occur exactly in the card's es field |
| tense | present, past, future, conditional | Broad tense/form-family color |
| form | preterite, imperfect | Fine distinction within past forms; different underline strokes |
| mood | indicative, subjunctive, imperative | Subjunctive wavy pink styling; imperative outline |
| aspect | perfect, progressive | Tiny PERF or PROG superscript |
| occurrence | zero-based integer, optional | Which exact occurrence to mark when identical text appears multiple times |

Technical requirements:

- The parser currently only recognizes an annotation when **tense or mood** has a supported value. A form or aspect alone will not render. Include a supported tense and/or mood where linguistically appropriate.
- **text is matched case-sensitively against the raw es field.** Example: Tengo and tengo are not interchangeable for metadata matching. Diacritics must match exactly.
- If the same form occurs twice, use occurrence: 0, occurrence: 1, etc. Do not annotate the wrong one.
- Use **mood: subjunctive** for a real subjunctive verb, not because a sentence expresses uncertainty in English or because of a preceding si, aunque, cuando, or que by itself. Analyze the specific Spanish clause.
- For imperfect subjunctive forms like **fuera** / **enviara**, the app's available labels may be **tense: past, form: imperfect, mood: subjunctive**. This is the **past-form/imperfect-subjunctive morphology**; it does **not** automatically imply past time. This matters in conditional/hypothetical sentences and polite requests.
- Do not conflate conditional indicative (**hablaría**) with imperfect subjunctive (**hablara**), or future indicative (**hablaré**) with present subjunctive (**hable**).
- A form tagged as pretérito should represent the preterite; imperfect should represent the imperfect, not just any past-related verb.
- Perfect and progressive are **aspect/construction labels**, not new colors or an excuse to mark any compound form incorrectly. Verify tense and aspect of the actual Spanish construction.
- Do not annotate a verb if you are uncertain; an unannotated card is preferable to teaching a false grammatical rule.
- Keep **focus** phrases separate from grammar: focus marks useful chunks (e.g., **sin darme cuenta**, **me cuesta**, **lo que pasó**), rather than the verb's grammatical tense/mood.

Example — polite conditional with a subjunctive form:

~~~json
{
  "id": "R001",
  "type": "sentence",
  "category": "formal",
  "priority": "useful",
  "en": "I would appreciate it if you sent me the document tomorrow.",
  "es": "Le agradecería que me enviara el documento mañana.",
  "note": "Conditional polite request with imperfect subjunctive.",
  "grammar": [
    {"text": "agradecería", "tense": "conditional", "mood": "indicative"},
    {"text": "enviara", "tense": "past", "form": "imperfect", "mood": "subjunctive"}
  ]
}
~~~

Example — contrasting imperfect and preterite:

~~~json
"grammar": [
  {"text": "Enviaba", "tense": "past", "form": "imperfect", "mood": "indicative"},
  {"text": "empecé", "tense": "past", "form": "preterite", "mood": "indicative"}
]
~~~

(These examples correspond to existing lesson concepts; inspect the current card before adding anything. Do not add duplicate R001 or R024.)

### Grammar design conventions — preserve these

- **Present:** soft green.
- **Past family:** coral; **pretérito** and **imperfecto** use subtly different bottom strokes.
- **Future:** blue.
- **Conditional:** violet.
- **Subjunctive:** **unmistakable pink** background (**#ffb9d9**) with raspberry text and a **pink wavy underline**; the explicit mood styling takes visual precedence over the tense-family fill.
- **Imperative:** thin outline.
- **Perfect/progressive:** compact PERF/PROG notation where annotated, rather than inventing an unrelated color family.
- **Fixed phrases:** separate muted warm-beige styling, distinct from tense colors.
- Grammar cues appear on the **revealed answer side**, not as hints that spoil the answer. The My cards library can show annotations if Grammar colors are enabled in Settings.
- Only annotated verbs receive grammar colors. Do not imply the app automatically annotates all conjugations.

## 7. Current data structure and where content belongs

Authoritative files:

- **cards.json** — the published vocabulary array, including priority and curated grammar tags; **normally edit this file to publish new words**.
- **index.html** — full HTML/CSS/JavaScript application, including an embedded fallback BASE deck; selection, reviews, styling, audio playback, and published-card merge logic.
- **mi_espanol_google_audio.json** — generated pronunciation pack. **Do not edit by hand.**
- **scripts/generate_audio.py** — voice-generation script; uses raw es strings as keys.
- **.github/workflows/spanish-audio.yml** — generation workflow.
- **sw.js**, **manifest.webmanifest** — installable offline PWA shell and metadata.
- **README.md** — brief repository overview and a link to this document.
- **AGENTS.md** — short pointer for agentic coding tools, when present.

A typical **new** entry (illustrative only; check ID collisions and do not auto-add this just because it appears here):

~~~json
{
  "id": "N001",
  "type": "sentence",
  "category": "daily",
  "priority": "essential",
  "en": "I have to leave early.",
  "es": "Tengo que salir temprano.",
  "note": "Tener que + infinitive for obligation.",
  "grammar": [
    {"text": "Tengo", "tense": "present", "mood": "indicative"}
  ]
}
~~~

Field rules:

- **id:** unique, stable identifier; never reuse an existing or deleted identifier. Check the current deck before allocating an ID.
- **type:** word, expression, or sentence — independent of priority.
- **category:** topic/register/context label, e.g., work, places, grammar, daily, informal, formal, argentine. Not a substitute for priority.
- **priority:** essential, useful, or extra — required for all newly published cards. The UI defaults cards with no valid priority to Useful, but publication should explicitly tag it.
- **en:** accurate English-facing prompt or translation, concise but not misleading.
- **es:** idiomatic Spanish and **the exact source text for audio generation and lookup**. Treat changes to old values as migrations, not cosmetic edits.
- **note:** short explanation of context, spelling trap, gender, register, conjugation, or an actual learner correction.
- **grammar:** optional curated array as above.
- **focus:** optional exact useful phrase(s) for chunk emphasis; may be a string or array depending on existing formatting. Follow examples and current parser.

Published entries may contain other legacy fields. Do not remove unfamiliar fields from existing cards casually.

### Duplicate and migration traps

The application now matches stable IDs first, then current/previous normalized **English + Spanish text pairs**. Wording changes require a higher `content_revision`; metadata at the same revision updates only on a matching text pair. Familiarity remains attached to the existing local ID. This is significant:

- **Adding a new entry that differs only in punctuation, casing, or slight phrasing may create a second card.** Check semantic duplicates, not just exact-string equality.
- **Changing en or es on an existing entry** can break the match to a user's locally stored card, creating a duplicate and/or leaving a prior review record attached to a different card. Avoid casually rewriting existing card text. If a correction is truly needed, inspect merge logic and plan a safe ID-based migration with testing.
- Published **priority** and **grammar** metadata can update an existing matched card without clearing reviews.
- Do not republish an intentionally deleted card under a new id merely to make it show up again. Local deletions are tracked in a deleted-id list.
- A locally installed app can contain cards and review data not present in the current published array; avoid assuming the repository reflects every device's local state.
- The embedded BASE in index.html is an offline fallback. The app fetches cards.json and merges published cards online. For ordinary new batches, cards.json is generally enough; if code or embedded fallback data change, validate their consistency.

## 8. Google audio: preserve recordings and avoid needless synthesis

The current pipeline:

1. Pushing **cards.json** to the main branch triggers **Generate Spanish Audio** (GitHub Actions); it also runs for changes to the generation script or its workflow.
2. The script reads the current raw **es** values and de-duplicates them by string.
3. It reuses recordings already in **mi_espanol_google_audio.json** when the **exact Spanish string** exists in the pack and the voice matches.
4. It calls Google Cloud Text-to-Speech only for **missing** Spanish strings, then writes the updated audio pack.
5. The app retrieves the pack and stores individual clips in IndexedDB for offline playback. Repeated taps on 🔊 do not make new TTS calls.

Practical consequences:

- Adding genuine new vocabulary **normally generates only the new required recordings**.
- Editing **priority**, **note**, or **grammar** can trigger the Actions workflow because cards.json changed, but does not by itself require new Google synthesis when es values remain unchanged.
- Editing an old card's **es** changes its audio key and may trigger fresh generation, even for punctuation or slash/comma changes. It can also affect stored-card merging and review continuity. Do not make such edits just for visual polish.
- Do not regenerate the entire audio library for a minor display or metadata change. Avoid changing the TTS voice, generator, or audio pack format casually.
- Existing slash-separated gender pairs are rendered with commas onscreen without modifying the old es string. In **new cards**, write comma-separated alternatives so the next generated recording can read them more naturally.
- Audio playback is separate from the study grade and the automatic-pronunciation setting. Listen obeys each stage's pre-check constraints, but after **Compare answer** on a nonempty typed attempt, the user can manually replay the correct Spanish recording without limits.
- Do not claim that a push, an audio build, or a live deployment succeeded before checking available tool results.

## 9. Study behavior and UI guardrails

These were deliberate design decisions; preserve them during feature work:

- Minimal, calm interface with Study, My cards, and Settings sections. Study filters are tucked into expandable **Study options**.
- Tap the card to reveal the answer, with an optional scratch writing area.
- **Again / Good / Easy are always visible while studying**, including before reveal. The user may know a word immediately and grade without flipping it.
- **🔊 Listen sits outside the flashcard, beneath the "remaining" count**; it should not push the center-aligned word down. It manually replays the Spanish clip on either side without flipping or grading.
- A **tiny, discreet trash icon** sits in the bottom-right of the card away from grade buttons. It requests confirmation and removes that card from future reviews; another available word can fill its slot.
- **Again** requeues a failed card at the end, up to three attempts for the day; then it is scheduled for tomorrow. **Good** and **Easy** schedule longer spaced intervals (Easy is longer). Don't confuse grades with delete.
- Spanish → English recognition and English → Spanish production have **separate review directions/schedules**. The second direction can be introduced the next day, not immediately doubled in the same session.
- Default new-card allowance is 20/day, with an optional "Learn 10 more" **after the current batch is completed**, not during an unfinished session.
- Priorities order candidate new cards first by Essential, then Useful; type is a tie-breaker rather than the main sequence. Extras are optional, not deleted.
- Previously made test-review resets are not permission for future resets. **Never change PROGRESS_RESET_VERSION**, clear localStorage, reset histories, or override progress unless explicitly asked.
- Keep the existing grammar visualization subdued overall, with the intentionally visible pink subjunctive exception.
- Do not add intrusive features, pop-ups, study reminders, or unrelated project-management workflows just because they are technically possible.

## 10. Local progress, installed apps, and backups

There is currently **no cloud-backed cross-device/cross-browser synchronization** for study history.

- Study data is stored in localStorage under **mi-espanol-offline-v1** (the source of truth for that browser/installed-app storage context).
- TTS clips are cached in IndexedDB separately.
- On iOS especially, the installed Home Screen PWA and Safari can maintain **different histories even when both have exactly the same app code and URL**. Do not misdiagnose separate progress as proof of an outdated app version.
- Settings displays an app/version label, identifies Browser vs Installed Home Screen app where possible, and offers **Save progress backup** and a JSON restore.
- Restore supports merging review records by default or an explicitly confirmed **replace this app's review history** option. Restoring is a **one-time transfer**, not automatic sync. Local deletion choices may be retained/merged; review backup and replace logic should be inspected before any change.
- If the user wants to move progress between contexts, export from the copy they wish to keep and restore into the other. Advise backing up both before replacing.
- **Do not delete/reinstall an installed app as a routine refresh fix**, because local learning data can be lost.
- PWA navigation uses fresh HTML when online with offline fallback in sw.js. App-code changes may need a cache version bump and time for GitHub Pages to deploy. Updating only cards.json does not necessarily require changing the app shell.
- Do not claim one browser's local progress was reset, merged, or inspected by editing GitHub code alone. A code change can make a one-time reset happen **when that device actually loads the new version**; it cannot remotely read that device's localStorage.

## 11. Publishing checklist for future assistants

Before editing:

- [ ] Read this guide plus current cards.json; inspect index.html and scripts if the requested change requires it.
- [ ] Identify the user's **actual** unknown vocabulary, corrected forms, or repeatedly missed constructions.
- [ ] Assign **essential / useful / extra** thoughtfully. Never equate "new/interesting" with Essential.
- [ ] Confirm the Spanish is correct, natural, accented, and appropriate for the intended Argentine/formal context.
- [ ] Choose the right **type** (word/expression/sentence) independently of priority.
- [ ] **Actively consolidate related inflected forms, paraphrases, and shared constructions into one pedagogical card when appropriate;** create a second only if it targets a genuinely different grammar or production problem. Check exact **and semantic** duplicates in both the proposed batch and existing cards.json, stable IDs, and already-deleted concepts.
- [ ] Annotate only linguistically verified verb forms with exact text, tense, form, mood, aspect; include occurrence if required.
- [ ] Use natural chunk/focus highlighting only where useful. Don't auto-label all verbs or assign unverified tenses.
- [ ] For new gender-paired entries, use **comma + space**, not slash, for pronunciation.
- [ ] Avoid changing existing en/es strings or audio keys without a migration plan.

When committing:

- [ ] Normally edit **cards.json** only to add genuinely needed cards and metadata.
- [ ] Keep valid JSON, all existing cards, and unique stable IDs; don't reorder/destroy review state or deleted-card history.
- [ ] Expect the Google audio workflow for a cards.json change, but check that **existing audio keys are unchanged** so the generator only synthesizes genuinely new lines.
- [ ] If changing application code, validate JS/HTML, existing UI controls, storage behavior, and offline/PWA refresh behavior. Do not reset reviews without explicit authorization.
- [ ] Verify the GitHub operation succeeded. If possible, verify the changed file afterward.
- [ ] Tell the user which cards/metadata were added or skipped, whether audio was reused or newly needed, and remind them that GitHub Pages may take a minute to publish.

## 12. Known limitations vs aspirations

**Implemented:** published vocabulary cards with priority labels; default Essential-first study; optional Extras-only study; type filters; curated grammar metadata; fixed-expression highlights; pink subjunctive styling; offline Google TTS playback; compact replay and delete controls; daily limits; two-way reviews; local JSON backup/restore; installable PWA.

**Not implemented in the app:** automatic frequency estimation using a corpus, code-driven semantic duplicate detection, universal grammatical tagging for new cards, a personalized vocabulary gap diagnostic, real-time synchronization between browser and Home Screen app, or synchronized cross-device accounts. **However, AI editorial semantic deduplication when organizing lessons is required now** (see Section 4); it does not need an app feature or Python script. Don't describe the other aspirational features as already functioning.

---

**Maintenance note:** If the user revises their learning philosophy or the app's behavior changes, update this document in the same feature work. Favor the user's latest explicit instructions over older preferences, but preserve safety around progress, deleted cards, and audio.

### Card-list update label

`cards.json` includes a top-level `updated_at` ISO calendar date (`YYYY-MM-DD`). Update that field whenever the published card contents change, so the tiny gray date in **My cards** accurately reports the card list's last publication date. Do not change it for app-only UI edits or progress/history. The label only renders when metadata is supplied by a successful online card fetch; it does not infer dates from device study history.

### My cards browsing filters

In **My cards**, the priority and type filters can be combined with **All additions / Latest 10 added / Latest 20 added / Not studied yet**, plus **Priority first / Newest first / Oldest first / A to Z** sorting. Newest/oldest follow the order cards entered the local library (published cards are merged in their published array order), rather than study/review time; no historical per-card timestamps are implied. Recency is global across cards, before topic/priority/search filtering. These controls affect only library presentation; they must not mutate review state or the study queue.

## 13. Four-stage progression and offline written comparison (October 12, 2026)

New cards move across **four stages** only when marked **Easy**: (0) Spanish → English recognition; (1) English prompt + unlimited manual Spanish audio playback for dictation; (2) English prompt + exactly one manual playback for that review; (3) English prompt + independent Spanish writing, with no audio during that review. **Good** retains the current stage and schedules the next normal review; **Again** repeats the stage sooner, at most three same-day attempts. Graduation to the next stage schedules the next stage for the following day. At stage 3, Easy increases the spaced-repetition interval without introducing a fifth stage.

The existing **🔊 Listen** button is the only audio control. There is no press-and-hold; users tap as often as they want in stage 1. In stage 2, the app permits one successfully started audio clip **before comparing the typed answer** and persists its used state in the current day's saved session, even across refresh. A missing or blocked recording must **not** spend the one-play allowance. Stages 1–3 do not autoplay or expose the Spanish answer early. In stage 3, audio stays disabled before **Compare answer**, even if the card is manually revealed.

**After writing a nonempty attempt and tapping Compare answer, all stages unlock unlimited manual 🔊 Listen replays of the correct Spanish audio, including stage 2 after its initial listen has been used and stage 3.** Audio never automatically starts because of comparison. A per-card checked flag is saved with the current daily session so replays remain unlocked after refreshing that session; a card requeued by Again requires a fresh attempt/check. Merely flipping/revealing a card without comparing does not unlock stage 3 audio. Spanish audio keys and stored clips remain unchanged.

The scratch area is now an optional answer-comparison input. **Compare answer** reveals the saved answer and highlights word-level insertions/deletions offline with Unicode tokenization and order-aware alignment. It does not grade synonymy or guarantee correctness; equally valid alternative phrasing may be marked different. Existing `note` metadata appears after comparison. Again/Good/Easy remain the user's manual assessment. Compare does not automatically advance a stage. Unfinished typed drafts are saved in the daily session and restored on refresh, without changing card review records.

To protect existing progress, keep the `mi-espanol-offline-v1` localStorage key and `PROGRESS_RESET_VERSION` **unchanged**. New reviews add an integer `stage` field (0–3), retaining the existing `dirs.es` and `dirs.en` grade, count, interval, due, and last-reviewed values. Existing English-to-Spanish reviewed cards are mapped to stage 3, cards reviewed only in recognition are mapped to stage 1, and untouched cards start at stage 0. All original dates are preserved during migration. Respect existing deleted-card lists and never reset local study histories as part of these UI changes.

The old Study options direction selector is removed because stage progression now determines what is shown. The two verbose gray Study helper paragraphs are removed. Study priority, type/scope filters, My cards filters, Settings, backups, and separate audio cache remain in place. App-shell changes require a service-worker cache-version update so installed apps eventually load the latest HTML. The Home Screen app and Safari still have separate local histories; GitHub cannot back up or read either directly.


## 14. Reported-speech transformation cards (October 14, 2026)

Cards with `category: "reported-speech"` are **production exercises** rather than translation vocabulary. Their `en` field is intentionally an English-framed real-world scenario containing the exact Spanish direct quote and the later reporting context; `es` is the correct Spanish indirect-speech answer. This avoids modifying the global card schema or translation handling. The front of these cards **always** displays the scenario, even in stage 0, and the back displays the reported Spanish answer. The Compare answer target is the Spanish `es` in every stage. The first-time label should say "REPORT THE SPEECH", not Spanish-to-English. Do not speak the saved answer or enable the Listen button **before** reveal, even when auto-audio is enabled; the stage-3 no-audio restriction before **Compare answer** remains in force; after comparing a written attempt, the user may replay the correct answer as in every other stage. The rest of four-stage scheduling, grades, deletions, backups, and offline progress is unchanged.

These cards are original pedagogical scenarios adapted from the user's October 14 class and the grammar overview at https://www.profedeele.es/actividad/estilo-indirecto/. Focus on cases with real verb-tense or mood changes (including preguntas and órdenes), rather than filling the study queue with unchanged forms. The time reference and narrator must be explicit; the backshift is contextual, not a rule that every past report always changes tense. Condicional simple → condicional compuesto is appropriate to a **retrospective unrealized wish**, not every indirect quote of an ordinary conditional. An indirect yes/no question uses `si`, and information questions retain their interrogative (e.g., `dónde`). Alternatives may exist; explain genuinely acceptable alternatives in `note`. Preserve the exact `es` audio keys and existing review state.


## 15. Context, conversation practice and account sync (October 27, 2026)

The user wants vocabulary in usable context and rapid written reconstruction of live tutor conversations. Read [CONVERSATION_PRACTICE.md](CONVERSATION_PRACTICE.md) for the standing trigger **“rebuild conversation from my current mi español list”**. `scenarios.json` links eight scenes to stable card IDs and archived session evidence. `sessions/index.json` covers five retrieved originals with marked privacy redactions; do not claim complete historical coverage.

57 existing cards were rewritten with `content_revision: 1`, `previous_text` and `headword`. All 156 IDs and priorities remain. `merge()` updates higher content revisions in place, preserves legacy local aliases using `published_id`, and rejects wording rollback from old backups. BASE now contains the full current deck. Preserve reviews, due dates, stage, deletions, daily allowance and session drafts. Never bump the progress reset version for content changes.

The original GitHub Pages app remains available offline and offers **Settings → Connect account & keep my progress**. It opens the private account version, signs in with ChatGPT, and transfers progress by an origin-checked, window-checked, nonce-bound message after sign-in. A compressed fragment-only transfer with an explicit Import click supports mobile browsers that detach the opener. The fragment is removed from the account page history before applying the data. Only cards, reviews, deletions and reset markers transfer; session drafts stay local. No review data goes into public GitHub. If login detached the opener, return to the old app and tap Connect again while already signed in. Home Screen and Safari histories are separate: connect from the exact copy with the desired history. Do not delete the old installation to migrate.

The private account version is https://mi-espanol-thea.wrytoad39.chatgpt.site . Sites project `appgprj_6ae15b2d22a08191b4f8d4ea5c9a7750` has its own source repository, ChatGPT identity and a D1 `DB` binding. Each authenticated Site-scoped user ID owns a progress row. Updates use optimistic version checks; clients merge before retrying conflicts. Offline changes stay local and sync after reconnection. Review timestamps select the newest per-card record; deletions are retained, explicit reset timestamps prevent stale devices from restoring pre-reset reviews. Simultaneous different-device changes to the same card resolve to the latest record, not summed repetitions. Current session position/drafts are device-local. Backups remain optional recovery tools, not a normal sync requirement.

The Site exposes read-only MCP tools for current practice batches, progress summary and archived transcripts. The **Mi Español** plugin must be installed/connected for future chats to use them. Requests use the authenticated caller's progress. No tool automatically grades practice or rewrites familiarity. The notebook fetches the current public cards/audio through fixed authenticated content routes; app-shell changes must be applied to both versions. The complete private Site source is maintained by Sites; `account/` in this GitHub repository holds the authored service code for discovery. Follow the Sites skill to publish that existing project.
