run:
	php -S 127.0.0.1:8000

clean-html:
	sed -i '/^/d' log.html

clean:
	rm -rf log.html