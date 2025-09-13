import React, { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts'
import TickerBar from './components/TickerBar'
import Card from './components/Card'

function SearchIcon({ size = 16 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="6"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  )
}

function ClockIcon({ size = 16 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  )
}

export default function App() {
  const [tickers, setTickers] = useState(sampleTickers)
  const [news, setNews] = useState(sampleNews)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    if (!selected && tickers && tickers.length) setSelected(tickers[0])
  }, [tickers, selected])

  const filteredNews = news.filter(n => {
    if (!query) return true
    return (n.title && n.title.toLowerCase().includes(query.toLowerCase())) || (n.source && n.source.toLowerCase().includes(query.toLowerCase()))
  })

  const sel = selected || { name: 'Cargando...', symbol: '—', price: '0', change: 0, volume: '—', sparkline: generateSpark(30, 100) }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-extrabold tracking-tight">CRYPTEX</div>
              <div className="text-xs text-gray-500">Noticias · Cripto · Bolsa · Economía</div>
            </div>
            <div className="flex-1 mx-4">
              <div className="relative">
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Buscar noticias, símbolos o fuentes..."
                  className="w-full rounded-full border border-gray-200 px-4 py-2 pl-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60">
                  <SearchIcon />
                </div>
              </div>
            </div>
            <nav className="flex items-center gap-4">
              <button className="px-3 py-1 rounded-md text-sm bg-indigo-600 text-white hover:bg-indigo-700">Suscribirse</button>
              <button className="px-3 py-1 text-sm rounded-md border">Iniciar sesión</button>
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="mb-6">
          <TickerBar tickers={tickers} onSelect={(t) => setSelected(t)} />
        </section>
        <section className="grid grid-cols-12 gap-6">
          <aside className="col-span-12 lg:col-span-4">
            <div className="space-y-4">
              <Card title="Resumen rápido">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Activo seleccionado</div>
                    <div className="text-lg font-semibold">{sel.name} ({sel.symbol})</div>
                  </div>
                  <div className="text-right">
                    <div className={\`text-lg font-semibold \${(sel.change || 0) >= 0 ? 'text-green-600' : 'text-red-600'}\`}>
                      {sel.price} USD
                    </div>
                    <div className="text-sm text-gray-500">{sel.change}%</div>
                  </div>
                </div>
              </Card>
              <Card title="Mercado hoy">
                <div className="space-y-3">
                  <div className="text-sm text-gray-500">Volumen (24h)</div>
                  <div className="font-medium">{sel.volume}</div>
                  <div className="mt-4">
                    <small className="text-gray-500">Mini-gráfica</small>
                    <div className="h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={sel.sparkline}>
                          <XAxis dataKey="time" hide />
                          <Tooltip />
                          <Line type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </Card>
              <Card title="Eventos económicos">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <ClockIcon />
                    <div>
                      <div className="text-sm font-medium">Conf. de prensa del BCE</div>
                      <div className="text-xs text-gray-500">Hoy · 14:30 CET</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <ClockIcon />
                    <div>
                      <div className="text-sm font-medium">Informe de desempleo (EE. UU.)</div>
                      <div className="text-xs text-gray-500">Mañana · 13:30 CET</div>
                    </div>
                  </li>
                </ul>
              </Card>
            </div>
          </aside>
          <section className="col-span-12 lg:col-span-8">
            <Card title="Noticias del mercado">
              <div className="space-y-4">
                {filteredNews.map(item => (
                  <article key={item.id} className="p-4 border rounded-md hover:shadow-sm transition">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-14 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
                        <img src={item.image} alt={item.title || 'thumb'} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{item.title}</h3>
                          <div className="text-xs text-gray-400">{item.time}</div>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-3">{item.summary}</p>
                        <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
                          <span>{item.source}</span>
                          <span>·</span>
                          <button className="text-indigo-600 underline text-sm">Leer</button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </Card>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Movimientos principales">
                <ul className="space-y-2">
                  {tickers.slice(0,5).map(t => (
                    <li key={t.symbol} className="flex items-center justify-between">
                      <div className="font-medium">{t.symbol}</div>
                      <div className={\`text-sm \${t.change >= 0 ? 'text-green-600' : 'text-red-600'}\`}>{t.change}%</div>
                    </li>
                  ))}
                </ul>
              </Card>
              <Card title="Análisis rápido">
                <div>
                  <p className="text-sm text-gray-600">Conecta tu servicio de análisis o añade indicadores técnicos (RSI, MACD) aquí.</p>
                </div>
              </Card>
            </div>
          </section>
        </section>
      </main>
      <footer className="border-t bg-white/60 backdrop-blur text-gray-600">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>© {new Date().getFullYear()} CRYPTEX — Datos de mercado no profesionales.</div>
          <div className="text-sm">Hecho con ❤️ · Diseño responsivo</div>
        </div>
      </footer>
    </div>
  )
}

function generateSpark(points = 20, base = 1000) {
  const out = []
  for (let i = 0; i < points; i++) {
    const noise = (Math.random() - 0.5) * Math.max(1, base * 0.05)
    const value = typeof base === 'number' ? Math.round((base + noise) * 100) / 100 : base
    out.push({ time: i, value })
  }
  return out
}

const sampleTickers = [
  { symbol: 'BTC', name: 'Bitcoin', price: '61,432.21', change: 2.4, volume: '23.4B', sparkline: generateSpark(30, 59000) },
  { symbol: 'ETH', name: 'Ethereum', price: '3,412.08', change: -1.2, volume: '10.2B', sparkline: generateSpark(30, 3200) },
  { symbol: 'AAPL', name: 'Apple Inc.', price: '173.45', change: 0.9, volume: '5.4B', sparkline: generateSpark(30, 168) },
  { symbol: 'TSLA', name: 'Tesla', price: '265.78', change: -0.6, volume: '3.2B', sparkline: generateSpark(30, 260) },
  { symbol: 'XRP', name: 'Ripple', price: '0.92', change: 5.1, volume: '1.1B', sparkline: generateSpark(30, 0.9) },
]

const sampleNews = [
  { id: '1', title: 'Bitcoin rompe resistencia y alcanza nuevos máximos locales', summary: 'El precio de Bitcoin superó resistencias clave...', source: 'Reuters', time: '2h', image: 'https://images.unsplash.com/photo-1615544642935-7f7c3a6f0f6a?q=80&w=800' },
  { id: '2', title: 'Acciones tecnológicas impulsan el mercado', summary: 'Las principales firmas registraron beneficios por encima de lo esperado...', source: 'Bloomberg', time: '4h', image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800' },
  { id: '3', title: 'BCE mantiene tipos: impacto en divisas', summary: 'La decisión del BCE estuvo en línea con las expectativas...', source: 'Financial Times', time: '1d', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800' },
]
