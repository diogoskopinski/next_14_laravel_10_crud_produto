import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sistema CRUD',
  description: 'Next.js + Laravel',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gray-50">
        <nav className="bg-blue-600 text-white p-4 shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">CRUD System</h1>
            <div className="space-x-4">
              <a href="/" className="hover:text-blue-200">Dashboard</a>
              <a href="/products" className="hover:text-blue-200">Produtos</a>
              <a href="/categories" className="hover:text-blue-200">Categorias</a>
            </div>
          </div>
        </nav>
        <main className="container mx-auto p-4">
          {children}
        </main>
        <footer className="bg-gray-800 text-white p-4 mt-8">
          <div className="container mx-auto text-center">
            <p>Sistema desenvolvido com Next.js 14 e Laravel 10</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
