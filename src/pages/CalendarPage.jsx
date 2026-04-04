import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { jsPDF } from 'jspdf'

function formatDateKey(dateObj) {
  const y = dateObj.getFullYear()
  const m = `${dateObj.getMonth() + 1}`.padStart(2, '0')
  const d = `${dateObj.getDate()}`.padStart(2, '0')
  return `${y}-${m}-${d}`
}

function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function formatRangeLabel(startDate, endDate) {
  const startDay = `${startDate.getDate()}`.padStart(2, '0')
  const endDay = `${endDate.getDate()}`.padStart(2, '0')
  const monthShort = startDate.toLocaleString('en-US', { month: 'short' })
  const yearShort = `${startDate.getFullYear()}`.slice(-2)
  return `${startDay}-${endDay} ${monthShort}, ${yearShort}`
}

function toSlug(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function getStartOfWeekMonday(dateObj) {
  const date = new Date(dateObj)
  const day = date.getDay()
  const diff = day === 0 ? -6 : 1 - day
  date.setDate(date.getDate() + diff)
  date.setHours(0, 0, 0, 0)
  return date
}

function getEndOfWeekSunday(dateObj) {
  const date = new Date(getStartOfWeekMonday(dateObj))
  date.setDate(date.getDate() + 6)
  return date
}

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

function emptyCell() {
  return { left: ['-', '-', '-'], jodi: '--', right: ['-', '-', '-'] }
}

function normalizeCell(entry) {
  if (!entry) return emptyCell()

  const openPanaValue = entry.openPana === null || entry.openPana === undefined || entry.openPana === '' ? '---' : entry.openPana
  const closePanaValue = entry.closePana === null || entry.closePana === undefined || entry.closePana === '' ? '---' : entry.closePana

  const left = String(openPanaValue)
    .replace(/\s+/g, '')
    .slice(0, 3)
    .padEnd(3, '-')
    .split('')
  const right = String(closePanaValue)
    .replace(/\s+/g, '')
    .slice(0, 3)
    .padEnd(3, '-')
    .split('')

  const openAakdaRaw = entry.openAakda === null || entry.openAakda === undefined || entry.openAakda === '' ? '-' : entry.openAakda
  const closeAakdaRaw = entry.closeAakda === null || entry.closeAakda === undefined || entry.closeAakda === '' ? '-' : entry.closeAakda
  const openAakda = String(openAakdaRaw).replace(/\D/g, '').slice(0, 1) || '-'
  const closeAakda = String(closeAakdaRaw).replace(/\D/g, '').slice(0, 1) || '-'

  return {
    left,
    jodi: `${openAakda}${closeAakda}`,
    right,
  }
}

function CalendarPage() {
  const { gameSlug } = useParams()
  const gameName = gameSlug ? gameSlug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Calendar'

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

  const now = new Date()
  const defaultFrom = new Date(now.getFullYear(), now.getMonth(), 1)
  const defaultTo = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const [year, setYear] = useState(String(now.getFullYear()))
  const [fromDate, setFromDate] = useState(formatDateKey(defaultFrom))
  const [toDate, setToDate] = useState(formatDateKey(defaultTo))
  const [bazars, setBazars] = useState([])
  const [selectedBazarId, setSelectedBazarId] = useState(null)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const years = [2026, 2025, 2024, 2023, 2022, 2021, 2020]

  useEffect(() => {
    const nextFrom = `${year}-01-01`
    const nextTo = `${year}-12-31`
    setFromDate(nextFrom)
    setToDate(nextTo)
  }, [year])

  useEffect(() => {
    const fetchBazars = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/results`)
        if (!response.ok) throw new Error('Unable to fetch bazar list')
        const data = await response.json()
        const map = new Map()
        data.forEach((row) => {
          if (row?.bazar?.id && row?.bazar?.bazar_name) {
            map.set(row.bazar.id, { id: row.bazar.id, name: row.bazar.bazar_name })
          }
        })
        const bazarList = Array.from(map.values())
        setBazars(bazarList)

        if (gameSlug && bazarList.length > 0) {
          const wantedSlug = toSlug(gameSlug)
          const matched = bazarList.find((b) => toSlug(b.name) === wantedSlug)
          if (matched) {
            setSelectedBazarId(matched.id)
          } else {
            const partial = bazarList.find((b) => toSlug(b.name).includes(wantedSlug) || wantedSlug.includes(toSlug(b.name)))
            setSelectedBazarId(partial ? partial.id : bazarList[0].id)
          }
        } else if (bazarList.length > 0) {
          setSelectedBazarId(bazarList[0].id)
        }
      } catch (err) {
        setError(err.message || 'Unable to fetch bazar list')
      }
    }

    fetchBazars()
  }, [apiBaseUrl, gameSlug])

  const fetchPanelData = async () => {
    if (!selectedBazarId || !fromDate || !toDate) return

    setLoading(true)
    setError('')
    try {
      const url = `${apiBaseUrl}/api/results?bazarId=${selectedBazarId}&fromDate=${fromDate}&toDate=${toDate}`
      const response = await fetch(url)
      if (!response.ok) throw new Error('Unable to fetch panel results')
      const data = await response.json()
      setResults(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Unable to fetch panel results')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPanelData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBazarId])

  const weeklyRows = useMemo(() => {
    if (!fromDate || !toDate) return []

    const byDate = new Map()
    results.forEach((row) => {
      const key = row.result_date
      const current = byDate.get(key) || {
        openPana: '--',
        openAakda: '-',
        closeAakda: '-',
        closePana: '--',
      }
      if (row.result_type === 'open') {
        current.openPana = row.result_pana ?? '--'
        current.openAakda = row.result_AAkda ?? '-'
      }
      if (row.result_type === 'close') {
        current.closeAakda = row.result_AAkda ?? '-'
        current.closePana = row.result_pana ?? '--'
      }
      byDate.set(key, current)
    })

    const start = getStartOfWeekMonday(parseDateKey(fromDate))
    const end = getEndOfWeekSunday(parseDateKey(toDate))
    const rows = []
    let cursor = new Date(start)

    while (cursor <= end) {
      const weekStart = new Date(cursor)
      const weekEnd = new Date(cursor)
      weekEnd.setDate(weekEnd.getDate() + 6)

      const days = []
      for (let i = 0; i < 7; i += 1) {
        const day = new Date(weekStart)
        day.setDate(day.getDate() + i)
        const key = formatDateKey(day)
        if (key < fromDate || key > toDate) {
          days.push(emptyCell())
        } else {
          days.push(normalizeCell(byDate.get(key)))
        }
      }

      const row = {
        date: formatRangeLabel(weekStart, weekEnd),
        days,
      }

      const hasAnyData = days.some((d) => d.jodi !== '--' || d.left.join('') !== '---' || d.right.join('') !== '---')
      if (hasAnyData) {
        rows.push(row)
      }

      cursor.setDate(cursor.getDate() + 7)
    }

    return rows.reverse()
  }, [results, fromDate, toDate])

  const handleDownloadPdf = () => {
    if (weeklyRows.length === 0) return

    const bazarName = bazars.find((b) => b.id === selectedBazarId)?.name || gameName
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 32
    const lineHeight = 16
    let y = margin

    const addLine = (text, fontSize = 10, bold = false) => {
      if (y > pageHeight - margin) {
        doc.addPage()
        y = margin
      }
      doc.setFont('helvetica', bold ? 'bold' : 'normal')
      doc.setFontSize(fontSize)
      doc.text(text, margin, y, { maxWidth: pageWidth - margin * 2 })
      y += lineHeight
    }

    addLine(`Madhur Bazar Panel Chart`, 14, true)
    addLine(`Game: ${gameName}`, 11, true)
    addLine(`Bazar: ${bazarName}`, 11, true)
    addLine(`From: ${fromDate}   To: ${toDate}`, 10, false)
    y += 8

    weeklyRows.forEach((row) => {
      addLine(`Week: ${row.date}`, 10, true)
      const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      row.days.forEach((d, idx) => {
        const value = `${d.left.join('')} ${d.jodi} ${d.right.join('')}`
        addLine(`${labels[idx]}: ${value}`, 10, false)
      })
      y += 6
    })

    const safeName = `${bazarName}`.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    doc.save(`${safeName || 'madhur-bazar'}-panel-chart.pdf`)
  }

  return (
    <div className="container mt-4 pb-5">
      <div className="calendar-filter-bar">
        <div className="cal-sidebar">
          <div className="form-field">
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="">Select year</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>
          <div className="form-field">
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>
          <button className="btn-show-panel" onClick={fetchPanelData}>Show Panel</button>
          <button className="btn-download-pdf" onClick={handleDownloadPdf} disabled={weeklyRows.length === 0 || loading}>
            Download PDF <i className="fas fa-file-download"></i>
          </button>
        </div>
      </div>

      <div className="calendar-section">
        <div className="calendar-left">
          {selectedBazarId && (
            <p className="text-white poppins-regular mb-2">
              {gameName} - {bazars.find((b) => b.id === selectedBazarId)?.name || ''}
            </p>
          )}
          {loading && <p className="text-white poppins-regular">Loading panel data...</p>}
          {!loading && error && <p className="text-danger poppins-regular">{error}</p>}
          {!loading && !error && (
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
                {weeklyRows.map((row, i) => (
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
          )}
        </div>
      </div>
    </div>
  )
}

export default CalendarPage
