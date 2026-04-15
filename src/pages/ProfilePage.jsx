import { useState } from 'react'
import { Link } from 'react-router-dom'
import logoImg from '../assets/images/Logo.png'

function ProfilePage() {
  const [formData, setFormData] = useState({
    email: 'Andrews.steven29@mail.com',
    lastName: 'Andrews',
    password: 'password1',
    firstName: 'Steve',
    mobile: '9999999999',
    username: 'roxky_562',
  })
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleChange = (field, value) => {
    if (field === 'mobile') value = value.replace(/[^0-9]/g, '')
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="subpage-bg-gradient">
      <div className="text-center pt-5 pb-4">
        <Link to="/">
          <img src={logoImg} alt="Madhur Logo" className="profile-logo" />
        </Link>
      </div>

      <div className="container pb-5 px-2 px-md-3">
        <div className="profile-card">
          <div className="row g-2 g-md-3 mb-3">
            <div className="col-12 col-md-6">
              <input type="email" className="form-control profile-input" placeholder="Email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} />
            </div>
            <div className="col-12 col-md-6">
              <input type="text" className="form-control profile-input" placeholder="Last Name" value={formData.lastName} onChange={(e) => handleChange('lastName', e.target.value)} />
            </div>
          </div>
          <div className="row g-2 g-md-3 mb-3">
            <div className="col-12 col-md-6">
              <input type="password" className="form-control profile-input" placeholder="Password" value={formData.password} onChange={(e) => handleChange('password', e.target.value)} />
            </div>
            <div className="col-12 col-md-6">
              <input type="text" className="form-control profile-input" placeholder="First Name" value={formData.firstName} onChange={(e) => handleChange('firstName', e.target.value)} />
            </div>
          </div>
          <div className="row g-2 g-md-3 mb-4">
            <div className="col-12 col-md-6">
              <input type="tel" className="form-control profile-input" placeholder="Mobile Number" value={formData.mobile} maxLength="10" inputMode="numeric" onChange={(e) => handleChange('mobile', e.target.value)} />
            </div>
            <div className="col-12 col-md-6">
              <div className="position-relative">
                <input type="text" className="form-control profile-input" placeholder="Username" value={formData.username} onChange={(e) => handleChange('username', e.target.value)} />
                <span className="username-available">Available</span>
              </div>
            </div>
          </div>

          <p className="profile-desc">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In justo eros, maximus a velit ac, pulvinar faucibus sapien. Vestibulum quis sodales elit. Sed ornare eleifend vehicula. In hac habitasse platea dictumst. Suspendisse nec egestas ex, sed imperdiet leo. Ut viverra nunc nec quam luctus, non pharetra nibh lacinia. Interdum et malesuada fames ac ante ipsum primis in faucibus.
          </p>

          <div className="mb-4">
            <button className="btn profile-upgrade-btn">Upgrade My Plan</button>
          </div>

          <div className="d-flex flex-md-row flex-column align-items-md-center justify-content-between mt-5 pt-3 gap-3">
            <div className="d-flex flex-sm-row flex-column gap-3">
              <button className="btn profile-save-btn">Save</button>
              <button className="btn profile-cancel-btn">Cancel</button>
            </div>
            <button className="btn profile-delete-btn" onClick={() => setShowDeleteModal(true)}>Delete Account</button>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content delete-modal-content">
              <div className="modal-body delete-modal-body text-center">
                <p className="delete-modal-text">Are you sure you want to delete your Madhur account?</p>
                <div className="d-flex justify-content-center gap-3 mt-4">
                  <button type="button" className="btn delete-modal-delete-btn">Delete</button>
                  <button type="button" className="btn delete-modal-cancel-btn" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePage
