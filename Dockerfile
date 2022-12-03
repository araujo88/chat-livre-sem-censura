FROM php:7.4-apache
WORKDIR /app
COPY . /app
EXPOSE 8000

CMD php -S 0.0.0.0:8000
