import datetime as dt
import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('news', Path(__file__).resolve().parents[1] / 'scripts/update_news.py')
news = importlib.util.module_from_spec(spec)
spec.loader.exec_module(news)

class FeedTests(unittest.TestCase):
    def test_rss_deduplicates_filters_external_urls_and_retains_source_dates(self):
        now = dt.datetime.now(dt.timezone.utc).strftime('%a, %d %b %Y %H:%M:%S GMT')
        xml = f'''<rss><channel>
        <item><title>New software &amp; tools</title><link>https://github.blog/new</link><pubDate>{now}</pubDate></item>
        <item><title>Duplicate</title><link>https://github.blog/new</link></item>
        <item><title>Bad link</title><link>javascript:alert(1)</link></item>
        <item><title>Other domain</title><link>https://evil.test/story</link></item>
        <item><title>Stale</title><link>https://github.blog/old</link><pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate></item>
        </channel></rss>'''
        rows = news.parse_feed(xml, 'Software', 'GitHub Blog', {'github.blog'})
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]['title'], 'New software & tools')
        self.assertIsNotNone(rows[0]['publishedAt'])
        self.assertNotIn('summary', rows[0])

    def test_atom_and_future_filter(self):
        now = dt.datetime.now(dt.timezone.utc).isoformat()
        future = (dt.datetime.now(dt.timezone.utc) + dt.timedelta(days=3)).isoformat()
        xml = f'''<feed xmlns="http://www.w3.org/2005/Atom">
        <entry><title>Research</title><link rel="alternate" href="https://huggingface.co/blog/research"/><published>{now}</published></entry>
        <entry><title>Future</title><link href="https://huggingface.co/blog/future"/><published>{future}</published></entry>
        </feed>'''
        rows = news.parse_feed(xml, 'AI & agents', 'Hugging Face', {'huggingface.co'})
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]['title'], 'Research')

    def test_url_validation_and_text_cleanup(self):
        for url in ['http://github.blog/a', 'https://github.blog.evil.test/a', 'https://secret@github.blog/a']:
            self.assertFalse(news.safe_url(url, {'github.blog'}))
        self.assertEqual(news.clean('<b>Hello</b> &amp; world'), 'Hello & world')
        self.assertIsNone(news.iso_date('not a date'))

if __name__ == '__main__':
    unittest.main()
