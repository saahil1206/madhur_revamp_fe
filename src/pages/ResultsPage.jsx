import { useEffect, useMemo, useState } from 'react'

const cardThemes = [
  { guessBoxClass: 'rs-guess-box', bodyClass: 'rs-body-purple', headerClass: 'rs-header-purple', cardClass: 'rs-card-purple' },
  { guessBoxClass: 'rs-guess-box-blue', bodyClass: 'rs-body-teal', headerClass: 'rs-header-teal', cardClass: 'rs-card-teal' },
  { guessBoxClass: 'rs-guess-box-yellow', bodyClass: 'rs-body-yellow', headerClass: 'rs-header-yellow', cardClass: 'rs-card-yellow' },
]

function normalizeBazarType(value) {
  const text = String(value || '').trim().toLowerCase()
  if (text === 'elite' || text === 'elite bazar') return 'elite'
  if (text === 'premium' || text === 'premium bazar') return 'premium'
  return 'normal'
}

function ResultsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('All')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

  const fetchTodayResults = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${apiBaseUrl}/api/results/today`)

      if (!response.ok) {
        throw new Error('Failed to load result data.')
      }

      const data = await response.json()
      setResults(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Failed to load result data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTodayResults()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const mergedResults = useMemo(() => {
    const grouped = new Map()

    results.forEach((row) => {
      const key = `${row.bazar_id}-${row.result_date}`
      const current = grouped.get(key) || {
        id: key,
        title: row.bazar?.bazar_name || `Bazar ${row.bazar_id}`,
        type: 'Jodi',
        notice: row.bazar?.Notice || '',
        bazarType: normalizeBazarType(row.bazar?.bazar_category),
        openPana: '--',
        openAakda: '-',
        closeAakda: '-',
        closePana: '--',
      }

      if (row.bazar?.bazar_name) {
        current.title = row.bazar.bazar_name
      }
      if (row.bazar?.Notice) {
        current.notice = row.bazar.Notice
      }
      current.bazarType = normalizeBazarType(row.bazar?.bazar_category)

      if (row.result_type === 'open') {
        current.openPana = row.result_pana || '--'
        current.openAakda = row.result_AAkda || '-'
      }
      if (row.result_type === 'close') {
        current.closeAakda = row.result_AAkda || '-'
        current.closePana = row.result_pana || '--'
      }

      grouped.set(key, current)
    })

    return Array.from(grouped.values())
  }, [results])

  const filteredResults = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    return mergedResults.filter((item) => {
      const searchOk = !term || item.title.toLowerCase().includes(term)
      const filterMap = {
        'Normal Bazar': 'normal',
        'Elite Bazar': 'elite',
        'Premium Bazar': 'premium',
      }
      const wanted = filterMap[filter]
      const filterOk = filter === 'All' || item.bazarType === wanted
      return searchOk && filterOk
    })
  }, [mergedResults, searchTerm, filter])

  return (
    <>
      {/* Search & Filter Bar */}
      <div className="container mt-4">
        <div className="row align-items-center">
          <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12 mb-sm-2 mb-2 mb-md-0">
            <div className="result-search-box">
              <input type="text" className="result-search-input" placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <i className="fas fa-search result-search-icon"></i>
            </div>
          </div>
          <div className="col-xl-8 col-lg-8 col-md-8 col-sm-12 col-12 d-flex justify-content-md-end justify-content-start gap-3">
            <button className="btn result-refresh-btn" onClick={fetchTodayResults}>Refresh</button>
            <select className="result-filter-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option>All</option>
              <option>Normal Bazar</option>
              <option>Elite Bazar</option>
              <option>Premium Bazar</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bazar Type Legend */}
      <div className="container mt-3">
        <div className="d-flex align-items-center gap-4 flex-wrap">
          <div className="d-flex align-items-center gap-2">
            <span className="bazar-dot bazar-dot-normal"></span>
            <span className="text-white poppins-regular font-size-14">Normal Bazar</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="bazar-dot bazar-dot-elite"></span>
            <span className="text-white poppins-regular font-size-14">Elite Bazar</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="bazar-dot bazar-dot-premium"></span>
            <span className="text-white poppins-regular font-size-14">Premium Bazar</span>
          </div>
        </div>
      </div>

      <div className="game-tabs-wrapper mt-4"></div>

      {/* Result Cards */}
      <div className="container mt-4 pb-5">
        {loading && <p className="text-white poppins-regular">Loading results...</p>}
        {!loading && error && <p className="text-danger poppins-regular">{error}</p>}
        {!loading && !error && filteredResults.length === 0 && <p className="text-white poppins-regular">No result data found.</p>}

        {!loading && !error && filteredResults.map((card, i) => {
          const theme = cardThemes[i % cardThemes.length]
          const guessingDigits = String(card.notice || '')
            .replace(/\s+/g, '')
            .match(/\d/g) || []
          const fourDigits = guessingDigits
            .slice(0, 4)

          return (
          <div key={card.id} className={`rs-card ${theme.cardClass} mb-4 p-3 ${theme.bodyClass}`}>
            <div className={`rs-card-header ${theme.headerClass} pt-2`}>
              <h6 className="mb-0 text-white poppins-regular">{card.title} &nbsp;&nbsp; ({card.type})</h6>
              <button className="btn rs-panel-btn">Panel</button>
            </div>
            <div className="rs-card-body">
              <p className="rs-guessing-label Poppins-SemiBold">
                Today's Guessing
                {fourDigits.length === 0 && <span className={theme.guessBoxClass}>-</span>}
                {fourDigits.map((n, j) => (
                  <span key={j} className={theme.guessBoxClass}>{n}</span>
                ))}
              </p>
              <h3 className="rs-result-number poppins-bold">{`${card.openPana} ${card.openAakda}${card.closeAakda} ${card.closePana}`}</h3>
              <p className="rs-time-range poppins-regular">09:30 pm - 11:30 pm</p>
            </div>
          </div>
          )
        })}
      </div>
    </>
  )
}

export default ResultsPage
