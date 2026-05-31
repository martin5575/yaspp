#!/usr/bin/env python3
"""
BL1 2025/26 season — calibrate team parameters using 2024/25 (BL1 2024) data.
Run from repo root:  python3 research/bl1/2025/calibrate.py
"""
import os, sys, runpy

HERE = os.path.dirname(os.path.abspath(__file__))
sys.argv = [sys.argv[0], '2025', '2024']
runpy.run_path(os.path.join(os.path.dirname(HERE), 'calibrate.py'), run_name='__main__')
