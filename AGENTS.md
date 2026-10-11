# Repository guidance for coding assistants

Mi Español is the user's personal Spanish flashcard project. **Before adding Spanish vocabulary, generating grammar labels, changing priority, audio, card schema, or review/UI behavior, read [MI_ESPANOL_GUIDELINES.md](MI_ESPANOL_GUIDELINES.md) in full.**

Authoritative sources to inspect when relevant:
- `cards.json`: current published vocabulary and curated grammar/priority metadata.
- `index.html`: frontend, embedded offline BASE, spaced repetition, and synchronization logic.
- `scripts/generate_audio.py` and `.github/workflows/spanish-audio.yml`: Google TTS generation from exact Spanish text.
- `sw.js`: offline PWA caching/update behavior.

Non-negotiables: curate high-value vocabulary first (Essential > Useful; Extras optional), treat mood/tense/form/aspect separately and accurately, favor natural Spanish including correct Argentine vos usage when appropriate, and **perform AI editorial semantic deduplication yourself when curating a lesson**—group variants like darse cuenta / darme cuenta / me di cuenta into one learning objective unless a distinct grammar error justifies another card. **No Python semantic-detection script is needed for this editorial task.** Never casually reset reviews, resurrect deleted items, or change old audio keys. Editing existing `en` or `es` text may create duplicate local cards; read the migration guidance.

Use the latest user instructions when they supersede the guide. Update the guide whenever the code or learning policy changes. Don't commit new cards unless requested; ordinary Spanish tutoring is not automatic publication.
