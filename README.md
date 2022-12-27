# chat-livre-sem-censura
A simple webchat made with PHP, resistant to censorship and devoted to free-speech.

## Mirrors (Onion)

http://taumkejpqvsbktzypxhikvphnlhevarxkoee2hdrfswzdfbrnekdxxad.onion/

## Install requirements (Debian)

`sudo apt-get install php`

## Running locally

`make run`

## Running on Docker

`make up`

## Running on Tor (Debian)

 - Install tor:

`sudo apt-get install tor`

 - Edit `/etc/tor/torrc` file and add the following lines

```
HiddenServiceDir /var/lib/tor/simple-webchat
HiddenServicePort 80 127.0.0.1:8000
```

 - Restart Tor service

`sudo service tor restart`

 - Initialize webserver

`make run`

 - Initalize Tor

`tor`

 - Check for .onion URL

`cat /var/lib/tor/simple-webchat/hostname`
