import os
import glob
import subprocess
import threading
import time
import shutil
from datetime import datetime

count = 0
save_directory_parent = '/home/pi/webplotter/timelapse/'

isExist = os.path.exists(save_directory_parent)
if not isExist:
  os.makedirs(save_directory_parent)

with open('/home/pi/webplotter/design.txt') as f:
    design = f.readlines()

#save_directory_child = os.path.join(save_directory_parent,os.environ["PLOTDESIGN"] + "_" + datetime.now().strftime('%Y-%m-%d_%H-%M-%S') + '/')
save_directory_child = os.path.join(save_directory_parent,datetime.now().strftime('%Y-%m-%d_%H-%M-%S') + '/')

isExist = os.path.exists(save_directory_child)
if not isExist:
  os.makedirs(save_directory_child)

shutil.copyfile('/home/pi/webplotter/design.txt', save_directory_child + 'design.txt')

#command = 'libcamera-jpeg -o ' + save_directory_child + '{}.jpg -n -t 1 --shutter 8000 --exposure sport --awb tungsten --width 1920 --height 1080'
#command = 'libcamera-still -e png -o ' + save_directory_child + '{}.png -n -t 1 --shutter 4000 --exposure sport --awb tungsten'
command = 'v4l2-ctl --device /dev/video0 --set-fmt-video=width=2560,height=1440,pixelformat=MJPG --stream-mmap --stream-to=' + save_directory_child + '{}.jpg --stream-count=1'

#files = glob.glob('/home/pi/webplotter/timelapse/*')
#for f in files:
#    os.remove(f)
while True:
    count+=1
    subprocess.run(command.format("{:08d}".format(count)), shell=True) #run with blocking
    #subprocess.Popen(command.format("{:08d}".format(count)), shell=True) #run in background
    time.sleep(2)
