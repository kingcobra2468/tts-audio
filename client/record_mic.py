#CLI Utility for recording microphone input either in continous mode (until enter key press) or in timed mode 
#where microphone is being for a certain amount of seconds. Run with -h flag to get more info on flags or read the code...

import pyaudio
import wave
import time
import argparse
import threading
import sys

FORMAT = pyaudio.paInt16
CHANNELS = 2
RATE = 44100
CHUNK = 1024

class Recorder():

    __audio = None
    __config = {}

    def __init__(self, file_name, **kwargs):
        #super().__init__()

        if not file_name.find(".wav"):
            file_name = file_name + ".wav"

        self.__file_name = file_name
        self.__audio = pyaudio.PyAudio()
        self.__audio_stream = self.__audio.open(**kwargs)
        self.__config = kwargs
    
    def _write_recording(self, frames):
        
        waveFile = wave.open(self.__file_name, 'wb')
        waveFile.setnchannels(self.__config['channels'])
        waveFile.setsampwidth(self.__audio.get_sample_size(self.__config['format']))
        waveFile.setframerate(self.__config['rate'])
        waveFile.writeframes(b''.join(frames))
        waveFile.close() 

    def listen(self, seconds):

        frames = []
        
        if self.__config['frames_per_buffer'] is None:
            self.__config['frames_per_buffer'] = 1024;

        for i in range(0, int(self.__config['rate'] / self.__config['frames_per_buffer'] * seconds)):
            
            data = self.__audio_stream.read(self.__config['frames_per_buffer'])
            frames.append(data)

        self.__audio_stream.stop_stream()
        self.__audio_stream.close()
        self.__audio.terminate()

        self._write_recording(frames)
    
    def listen_till_stop(self):
        
        self.STOP_LISTENING = False
        frames = []

        def stop_listening(self):
            
            _ = input("press enter key to stop recording")
            self.STOP_LISTENING = True
            print("stopped")
        
        if self.__config['frames_per_buffer'] is None:
            self.__config['frames_per_buffer'] = 1024;
        
        stop_thread = threading.Thread(target = stop_listening, args = (self,))
        stop_thread.start()

        while not self.STOP_LISTENING:
            
            data = self.__audio_stream.read(self.__config['frames_per_buffer'])
            frames.append(data)

        stop_thread.join()

        self.__audio_stream.stop_stream()
        self.__audio_stream.close()
        self.__audio.terminate()

        self._write_recording(frames)

parser = argparse.ArgumentParser(description = 'Recording Utility')
parser.add_argument('-f', '--file', metavar = "<file_name>", type = str,
    help = "name of file to dump", default = time.strftime("%m-%d-%y_%M_%H_%S") + ".wav")
parser.add_argument('-s', '--seconds', metavar = "<seconds>", type = int,
    help = "number of seconds to record", default = 5)
parser.add_argument('-c', '--continous', action = 'store_true',
    help = "continous recording till key pressed")

if len(sys.argv) < 2:
    
    parser.print_help()
    sys.exit(0)

cl_input = parser.parse_args()

recorder = Recorder(file_name = cl_input.file, format = FORMAT, channels = CHANNELS,
    rate = RATE, input = True, frames_per_buffer = CHUNK)

if cl_input.continous:
    recorder.listen_till_stop()
else:
    recorder.listen(input.seconds)