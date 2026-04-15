import { Link, useParams } from 'react-router-dom'

const years = Array.from({ length: 21 }, (_, i) => 2026 - i)

function DetailsPage() {
  const { gameSlug } = useParams()
  const gameName = gameSlug ? gameSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Game'

  return (
    <>
     <SeoHead
    title="Madhur Bazar Home"
    description="Latest Madhur Bazar updates and charts."
    canonical="https://www.madhurbazar123.com/"
  />
      <div className="container mt-4">
        <div className="d-flex align-items-center gap-3">
          <Link to="/games" className="back-btn">
            <i className="fas fa-arrow-left"></i>
          </Link>
          <h4 className="text-white mb-0 poppins-bold">{gameName}</h4>
        </div>
      </div>

      <div className="container mt-4 px-2 px-md-3">
        <div className="details-info-box p-3 p-md-4">
          <h5 className="text-white poppins-bold mb-3">Welcome to the {gameName} Panel Chart</h5>
          <p className="text-white-70 font-size-14 mb-2">
            Your go-to destination for the latest panel combinations and result archives of the {gameName} session from Madhur Bazar. On this page, you'll find a comprehensive list of panel results, recorded date-wise, so you can easily trace patterns and previous outcomes.
          </p>
          <p className="text-white-70 font-size-14 mb-2">
            <strong className="text-white">How to use this chart:</strong> Each entry shows the panel code, the corresponding result, and the date for which the data applies. Navigate through the table to view historical panel results and review how certain combinations have appeared over time.
          </p>
          <p className="text-white-70 font-size-14 mb-2">
            <strong className="text-white">Why track the panel chart?</strong> By monitoring past panel outcomes you gain insight into recurring combinations and trends. These can help refine your selection strategy and build a clearer picture of the game dynamics.
          </p>
          <p className="text-white-70 font-size-14 mb-2">
            <strong className="text-white">Live updates:</strong> We refresh the panel chart as soon as official {gameName} results are declared. Ensure you always check the latest date line to view the most recent data. For older entries, archive links remain available for deeper review.
          </p>
          <p className="text-white-70 font-size-14 mb-2">
            <strong className="text-white">Disclaimer:</strong> Panel charts are provided for informational purposes only. While they help with pattern recognition, they do not guarantee results. Use responsibly and follow all local regulations around Satta Matka games.
          </p>
          <p className="text-white-70 font-size-14 mb-0">
            <strong className="text-white">Questions or errors?</strong> If you spot any discrepancies in the panel chart or need clarification, please reach out to us via our contact page. We strive to maintain accuracy and timely updates for all users.
          </p>
        </div>
      </div>

      <div className="container mt-4 px-2 px-md-3">
        <div className="details-filter-box p-3 p-md-4">
          <div className="row g-2 g-md-3 align-items-end">
            <div className="col-6 col-md-6 col-lg-3">
              <select className="input-style w-100 details-select">
                <option value="">Select year</option>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="col-6 col-md-6 col-lg-3">
              <input type="date" className="input-style w-100" />
            </div>
            <div className="col-6 col-md-6 col-lg-3">
              <input type="date" className="input-style w-100" />
            </div>
            <div className="col-6 col-md-6 col-lg-3">
              <button className="show-panel-btn w-100">Show Panel</button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-4 pb-5">
        <div className="year-grid">
          {years.map((y) => <button key={y} className="year-btn">{y}</button>)}
        </div>
      </div>
    </>
  )
}

export default DetailsPage
