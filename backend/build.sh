#!/usr/bin/env bash

# Install ffmpeg and other required system packages
apt-get update
apt-get install -y ffmpeg

# Then install Python packages
pip install -r requirements.txt
