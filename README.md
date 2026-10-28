# Mi Español

A personal, offline-capable Spanish flashcard app with priority-first vocabulary, two-way spaced repetition, curated grammar annotations, and cached Google pronunciation.

**[Open Mi Español](https://awashtype.github.io/mi-espanol/)**

## Start here for future Spanish chats and app changes

**[Read the Mi Español vocabulary & study guidelines](MI_ESPANOL_GUIDELINES.md).** This is the permanent reference for curating new vocabulary from Spanish lessons and tareas, marking Essential / Useful / Extra, annotating subjunctive and other verb forms correctly, using natural Argentine Spanish, protecting existing audio, and preserving learning history.

For adding new cards, check [cards.json](cards.json) after reading the guidelines. The current web app and review logic are in [index.html](index.html). For pronunciation generation see [scripts/generate_audio.py](scripts/generate_audio.py).

> Browser and installed Home Screen app review histories are currently local and may be different. Use Settings → Save progress backup and restore to transfer progress; the app does not provide real-time cloud sync.

## Contextual phrases and real conversation practice

[Conversation protocol](CONVERSATION_PRACTICE.md) · [Tutor archive](sessions/README.md) · [Scene index](scenarios.json). Say **“rebuild conversation from my current mi español list”** to practice a partly familiar batch in a reconstructed tutor scene, one turn at a time.

## Account version

[Open the private account version](https://mi-espanol-thea.wrytoad39.chatgpt.site). To keep existing familiarity, open the original app **on the device/copy where you study**, then choose **Settings → Connect account & keep my progress**. Sign in with ChatGPT; after the one-time transfer, progress syncs automatically. Offline study is retained. See guideline section 15 for implementation and conflict behavior.
