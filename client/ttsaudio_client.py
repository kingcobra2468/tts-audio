import requests
import argparse
import base64
import sys


class TTSAudioClient:
    """TTSAudio Client
    """
    SET_VOLUME_API = '/audio/set-volume'
    GET_VOLUME_API = '/audio/get-volume'
    SAY_TEXT_API = '/speak/say'
    SEND_WAV_API = '/speak/play'

    def __init__(self, host, port, username=None, password=None):
        """Constructor

        Args:
            host (str): hostpath of the server
            port (int): port of the server
            username (str, optional): username if auth is enabled. Defaults to None.
            password (str, optional): password if auth is enabled. Defaults to None.
        """
        if host[-1] == '/': # fix broken input
            host = host[:-1]

        self._base_path = f'{host}:{port}'
        self.__headers = {}

        if username is not None or password is not None: # add BASIC auth header if auth enabled
            self.__basic_auth_header(username, password)

    def get_volume(self):
        """Gets the current set volume of the server

        Returns:
            requests.Response: Response object
        """
        resp = requests.get(f'{self._base_path}{self.GET_VOLUME_API}',
                                headers=self.__headers)
        return resp

    def set_volume(self, level):
        """Sets the volume of the server

        Args:
            level (int): audio level to be set

        Returns:
            requests.Response: Response object
        """
        args = {'level': level}

        resp = requests.get(url=f'{self._base_path}{self.SET_VOLUME_API}',
                                params=args, headers=self.__headers)
        return resp

    def say_text(self, text):
        """Perform text-to-speech operation

        Args:
            text (str): text to be translated to speech

        Returns:
            requests.Response: Response object
        """
        args = {'text': text}

        resp = requests.get(url=f'{self._base_path}{self.SAY_TEXT_API}',
                                params=args, headers=self.__headers)
        return resp

    def send_audio(self, wavfile_path):
        """Perform wave playback operation

        Args:
            wavfile_path (str): path to wave file

        Returns:
            requests.Response: Response object
        """
        args = {'audio': open(wavfile_path, 'rb')}

        resp = requests.post(url=f'{self._base_path}{self.SEND_WAV_API}',
                            files=args, headers=self.__headers)
        return resp

    def __basic_auth_header(self, username, password):
        """Generate BASE64 BASIC auth header

        Args:
            username (str): username of basic auth
            password (str): password of basic auth

        Raises:
            ValueError: If either username or password is None
        """
        if username is None or password is None:
            raise ValueError(f'Both username and password must be present for encoding to take place')
        
        creds = f"{username}:{password}"
        auth_base64 = base64.standard_b64encode(
            creds.encode('ascii')).decode()

        self.__headers['Authorization'] = f'BASIC {auth_base64}'

if __name__ == "__main__":
    
    parser = argparse.ArgumentParser(description='TTSAudio Client')
    parser.add_argument('--hostname', metavar='http(s?)://<hostname>', type=str,
                        help='hostname of the TTSAudio server', default='127.0.0.1')
    parser.add_argument('-p', '--port', metavar='<port>', type=int,
                        help='port of the TTSAudio server', default=8081)
    parser.add_argument('--username',  metavar='<username>', type=str, default=None,
                        help='username if auth enabled',
                        required='--password' not in sys.argv and '--username' in sys.argv)
    parser.add_argument('--password',  metavar='<password>', type=str, default=None,
                        help='password if auth enabled',
                        required='--username' not in sys.argv and '--password' in sys.argv)
    parser.add_argument('-s', '--set-volume', metavar='<volume>', type=int,
                        help='new volume of TTSAudio server')
    parser.add_argument('-g', '--get-volume', action='store_true',
                        help='get volume of TTSAudio server')
    parser.add_argument('-r', '--recording', metavar='<wav-recording>', type=str,
                        help='WAVE recording to be played on TTSAudio server')
    parser.add_argument('-t', '--tts', metavar='<text>', type=str,
                        help='text to be played on TTSAudio server')
    
    args = parser.parse_args()

    ttsaudio_client = TTSAudioClient(args.hostname, args.port, args.username, args.password)
    
    if args.set_volume:
        print(f'Setting volume to {args.set_volume}')
        resp = ttsaudio_client.set_volume(args.set_volume)
        print(f'TTSAudio response: {resp.content}')
    
    if args.get_volume:
        print(f'Getting volume')
        resp = ttsaudio_client.get_volume()
        print(f'TTSAudio response: {resp.content}')

    if args.recording:
        print(f'Playing WAVE recording {args.recording}')
        resp = ttsaudio_client.send_audio(args.recording)
        print(f'TTSAudio response: {resp.content}')

    if args.tts:
        print(f'playing text {args.tts}')
        resp = ttsaudio_client.say_text(args.tts)
        print(f'TTSAudio response: {resp.content}')