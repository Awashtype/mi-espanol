# Mi Español

A personal, offline-capable Spanish flashcard app with priority-first vocabulary, two-way spaced repetition, curated grammar annotations, and cached Google pronunciation.

**[Open Mi Español](https://awashtype.github.io/mi-espanol/)**

## Start here for future Spanish chats and app changes

**[Read the Mi Español vocabulary & study guidelines](MI_ESPANOL_GUIDELINES.md).** This is the permanent reference for curating new vocabulary from Spanish lessons and tareas, marking Essential / Useful / Extra, annotating subjunctive and other verb forms correctly, using natural Argentine Spanish, protecting existing audio, and preserving learning history.

For adding new cards, check [cards.json](cards.json) after reading the guidelines. The current web app and review logic are in [index.html](index.html). For pronunciation generation see [scripts/generate_audio.py](scripts/generate_audio.py).

> Browser and installed Home Screen app review histories are currently local and may be different. Use Settings → Save progress backup and restore to transfer progress; the app does not provide real-time cloud sync.

## Automatic lesson import on Mac

[Preply lesson integration and setup](integrations/preply/README.md): OBS recording →
MacWhisper Pro Watch Folder (or free whisper.cpp) → local Ollama card curation → GitHub
publication and the existing pronunciation workflow. Requires one-time Mac setup and an
audio/classroom test; adding these files does not activate recording.
