import { useState } from 'react'

const resultCards = [
  { title: 'Madhur Night', type: 'Jodi', variant: 'purple', guessBoxClass: 'rs-guess-box', bodyClass: 'rs-body-purple', headerClass: 'rs-header-purple', cardClass: 'rs-card-purple' },
  { title: 'Madhur Night', type: 'Jodi', variant: 'teal', guessBoxClass: 'rs-guess-box-blue', bodyClass: 'rs-body-teal', headerClass: 'rs-header-teal', cardClass: 'rs-card-teal' },
  { title: 'Madhur Night', type: 'Jodi', variant: 'yellow', guessBoxClass: 'rs-guess-box-yellow', bodyClass: 'rs-body-yellow', headerClass: 'rs-header-yellow', cardClass: 'rs-card-yellow' },
]

function ResultsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('All')

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
            <button className="btn result-refresh-btn">Refresh</button>
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
        {resultCards.map((card, i) => (
          <div key={i} className={`rs-card ${card.cardClass} mb-4 p-3 ${card.bodyClass}`}>
            <div className={`rs-card-header ${card.headerClass} pt-2`}>
              <h6 className="mb-0 text-white poppins-regular">{card.title} &nbsp;&nbsp; ({card.type})</h6>
              <button className="btn rs-panel-btn">Panel</button>
            </div>
            <div className="rs-card-body">
              <p className="rs-guessing-label Poppins-SemiBold">
                Today's Guessing
                {[1, 7, 2, 4].map((n, j) => (
                  <span key={j} className={card.guessBoxClass}>{n}</span>
                ))}
              </p>
              <h3 className="rs-result-number poppins-bold">736 29 4--</h3>
              <p className="rs-time-range poppins-regular">09:30 pm - 11:30 pm</p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default ResultsPage
