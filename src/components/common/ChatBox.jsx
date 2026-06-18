import { useEffect, useMemo, useState } from 'react'

function ChatBox() {
  const [isOpen, setIsOpen] = useState(false)
  const [floatingSetting, setFloatingSetting] = useState({
    whatsappName: 'Whatsapp',
    whatsappUrl: '',
    telegramName: 'Telegram',
    telegramUrl: '',
    status: 0,
  })
  const [loading, setLoading] = useState(true)
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

  useEffect(() => {
    let isMounted = true

    const parseFloatingValue = (value) => {
      if (!value) return {}
      if (typeof value === 'object') return value
      try {
        return JSON.parse(value)
      } catch (_error) {
        return { whatsappUrl: value }
      }
    }

    const loadFloatingSetting = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/settings/floating-public`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data?.message || 'Failed to load floating setting')
        }

        if (isMounted) {
          const parsedValue = parseFloatingValue(data?.setting_value)
          setFloatingSetting({
            whatsappName: parsedValue.whatsappName || data?.setting_name || 'Whatsapp',
            whatsappUrl: parsedValue.whatsappUrl || '',
            telegramName: parsedValue.telegramName || 'Telegram',
            telegramUrl: parsedValue.telegramUrl || '',
            status: Number(data?.status) || 0,
          })
        }
      } catch (_error) {
        if (isMounted) {
          setFloatingSetting({
            whatsappName: 'Whatsapp',
            whatsappUrl: 'https://wa.me/',
            telegramName: 'Telegram',
            telegramUrl: 'https://t.me/',
            status: 1,
          })
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadFloatingSetting()

    return () => {
      isMounted = false
    }
  }, [apiBaseUrl])

  const normalizeLink = (value) => {
    const rawValue = String(value || '').trim()
    if (!rawValue) return ''
    if (/^https?:\/\//i.test(rawValue)) return rawValue
    if (/^www\./i.test(rawValue)) return `https://${rawValue}`
    return `https://${rawValue.replace(/^\/+/, '')}`
  }

  const whatsappLink = useMemo(
    () => normalizeLink(floatingSetting.whatsappUrl),
    [floatingSetting.whatsappUrl],
  )
  const telegramLink = useMemo(
    () => normalizeLink(floatingSetting.telegramUrl),
    [floatingSetting.telegramUrl],
  )

  const isEnabled = Number(floatingSetting.status) === 1

  if (loading) {
    return null
  }

  const resolvedWhatsAppLink = whatsappLink || 'https://wa.me/'
  const resolvedTelegramLink = telegramLink || 'https://t.me/'

  if (!isEnabled) {
    return null
  }

  return (
    <>
      {/* <button
        className="btn lettalk-btn Poppins-SemiBold"
        onClick={() => setIsOpen(true)}
      >
        {floatingSetting.whatsappName || 'Lets Talk!'}
      </button> */}

      {isOpen && (
        <div className="chatbox-container" style={{ display: 'flex' }}>
          <div className="chatbox-header">
            <span className="Poppins-SemiBold">Madhur Assist</span>
            <button className="chatbox-minimize-btn" onClick={() => setIsOpen(false)}>
              <i className="fas fa-minus"></i>
            </button>
          </div>
          <div className="chatbox-body">
            <div className="chatbox-buttons">
              <a
                href={resolvedWhatsAppLink}
                target="_blank"
                rel="noreferrer"
                className="chatbox-btn chatbox-whatsapp"
              >
                <i className="fab fa-whatsapp"></i> {floatingSetting.whatsappName || 'Open Link'}
              </a>
              <a
                href={resolvedTelegramLink}
                target="_blank"
                rel="noreferrer"
                className="chatbox-btn chatbox-telegram"
              >
                <i className="fab fa-telegram-plane"></i> {floatingSetting.telegramName || 'Telegram'}
              </a>
            </div>
          </div>
          <div className="chatbox-footer">
            <input type="text" className="chatbox-input" placeholder="Type here..." />
          </div>
        </div>
      )}
    </>
  )
}

export default ChatBox
