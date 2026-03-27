import { useState } from 'react'
import { Link } from 'react-router-dom'
import logoImg from '../assets/images/Logo.png'

function SignInPage() {
  const [activeTab, setActiveTab] = useState('signup')
  const [showSignInPassword, setShowSignInPassword] = useState(false)
  const [showSignUpPassword, setShowSignUpPassword] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [mobile, setMobile] = useState('')

  return (
    <div className="subpage-bg-gradient">
      <div className="text-center pt-5 pb-4">
        <Link to="/">
          <img src={logoImg} alt="Madhur Logo" className="signin-logo" />
        </Link>
      </div>

      <div className="d-flex justify-content-center mb-4">
        <div className="tab-container">
          <button
            className={`tab-btn ${activeTab === 'signin' ? 'active' : ''}`}
            onClick={() => setActiveTab('signin')}
          >
            Sign In
          </button>
          <button
            className={`tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </button>
        </div>
      </div>

      <div className="d-flex justify-content-center pb-5">
        <div className="form-card">
          {activeTab === 'signin' && (
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-3">
                <input type="email" className="form-control signin-input" placeholder="Email" />
              </div>
              <div className="mb-3 position-relative">
                <input
                  type={showSignInPassword ? 'text' : 'password'}
                  className="form-control signin-input"
                  placeholder="Password"
                />
                <i
                  className={`fas ${showSignInPassword ? 'fa-eye' : 'fa-eye-slash'} toggle-password`}
                  onClick={() => setShowSignInPassword(!showSignInPassword)}
                ></i>
              </div>
              <button type="submit" className="btn signin-btn w-100 mt-2">Sign In</button>
            </form>
          )}

          {activeTab === 'signup' && (
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-3">
                <input type="email" className="form-control signin-input" placeholder="Email" />
              </div>
              <div className="mb-3 position-relative">
                <input
                  type={showSignUpPassword ? 'text' : 'password'}
                  className="form-control signin-input"
                  placeholder="Password"
                />
                <i
                  className={`fas ${showSignUpPassword ? 'fa-eye' : 'fa-eye-slash'} toggle-password`}
                  onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                ></i>
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control signin-input"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value.replace(/[^A-Za-z\s]/g, ''))}
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control signin-input"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value.replace(/[^A-Za-z\s]/g, ''))}
                />
              </div>
              <div className="mb-3">
                <input
                  type="tel"
                  className="form-control signin-input"
                  placeholder="Mobile Number"
                  maxLength="10"
                  inputMode="numeric"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
                />
              </div>
              <div className="form-check mb-3">
                <input className="form-check-input" type="checkbox" id="ageCheck" defaultChecked />
                <label className="form-check-label text-white" htmlFor="ageCheck">
                  I am eligible to play as I am 18 and above
                </label>
              </div>
              <button type="submit" className="btn signin-btn w-100">Create Account</button>
            </form>
          )}

          <p className="footer-text text-center mt-3">
            justo eros, maximus a <a href="#" className="terms-link">Terms & Conditions</a> faucibus sapien. Vestibulum quis sodales elit. Sed ornare eleifend vehicula. In hac <a href="#" className="privacy-link">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignInPage
