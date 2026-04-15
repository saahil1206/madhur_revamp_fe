import { useState } from 'react'
import { Link } from 'react-router-dom'

const bazaarGames = [
  { name: 'Madhur', games: [
    { label: 'Madhur Morning', icon: 'fas fa-cloud-sun', slug: 'madhur-morning' },
    { label: 'Madhur Day', icon: 'fas fa-sun', slug: 'madhur-day' },
    { label: 'Madhur Evening', icon: 'fas fa-cloud-moon', slug: 'madhur-evening' },
    { label: 'Madhur Night', icon: 'fas fa-moon', slug: 'madhur-night' },
    { label: 'Madhur Shubhank', icon: 'fas fa-water', slug: 'madhur-shubhank' },
  ]},
  { name: 'Kamdhenu', games: [
    { label: 'Kamdhenu Day', icon: 'fas fa-sun', slug: 'kamdhenu-day' },
    { label: 'Kamdhenu Night', icon: 'fas fa-moon', slug: 'kamdhenu-night' },
  ]},
  { name: 'Dhanalakshmi', games: [
    { label: 'Dhanlaxmi Morning', icon: 'fas fa-cloud-sun', slug: 'dhanlaxmi-morning' },
    { label: 'Dhanlaxmi Day', icon: 'fas fa-sun', slug: 'dhanlaxmi-day' },
    { label: 'Dhanlaxmi Night', icon: 'fas fa-moon', slug: 'dhanlaxmi-night' },
  ]},
  { name: 'Milan', games: [
    { label: 'Milan Day', icon: 'fas fa-sun', slug: 'milan-day' },
    { label: 'Milan Night', icon: 'fas fa-moon', slug: 'milan-night' },
  ]},
  { name: 'Rajdhani', games: [
    { label: 'Rajdhani Day', icon: 'fas fa-sun', slug: 'rajdhani-day' },
    { label: 'Rajdhani Night', icon: 'fas fa-moon', slug: 'rajdhani-night' },
  ]},
  { name: 'Kalyan', games: [
    { label: 'Kalyan', icon: 'fas fa-sun', slug: 'kalyan' },
  ]},
  { name: 'Main', games: [
    { label: 'Main', icon: 'fas fa-sun', slug: 'main' },
  ]},
  { name: 'Time', games: [
    { label: 'Time', icon: 'fas fa-clock', slug: 'time' },
  ]},
]

function GamesPage() {
  const [activeTab, setActiveTab] = useState('bazaar')

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
