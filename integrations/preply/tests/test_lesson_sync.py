import base64
import copy
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import tempfile
import time
import types
import unittest
from unittest.mock import patch, Mock

SPEC = importlib.util.spec_from_file_location('lesson_sync', Path(__file__).resolve().parents[1] / 'lesson_sync.py')
m = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(m)

CARD = {'type': 'expression', 'en': 'I feel like going for a walk.',
        'es': 'Tengo ganas de dar un paseo.', 'note': 'Tener ganas de + infinitive.',
        'priority': 'essential', 'grammar': [{'text': 'Tengo', 'tense': 'present', 'mood': 'indicative'}]}
DECK = {'version': 1, 'updated_at': '2026-10-10', 'cards': [
    {'id': 'OLD001', 'type': 'word', 'es': 'adecuado / adecuada', 'en': 'suitable',
     'priority': 'essential', 'note': 'Keep this exact audio key.'}]}
TRANSCRIPT = 'Private name and address. Tutor: You can say tengo ganas de dar un paseo. Student: What does tengo ganas mean?'


class IntegrationTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.data = Path(self.temp.name)
        self.patcher = patch.object(m, 'DATA', self.data)
        self.patcher.start()
        self.addCleanup(self.patcher.stop)
        self.c = {**m.DEFAULT, 'tutor_consent': True, 'audio_tested': True}

    def test_exact_classroom_scoping_and_query_rotation(self):
        c = {**self.c, 'classroom_urls': ['https://preply.com/en/classroom/actual-room']}
        self.assertTrue(m.is_classroom('https://preply.com/en/classroom/actual-room?token=secret', c))
        for url in ['https://preply.com/en/messages', 'https://evilpreply.com/en/classroom/actual-room',
                    'https://preply.com.evil.test/en/classroom/actual-room', 'http://preply.com/en/classroom/actual-room']:
            self.assertFalse(m.is_classroom(url, c))
        with self.assertRaises(ValueError):
            m.classroom_key('https://preply.com/en')

    def test_append_preserves_every_existing_field_and_exact_audio_keys(self):
        original = copy.deepcopy(DECK)
        result, added = m.append_cards(DECK, [CARD], '2026-10-21')
        self.assertEqual(DECK, original)
        self.assertEqual(result['cards'][:-1], original['cards'])
        self.assertEqual(len(added), 1)
        self.assertEqual(result['updated_at'], '2026-10-21')
        again, added = m.append_cards(result, [CARD], '2026-10-22')
        self.assertEqual(again, result)
        self.assertEqual(added, [])

    def test_duplicate_spanish_even_with_new_english(self):
        deck, _ = m.append_cards(DECK, [CARD], '2026-10-21')
        result, added = m.append_cards(deck, [{**CARD, 'en': 'I want to take a walk.'}], '2026-10-22')
        self.assertEqual(result, deck)
        self.assertFalse(added)

    def test_rejects_missing_evidence_and_invalid_grammar(self):
        for change in [ {'evidence': 'Not actually in the lesson'},
                        {'grammar': [{'text': 'tengo', 'tense': 'present'}]},
                        {'grammar': [{'text': 'Tengo', 'form': 'imperfect'}]},
                        {'grammar': [{'text': 'Tengo', 'tense': 'present', 'occurrence': 2}]},
                        {'priority': 'everything-is-essential'} ]:
            with self.subTest(change=change), self.assertRaises(ValueError):
                m.validate_candidates([{**CARD, 'evidence': 'What does tengo ganas mean?', **change}], TRANSCRIPT)
        output = m.validate_candidates([{**CARD, 'evidence': 'What does tengo ganas mean?'}], TRANSCRIPT)
        self.assertEqual(output[0]['card']['category'], 'lesson')
        self.assertNotIn('evidence', output[0]['card'])

    def test_semantic_editor_can_choose_zero(self):
        pool = [{'card': CARD, 'evidence': 'What does tengo ganas mean?'}]
        with patch.object(m, 'llm', return_value={'keep': [], 'reason': 'Same learning objective.'}) as llm:
            self.assertEqual(m.select(self.c, pool, DECK), [])
            payload = llm.call_args.args[2]
            self.assertEqual(payload['existing_cards'][0]['es'], DECK['cards'][0]['es'])
            self.assertEqual(len(payload['existing_cards']), len(DECK['cards']))

    def test_long_lesson_review_is_bounded_and_includes_final_candidates(self):
        pool = [{'card': {**CARD, 'es': f'Unique objective {i}'}, 'evidence': str(i)} for i in range(61)]
        seen = []
        def editor(c, system, payload):
            batch = payload['candidates']
            self.assertLessEqual(len(batch), 24)
            self.assertEqual(len(payload['existing_cards']), len(DECK['cards']))
            seen.extend(x['evidence'] for x in batch)
            return {'keep': [len(batch) - 1]}
        with patch.object(m, 'llm', side_effect=editor):
            result = m.select(self.c, pool, DECK)
        self.assertEqual(result[-1]['es'], 'Unique objective 60')
        self.assertEqual(set(seen), {str(i) for i in range(61)})

    def test_publication_conflict_refetches_and_rechecks_semantics(self):
        concurrent, _ = m.append_cards(DECK, [CARD], '2026-10-21')
        conflict = subprocess.CalledProcessError(1, ['gh'], stderr='HTTP 409')
        with patch.object(m, 'fetch_deck', side_effect=[(DECK, 'old'), (concurrent, 'new')]), \
                patch.object(m, 'select', side_effect=[[CARD], []]) as select, \
                patch.object(m, 'github', side_effect=conflict) as api:
            result = m.publish(self.c, self.data, [{'card': CARD}])
        self.assertEqual(result, {'stage': 'done', 'count': 0})
        self.assertEqual(select.call_count, 2)
        self.assertEqual(api.call_count, 1)

    def test_preview_never_writes_github(self):
        with patch.object(m, 'fetch_deck', return_value=(DECK, 'sha')), \
                patch.object(m, 'select', return_value=[CARD]), patch.object(m, 'github') as api:
            result = m.publish(self.c, self.data, [], preview=True)
        self.assertEqual(result['stage'], 'review')
        api.assert_not_called()

    def test_atomic_audio_delivery_uses_unwatched_staging_directory(self):
        target = self.data / 'watch' / 'session.wav'
        def ffmpeg(args, **kwargs):
            output = Path(args[-1])
            self.assertNotEqual(output.parent, target.parent)
            self.assertFalse(target.exists())
            output.write_bytes(b'complete wav')
        with patch.object(m, 'run', side_effect=ffmpeg):
            m.audio_to_wav(self.data / 'recording.mkv', target)
        self.assertEqual(target.read_bytes(), b'complete wav')

    def test_never_takes_over_an_existing_obs_recording(self):
        client = Mock()
        client.get_record_status.return_value.output_active = True
        with patch.object(m, 'run'), patch.object(m, 'obs', return_value=client):
            with self.assertRaisesRegex(RuntimeError, 'already recording'):
                m.start_recording(self.c)
        client.start_record.assert_not_called()
        client.set_current_program_scene.assert_not_called()

    def test_recording_stop_is_saved_before_conversion(self):
        client = Mock()
        client.get_record_status.return_value.output_active = True
        client.stop_record.return_value.output_path = '/private/lesson.mkv'
        record = {'session': 'a' * 32, 'started': 123, 'previous_scene': 'Other'}
        with patch.object(m, 'obs', return_value=client), patch.object(m, 'notify'):
            m.stop_recording(self.c, record)
        job = m.read_json(self.data / 'jobs' / record['session'] / 'job.json')
        self.assertEqual(job['stage'], 'audio')
        self.assertEqual(job['audio'], '/private/lesson.mkv')
        self.assertIsNone(m.read_json(self.data / 'recording.json'))

    def test_completed_transcript_to_append_only_github_payload(self):
        job = self.data / 'jobs' / ('a' * 32)
        transcript = self.data / 'watch' / (job.name + '.txt')
        transcript.parent.mkdir()
        transcript.write_text(TRANSCRIPT)
        os.utime(transcript, (time.time() - 60, time.time() - 60))
        m.write_json(job / 'job.json', {'stage': 'transcribing', 'wav': '/private/audio.wav', 'created': time.time()})
        pool = [{'card': CARD, 'evidence': 'What does tengo ganas mean?'}]
        def curate(c, text, directory):
            self.assertEqual(text, TRANSCRIPT)
            m.write_json(directory / 'candidates.json', pool)
            return pool
        with patch.object(m, 'curate', side_effect=curate), \
                patch.object(m, 'select', return_value=[CARD]), \
                patch.object(m, 'fetch_deck', return_value=(DECK, 'blob-sha')), \
                patch.object(m, 'github', return_value={'commit': {'sha': 'commit-sha'}}) as api, \
                patch.object(m, 'notify'):
            m.process_job(self.c, job)
            m.process_job(self.c, job)  # Completed jobs are idempotent.
        payload = api.call_args.args[2]
        updated = json.loads(base64.b64decode(payload['content']))
        self.assertEqual(payload['sha'], 'blob-sha')
        self.assertEqual(updated['cards'][0], DECK['cards'][0])
        self.assertEqual(updated['cards'][1]['es'], CARD['es'])
        self.assertNotIn('Private name and address', json.dumps(updated))
        self.assertNotIn('evidence', updated['cards'][1])
        self.assertEqual(api.call_count, 1)
        self.assertEqual(m.read_json(job / 'job.json')['commit'], 'commit-sha')

    def test_second_processing_after_ambiguous_publish_does_not_duplicate(self):
        published, _ = m.append_cards(DECK, [CARD], '2026-10-21')
        with patch.object(m, 'fetch_deck', return_value=(published, 'fresh')), \
                patch.object(m, 'select', return_value=[CARD]), patch.object(m, 'github') as api:
            result = m.publish(self.c, self.data, [{'card': CARD}])
        self.assertEqual(result['count'], 0)
        api.assert_not_called()


if __name__ == '__main__':
    unittest.main()
