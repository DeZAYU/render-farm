"""Regression test for the key scanner in sync_farm.py.
Run: python -I tools/cloud-render/test_sync_farm.py
Bug 2026-11-14: a news URL with 'achinsk-oil-...' matched 'sk-...' and blocked every sync."""
import os, sys, unittest
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sync_farm import SECRET

FAKE = ("s" + "k-") + "A1b2C3d4E5f6G7h8J9k0LmNo"          # built at run time so this file never trips the scanner


class SecretScan(unittest.TestCase):
    def test_word_ending_in_sk_is_not_a_key(self):
        url = b"https://www.example.com/2014/06/17/rosneft-halts-achinsk-oil-refinery-after-blast"
        self.assertIsNone(SECRET.search(url))

    def test_real_looking_key_is_caught(self):
        for pre in (b"", b" ", b"=", b'"', b"key: "):
            self.assertIsNotNone(SECRET.search(pre + FAKE.encode()), pre)


if __name__ == "__main__":
    unittest.main()
