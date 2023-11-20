#!/bin/bash
# RClone Config file
RCLONE_CONFIG=/home/pi/.config/rclone/rclone.conf
export RCLONE_CONFIG

#exit if running
if [[ "`pidof -x $(basename $0) -o %PPID`" ]]; then exit; fi

# Move older local files to the cloud
/usr/bin/rclone --config="/home/pi/.config/rclone/rclone.conf" move /home/pi/webplotter/timelapse storage:cache/appdata/nginx/www/data
