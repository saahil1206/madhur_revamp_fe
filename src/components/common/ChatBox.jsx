import { useState } from 'react'

function ChatBox() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="d-flex justify-content-end mt-4">
        <button
          className="btn lettalk-btn ms-4 Poppins-SemiBold"
          onClick={() => setIsOpen(true)}
        >
          Lets Talk!
        </button>
      </div>

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
              <a href="https://wa.me/" target="_blank" rel="noreferrer" className="chatbox-btn chatbox-whatsapp">
                <i className="fab fa-whatsapp"></i> WhatsApp
              </a>
              <a href="https://t.me/" target="_blank" rel="noreferrer" className="chatbox-btn chatbox-telegram">
                <i className="fab fa-telegram-plane"></i> Telegram
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
