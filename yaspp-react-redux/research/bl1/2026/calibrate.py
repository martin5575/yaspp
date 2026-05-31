#!/usr/bin/env python3
"""
BL1 2026/27 season — calibrate team parameters using 2025/26 (BL1 2025) data.
Run from repo root:  python3 research/bl1/2026/calibrate.py
"""
import os, sys, runpy

# Add parent directory so we can import / exec the shared script
HERE = os.path.dirname(os.path.abspath(__file__))
sys.argv = [sys.argv[0], '2026', '2025']
runpy.run_path(os.path.join(os.path.dirname(HERE), 'calibrate.py'), run_name='__main__')
