FROM node:20-alpine AS builder

WORKDIR /app

# Copia apenas arquivos de dependências primeiro
COPY package.json package-lock.json* ./

# Instala dependências
RUN npm ci --no-audit --no-fund --legacy-peer-deps

# Copia código fonte
COPY . .

# Build de produção com output standalone
RUN npm run build

# Imagem final leve
FROM node:20-alpine AS runner

WORKDIR /app

# Define usuário não-root (segurança)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copia package.json para identificar o app
COPY --from=builder /app/package.json ./package.json

# Copia a build standalone
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Copia a pasta static
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copia a pasta public (IMPORTANTE: do builder, não de .next/standalone)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Muda para usuário não-root
USER nextjs

# Expõe porta
EXPOSE 3000

# Variáveis de ambiente
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV=production

# Comando de inicialização
CMD ["node", "server.js"]