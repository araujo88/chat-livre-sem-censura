run-local:
	php -S 127.0.0.1:8000

up:
	docker compose up

build:
	docker compose up --build

clean-html:
	sed -i '/^/d' log.html

clean:
	rm -rf log.html
