#! /bin/bash

/usr/local/ffmpeg -i "video.mov" -an -f image2 -vf fps=fps=4 f_%05d.png