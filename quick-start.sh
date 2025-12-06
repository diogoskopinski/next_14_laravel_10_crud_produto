#!/bin/bash
# quick-start.sh - Inicialização rápida do projeto

echo "🚀 Inicializando projeto CRUD..."

# 1. Parar containers existentes
docker-compose down 2>/dev/null

# 2. Criar package-lock.json no frontend se não existir
cd frontend
if [ ! -f "package-lock.json" ]; then
    echo "Criando package-lock.json..."
    cat > package.json << 'PKGEOF'
{
  "name": "frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.0.4",
    "react": "^18",
    "react-dom": "^18"
  }
}
PKGEOF
    npm install --package-lock-only --no-audit --no-fund
fi
cd ..

# 3. Criar arquivos necessários do Next.js se não existirem
if [ ! -f "frontend/next.config.js" ]; then
    echo "Criando next.config.js..."
    cat > frontend/next.config.js << 'NEXTEOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true
}
module.exports = nextConfig
NEXTEOF
fi

if [ ! -f "frontend/app/page.js" ]; then
    echo "Criando página inicial..."
    mkdir -p frontend/app
    cat > frontend/app/page.js << 'PAGEEOF'
export default function Home() {
  return (
    <div style={{ padding: '50px', fontFamily: 'Arial' }}>
      <h1>🚀 Sistema CRUD - Laravel + Next.js</h1>
      <p>Projeto funcionando com Docker!</p>
      <div style={{ marginTop: '30px' }}>
        <h2>Serviços disponíveis:</h2>
        <ul>
          <li><a href="http://localhost:8000" target="_blank">Backend API (Laravel)</a></li>
          <li><a href="http://localhost:8000/api/products" target="_blank">API de Produtos</a></li>
          <li><a href="http://localhost:8000/api/health" target="_blank">Health Check</a></li>
        </ul>
      </div>
    </div>
  );
}
PAGEEOF
fi

if [ ! -f "frontend/app/layout.js" ]; then
    cat > frontend/app/layout.js << 'LAYOUTEOF'
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>CRUD System</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
LAYOUTEOF
fi

# 4. Iniciar containers
echo "Iniciando containers..."
docker-compose up -d

# 5. Aguardar inicialização
echo "Aguardando serviços iniciarem..."
sleep 15

# 6. Mostrar status
echo ""
echo "✅ PROJETO INICIADO!"
echo "==================="
echo ""
echo "🌐 SERVIÇOS:"
echo "   Backend API:  http://localhost:8000"
echo "   Frontend:     http://localhost:3001"
echo ""
echo "🔧 ENDPOINTS:"
echo "   Health Check: http://localhost:8000/api/health"
echo "   Produtos:     http://localhost:8000/api/products"
echo ""
echo "📊 LOGS:"
echo "   docker-compose logs -f"
echo "   docker-compose ps"
echo ""
