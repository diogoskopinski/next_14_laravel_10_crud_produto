#!/bin/bash
# start.sh - Script para iniciar/parar o sistema

case "$1" in
    "start")
        echo "🚀 Iniciando sistema CRUD..."
        docker-compose up -d
        echo "✅ Sistema iniciado!"
        echo ""
        echo "📊 Serviços disponíveis:"
        echo "   Frontend:    http://localhost:3001"
        echo "   Backend:     http://localhost:8001"
        echo "   PHPMyAdmin:  http://localhost:8081"
        ;;
    "stop")
        echo "🛑 Parando sistema CRUD..."
        docker-compose down
        echo "✅ Sistema parado!"
        ;;
    "restart")
        echo "🔄 Reiniciando sistema CRUD..."
        docker-compose restart
        echo "✅ Sistema reiniciado!"
        ;;
    "logs")
        echo "📋 Mostrando logs..."
        docker-compose logs -f
        ;;
    "status")
        echo "📊 Status dos serviços:"
        docker-compose ps
        ;;
    "build")
        echo "🔨 Reconstruindo containers..."
        docker-compose down
        docker-compose build --no-cache
        docker-compose up -d
        echo "✅ Containers reconstruídos!"
        ;;
    *)
        echo "🎯 Sistema de CRUD com Laravel + Next.js"
        echo ""
        echo "📋 COMANDOS DISPONÍVEIS:"
        echo "   ./start.sh start    - Iniciar sistema"
        echo "   ./start.sh stop     - Parar sistema"
        echo "   ./start.sh restart  - Reiniciar sistema"
        echo "   ./start.sh logs     - Ver logs"
        echo "   ./start.sh status   - Ver status"
        echo "   ./start.sh build    - Reconstruir containers"
        echo ""
        echo "🎮 Exemplo: ./start.sh start"
        ;;
esac