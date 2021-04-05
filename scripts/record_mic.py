import pyaudio
import wave
import time
import argparse
import threading
import sys


class WavRecorder():
    """Generate .wav records
    """

    FORMAT = pyaudio.paInt16  # 16 bit pyaudio sample format
    CHANNELS = 2  # number of channels
    RATE = 44100  # frame rate
    CHUNK = 1024  # frames per sample

    def __init__(self, filename, **kwargs):
        """Constructor

        Args:
            filename (str): output filename
        """
        if not filename.find(".wav"):  # add extension if missing
            filename = filename + ".wav"

        self.__filename = filename
        self.__audio = pyaudio.PyAudio()
        self.__audio_stream = self.__audio.open(**kwargs, format=self.FORMAT,
                                                channels=self.CHANNELS, rate=self.RATE)

    def _write_recording(self, frames):
        """Dump recording frames into a .wav file

        Args:
            frames (list): buffer holding audio frames
        """
        waveFile = wave.open(self.__filename, 'wb')

        # adjust necessary wave properties
        waveFile.setnchannels(self.CHANNELS)
        waveFile.setsampwidth(self.__audio.get_sample_size(self.FORMAT))
        waveFile.setframerate(self.RATE)
        waveFile.writeframes(b''.join(frames))

        waveFile.close()

    def listen(self, seconds):
        """Listen for x amount of seconds before terminating the recording

        Args:
            seconds (int): seconds that the recording should last
        """
        buffer = []  # buffer to store the stream

        for _ in range(0, self.RATE // self.CHUNK * seconds):  # read set number of chunks

            data = self.__audio_stream.read(self.CHUNK)  # read in a chunk
            buffer.append(data)

        # terminate the stream
        self.__audio_stream.stop_stream()
        self.__audio_stream.close()
        self.__audio.terminate()

        self._write_recording(buffer)  # dump buffer into a file

    def listen_till_stop(self):
        """Perform a blocking operation and keep recording until user input.
        """
        self.__stop_flag = False # stop listening flag
        self.__stop_lock = threading.Lock() # lock to ensure there arent any race conditions in stop_flag
        buffer = []

        def stop_listening(self):
            """Listen for user inpu to know when to stop recording
            """
            _ = input("press enter key to stop recording")
            
            # atomic operation of updating flag
            self.__stop_lock.acquire()
            self.__stop_flag = True
            self.__stop_lock.release()

        stop_thread = threading.Thread(target=stop_listening, args=(self,)) # thread to listen for user interrupt 
        stop_thread.start()

        while not self.__stop_flag: # record chunk while user hasnt interrupted yet

            data = self.__audio_stream.read(self.CHUNK)
            buffer.append(data)

        stop_thread.join() # cleanup the thread

        self.__audio_stream.stop_stream()
        self.__audio_stream.close()
        self.__audio.terminate()

        self._write_recording(buffer)


if __name__ == "__main__":

    parser = argparse.ArgumentParser(description='Recording Utility')
    parser.add_argument('-f', '--file', metavar="<file_name>", type=str,
                        help="name of file to dump", default=time.strftime("%m-%d-%y_%M_%H_%S") + ".wav")
    parser.add_argument('-s', '--seconds', metavar="<seconds>", type=int,
                        help="number of seconds to record", default=5)
    parser.add_argument('-c', '--continous', action='store_true',
                        help="continous recording till key pressed")

    if len(sys.argv) < 2:

        parser.print_help()
        sys.exit(0)

    cl_input = parser.parse_args()
    recorder = WavRecorder(filename=cl_input.file, input=True)

    if cl_input.continous:
        recorder.listen_till_stop()
    else:
        recorder.listen(input.seconds)
