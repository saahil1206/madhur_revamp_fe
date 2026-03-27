import { useParams } from 'react-router-dom'

const calendarRows = Array.from({ length: 12 }, () => ({
  date: '28-20 Mar, 25',
  days: Array.from({ length: 7 }, () => ({
    left: [2, 8, 0],
    jodi: '48',
    right: [2, 8, 0],
  })),
}))

function ResultCell({ left, jodi, right }) {
  return (
    <div className="rc">
      <span className="s">
        {left.map((d, i) => <span key={i}>{d}</span>)}
      </span>
      <span className="j">{jodi}</span>
      <span className="s">
        {right.map((d, i) => <span key={i}>{d}</span>)}
      </span>
    </div>
  )
}

function CalendarPage() {
  const { gameSlug } = useParams()
  const gameName = gameSlug ? gameSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Calendar'

  return (
    <div className="container mt-4 pb-5">
      <div className="calendar-filter-bar">
        <div className="cal-sidebar">
          <div className="form-field">
            <select>
              <option value="">Select year</option>
              {[2026, 2025, 2024, 2023, 2022, 2021, 2020].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <input type="date" />
          </div>
          <div className="form-field">
            <input type="date" />
          </div>
          <button className="btn-show-panel">Show Panel</button>
          <button className="btn-download-pdf">
            Download PDF <i className="fas fa-file-download"></i>
          </button>
        </div>
      </div>
      <div className="calendar-section">
        <div className="calendar-left">
          <table className="cal-table">
            <thead>
              <tr>
                <th>Date's</th>
                <th>Mon</th>
                <th>Tue</th>
                <th>Wed</th>
                <th>Thus</th>
                <th>Fri</th>
                <th>Sat</th>
                <th>Sun</th>
              </tr>
            </thead>
            <tbody>
              {calendarRows.map((row, i) => (
                <tr key={i}>
                  <td>{row.date}</td>
                  {row.days.map((day, j) => (
                    <td key={j}>
                      <ResultCell {...day} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default CalendarPage
