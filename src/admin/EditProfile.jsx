import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./edit-profile.css";

const EditProfile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("admin_user") || "{}");
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    mobile: user?.mobile || "",
    city: user?.city || "",
  });
  const [photo, setPhoto] = useState(user?.photo || user?.img || null);
  const [photoPreview, setPhotoPreview] = useState(user?.photo || user?.img || null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [errors, setErrors] = useState({});
  const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;
  const MAX_BASE64_LENGTH = 3_000_000;

  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const nameRegex = /^[a-zA-Z\s]+$/;
  const cityRegex = /^[a-zA-Z0-9\s]+$/;

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        navigate("/adminlogin");
        return;
      }

      try {
        const response = await fetch(`${apiBaseUrl}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("response,response",response)
        const data = await response.json();
        if (!response.ok) return;

        setFormData({
          fullName: data?.fullname || user?.fullName || "",
          mobile: data?.phone || user?.mobile || "",
          city: data?.city || user?.city || "",
        });
        if (data?.photo) {
          setPhoto(data.photo);
          setPhotoPreview(data.photo);
        }
      } catch (_err) {
        // Keep localStorage fallback values
      }
    };

    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error on typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setErrors({ ...errors, photo: "Only JPG, PNG, WEBP, GIF allowed." });
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrors({ ...errors, photo: "Photo must be less than 2MB." });
      return;
    }

    const compressAndSetPhoto = async () => {
      try {
        const readAsDataUrl = () =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });

        const originalDataUrl = await readAsDataUrl();

        // For GIF, keep original to avoid frame loss; apply payload guard below.
        if (file.type === "image/gif") {
          if (originalDataUrl.length > MAX_BASE64_LENGTH) {
            setErrors({ ...errors, photo: "GIF is too large. Please upload a smaller image." });
            return;
          }
          setPhoto(originalDataUrl);
          setPhotoPreview(originalDataUrl);
          setErrors({ ...errors, photo: "" });
          return;
        }

        const img = new Image();
        img.src = originalDataUrl;
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        const maxWidth = 900;
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setErrors({ ...errors, photo: "Failed to process photo." });
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Reduce quality only when payload goes above safe 2MB upload target.
        let quality = 0.82;
        let compressed = canvas.toDataURL("image/jpeg", quality);
        while (compressed.length > MAX_BASE64_LENGTH && quality > 0.4) {
          quality -= 0.08;
          compressed = canvas.toDataURL("image/jpeg", quality);
        }

        if (compressed.length > MAX_BASE64_LENGTH) {
          setErrors({ ...errors, photo: "Photo is too large after compression. Please use a smaller image." });
          return;
        }

        setPhoto(compressed);
        setPhotoPreview(compressed);
        setErrors({ ...errors, photo: "" });
      } catch (_err) {
        setErrors({ ...errors, photo: "Failed to read photo file." });
      }
    };

    compressAndSetPhoto();
  };

  const validate = () => {
    const newErrors = {};

    // Full Name
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    } else if (formData.fullName.trim().length < 1 || formData.fullName.trim().length > 50) {
      newErrors.fullName = "Name must be 1 to 50 characters.";
    } else if (!nameRegex.test(formData.fullName.trim())) {
      newErrors.fullName = "Name can only contain letters and spaces.";
    }

    // Mobile
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required.";
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile.trim())) {
      newErrors.mobile = "Enter a valid 10-digit mobile number.";
    }

    // City
    if (!formData.city.trim()) {
      newErrors.city = "City is required.";
    } else if (formData.city.trim().length < 1 || formData.city.trim().length > 50) {
      newErrors.city = "City must be 1 to 50 characters.";
    } else if (!cityRegex.test(formData.city.trim())) {
      newErrors.city = "City can only contain letters, numbers, and spaces.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (!validate()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("admin_token");

      const response = await fetch(`${apiBaseUrl}/api/auth/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          mobile: formData.mobile.trim(),
          city: formData.city.trim(),
          photo: photo || null,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Failed to update profile");
      }

      // Update localStorage
      const updatedUser = { ...user, ...data.user };
      localStorage.setItem("admin_user", JSON.stringify(updatedUser));

      setMessage({ text: "Profile updated successfully!", type: "success" });
    } catch (err) {
      setMessage({ text: err.message || "Something went wrong.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <h2>Edit Profile</h2>
      </div>

      <form className="edit-profile-form" onSubmit={handleSubmit}>
        {/* Photo Upload */}
        <div className="photo-upload" onClick={() => fileInputRef.current?.click()}>
          <div className="photo-preview">
            {photoPreview ? (
              <img src={photoPreview} alt="Profile" />
            ) : (
              <i className="fas fa-user"></i>
            )}
          </div>
          <div className="photo-edit-icon">
            <i className="fas fa-camera"></i>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handlePhotoChange}
            hidden
          />
          <span className="photo-label">Change Photo</span>
          {errors.photo && <span className="field-error">{errors.photo}</span>}
        </div>

        {/* Full Name */}
        <div className="profile-field">
          <label>Full Name</label>
          <div className={`profile-input-group ${errors.fullName ? "input-error" : ""}`}>
            <i className="fas fa-user"></i>
            <input
              type="text"
              name="fullName"
              placeholder="Enter full name"
              value={formData.fullName}
              onChange={handleChange}
              maxLength={50}
            />
          </div>
          {errors.fullName && <span className="field-error">{errors.fullName}</span>}
        </div>

        {/* Mobile */}
        <div className="profile-field">
          <label>Mobile Number</label>
          <div className={`profile-input-group ${errors.mobile ? "input-error" : ""}`}>
            <i className="fas fa-phone"></i>
            <input
              type="tel"
              name="mobile"
              placeholder="Enter mobile number"
              value={formData.mobile}
              onChange={handleChange}
              maxLength={10}
            />
          </div>
          {errors.mobile && <span className="field-error">{errors.mobile}</span>}
        </div>

        {/* City */}
        <div className="profile-field">
          <label>City</label>
          <div className={`profile-input-group ${errors.city ? "input-error" : ""}`}>
            <i className="fas fa-map-marker-alt"></i>
            <input
              type="text"
              name="city"
              placeholder="Enter city"
              value={formData.city}
              onChange={handleChange}
              maxLength={50}
            />
          </div>
          {errors.city && <span className="field-error">{errors.city}</span>}
        </div>

        {message.text && (
          <p className={`profile-msg ${message.type}`}>{message.text}</p>
        )}

        <button type="submit" className="profile-save-btn" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
