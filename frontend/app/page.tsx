export default function Home() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Sistema CRUD 1.4</h1>
        <p className="text-lg text-gray-600 mb-6">
          Frontend Next.js 14 conectado ao backend Laravel
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">Frontend</h2>
            <ul className="text-blue-700 space-y-1">
              <li>✓ Next.js 14.2.5</li>
              <li>✓ React 18</li>
              <li>✓ TypeScript</li>
              <li>✓ Tailwind CSS</li>
            </ul>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h2 className="text-xl font-semibold text-green-800 mb-2">Backend</h2>
            <ul className="text-green-700 space-y-1">
              <li>✓ Laravel 10</li>
              <li>✓ API REST</li>
              <li>✓ MySQL 8.0</li>
              <li>✓ Dockerizado</li>
            </ul>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h2 className="text-xl font-semibold text-purple-800 mb-2">Status</h2>
            <ul className="text-purple-700 space-y-1">
              <li>✓ Frontend: Online</li>
              <li>✓ Backend: Conectável</li>
              <li>✓ Database: Docker</li>
              <li>✓ API: {apiUrl}</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Endpoints da API</h3>
          <div className="bg-gray-800 text-green-400 p-4 rounded font-mono text-sm overflow-x-auto">
            {apiUrl}/products<br/>
            {apiUrl}/categories<br/>
            {apiUrl}/users
          </div>
        </div>
      </div>
    </div>
  )
}
