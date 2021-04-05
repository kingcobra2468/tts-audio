# TTSAudio

#### A text-to-speech and wave file playback REST service. Play wave files remotely or translate text into speech via the [Festival Speech Synthesis System](http://festvox.org/festival/) utility. 

## **Configuration**

### **Dotenv File**
A `.env`  file needs to be created (or copied from `.sample-env`) inside of `/ttsaudio_server` directory if configuration is desired to be done via dotenv. Variables in the `.env` file include:
- **TTS_AUTH_ENABLED=** {true, false} toggle basic authentication
- **TTS_USERNAME=** auth username
- **TTS_PASSWORD=** auth password
- **TTS_PORT=** server port
- **TTS_HOST=** server host

### **Config File**
While a `.env` file has priority for configuration, `config.js` could also be used to setup TTSAudio. Likewise, some configuration is only accessable via `config.js` file. Settings in the `config.js` file include:
- **TTS_AUTH_ENABLED=** {true, false} toggle basic authentication
- **TTS_USERNAME=** auth username
- **TTS_PASSWORD=** auth password
- **TTS_PORT=** server port
- **TTS_HOST=** server host
- **LOG_FILE=** set request logger file path/name

## **REST API**
Communicate with TTSAudio could be achieved by calling the following REST methods:
- `/api/audio/set-volume?level=<level>` **[PUT]** - updates the volume level
- `/api/audio/get-volume>` **[GET]** - get the volume level
- `/api/speak/say?text=<text>` **[POST]** - play text via text-to-speech
- `/api/speak/play` **[POST]** - play wave file. Name the file as **audio** in the multipart/form-data request.

## **Installation Steps (via apt)**
Note: Installation steps 2 & 3 could also be achieved by running `installer.sh`.
1. Clone the repository onto local machine
2. `sudo apt-get update`
3. Install dependencies with `apt-get install portaudio19-dev festival alsa-utils nodejs`
4. Go into `/ttsaudio_server` and install npm packages with `npm install`
5. Build TTSAudio with webpack using `npm run build`
6. Run via `npm run start`

## **Client**
A python cli tool,  `ttsaudio_client.py` ,  exists for communicating with TTSAudio under `/client`.

### **CommandLine Options**
See complete argument list with `-?` flag. Note parser will evaluate volume requests before recording/tts. Also, recording will get evaluated before tts.
- `--hostname` hostname of TTSAudio server. Enter as `http(s?)://<hostname>`.
- `-p/--port` port of TTSAudio server.
- `--username` username if basic auth enabled.
- `--password` password if basic auth enabled.
- `-s/--set-volume` set volume of the machine.
- `-g/--get-volume` get volume of the machine.
- `-r/--recording` path/file to wave recording.
- `-t/--tts` text to be played.

### **Installation**
1. Install python3
2. Install dependencies with `pip3 install -r requirements.txt`

## Miss.

### **Wave File generation**
A python cli tool,  `record_mic.py` ,  exists for generating wave files under `/scripts`.

### **CommandLine Options**
See complete argument list with `-?` flag.
- `-f/--file` output file for wave recording. Default filename follows format `"%m-%d-%y_%M_%H_%S"`
- `-s/--seconds` second mode. Record for only # of seconds before recording stops.
- `-c/--continous` continous mode. Record until any key is pressed.

### **Installation**
1. Install python3
2. Install dependencies with `pip3 install -r requirements.txt`