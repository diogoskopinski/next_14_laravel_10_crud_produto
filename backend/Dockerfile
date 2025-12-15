FROM php:8.2-fpm-alpine

# Instala dependências do sistema
RUN apk add --no-cache \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libzip-dev \
    zip \
    unzip \
    curl \
    git \
    oniguruma-dev \
    libxml2-dev \
    postgresql-dev \
    icu-dev

# Configura GD com suporte a JPEG e FreeType
RUN docker-php-ext-configure gd --with-freetype --with-jpeg

# Instala extensões PHP
RUN docker-php-ext-install \
    pdo \
    pdo_mysql \
    pdo_pgsql \
    mysqli \
    mbstring \
    zip \
    gd \
    exif \
    intl \
    opcache

# Habilita OPcache para produção
RUN { \
    echo 'opcache.enable=1'; \
    echo 'opcache.memory_consumption=128'; \
    echo 'opcache.interned_strings_buffer=8'; \
    echo 'opcache.max_accelerated_files=4000'; \
    echo 'opcache.revalidate_freq=2'; \
    echo 'opcache.fast_shutdown=1'; \
    echo 'opcache.enable_cli=1'; \
} > /usr/local/etc/php/conf.d/opcache-recommended.ini

# Instala Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configura diretório de trabalho
WORKDIR /var/www/html

# Copia arquivos do projeto
COPY . .

# Instala dependências PHP (sem dev)
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction

# Gera chave da aplicação se não existir
RUN if [ ! -f .env ]; then \
    cp .env.example .env && \
    php artisan key:generate; \
fi

# Ajusta permissões
RUN chown -R www-data:www-data storage bootstrap/cache
RUN chmod -R 775 storage bootstrap/cache

# Expõe porta
EXPOSE 8000

# Comando de inicialização
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
