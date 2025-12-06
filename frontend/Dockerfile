FROM node:20-alpine

WORKDIR /app

# Copia apenas os arquivos de dependências primeiro (para melhor cache)
COPY package.json package-lock.json* ./

# Instala dependências
RUN npm ci --no-audit --no-fund

# Copia o restante do código
COPY . .

# Cria diretório .next
RUN mkdir -p .next

# Expõe a porta
EXPOSE 3000

# Comando para desenvolvimento
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0"]
