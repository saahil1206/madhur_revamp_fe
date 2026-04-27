import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

function toSlug(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getGameIcon(name) {
  const text = String(name || '').toLowerCase();
  if (text.includes('morning')) return 'fas fa-cloud-sun';
  if (text.includes('evening')) return 'fas fa-cloud-moon';
  if (text.includes('night')) return 'fas fa-moon';
  if (text.includes('day')) return 'fas fa-sun';
  if (text.includes('time')) return 'fas fa-clock';
  if (text.includes('shubhank')) return 'fas fa-water';
  return 'fas fa-circle';
}

function getGroupName(name) {
  const base = String(name || '').trim();
  if (!base) return 'Others';
  const firstWord = base.split(/\s+/)[0];
  return firstWord || 'Others';
}

function GamesPage() {
  const [activeTab, setActiveTab] = useState('bazaar')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

  useEffect(() => {
    const fetchBazars = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await fetch(`${apiBaseUrl}/api/bazar`)
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data?.message || 'Failed to load bazaar games')
        }
        setRows(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err.message || 'Failed to load bazaar games')
        setRows([])
      } finally {
        setLoading(false)
      }
    }

    fetchBazars()
  }, [apiBaseUrl])

  const bazaarGames = useMemo(() => {
    const grouped = new Map()

    rows.forEach((row) => {
      const label = row?.bazar_name || ''
      if (!label) return

      const groupName = getGroupName(label)
      if (!grouped.has(groupName)) {
        grouped.set(groupName, { name: groupName, games: [] })
      }

      grouped.get(groupName).games.push({
        label,
        icon: getGameIcon(label),
        slug: toSlug(label),
      })
    })

    return Array.from(grouped.values())
  }, [rows])

  return (
    <>
      <div className="game-tabs-wrapper mt-4">
        <div className="container">
          <ul className="nav game-tabs" role="tablist">
            <li className="nav-item" role="presentation">
              <button className={`game-tab-btn ${activeTab === 'bazaar' ? 'active' : ''}`} onClick={() => setActiveTab('bazaar')}>Bazaar Games</button>
            </li>
            <li className="nav-item" role="presentation">
              <button className={`game-tab-btn ${activeTab === 'other' ? 'active' : ''}`} onClick={() => setActiveTab('other')}>Other Games</button>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mt-4 px-2 px-md-3">
        <div>
          {activeTab === 'bazaar' && (
            <div className="games-list-container p-4">
              {loading && <p className="text-white mb-0">Loading bazaar games...</p>}
              {!loading && error && <p className="text-danger mb-0">{error}</p>}
              {!loading && !error && (
                <div className="accordion" id="bazaarAccordion">
                  {bazaarGames.map((category, i) => {
                    const collapseId = `collapse${category.name.replace(/\s/g, '')}`
                    return (
                      <div className="accordion-item game-accordion-item" key={i}>
                        <h2 className="accordion-header">
                          <button
                            className="accordion-button collapsed game-accordion-btn"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#${collapseId}`}
                          >
                            {category.name}
                          </button>
                        </h2>
                        <div id={collapseId} className="accordion-collapse collapse" data-bs-parent="#bazaarAccordion">
                          <div className="accordion-body game-accordion-body">
                            <div className="row g-2 g-md-3">
                              {category.games.map((game, j) => (
                                <div className="col-6 col-sm-4 col-md-3" key={j}>
                                  <Link to={`/games/${game.slug}/calendar`} className="text-decoration-none">
                                    <div className="game-card">
                                      <div className="game-card-icon">
                                        <i className={game.icon}></i>
                                      </div>
                                      <p className="game-card-label">{game.label}</p>
                                    </div>
                                  </Link>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'other' && (
            <div className="games-list-container p-4">
              <p className="text-white">Other games will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default GamesPage
