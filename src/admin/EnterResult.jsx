import { useNavigate } from "react-router-dom";

const EnterResult = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Result submitted");
  };

  return (
    <>
      {/* Enter Result Form */}
      <div className="row justify-content-center align-items-center">
        <div className="col-8">
          <div className="enter-result-card">
            <div className="enter-result-header">
              <h4>Enter Result</h4>
            </div>
            <div className="enter-result-body">
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label-custom">Visit Date</label>
                    <div className="custom-input-wrapper">
                      <input type="date" className="custom-input" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-custom">Category</label>
                    <select className="custom-input">
                      <option>Open</option>
                      <option>Close</option>
                    </select>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label-custom">Bazar</label>
                    <select className="custom-input">
                      <option>Madhur Morning</option>
                      <option>Madhur Day</option>
                      <option>Madhur Evening</option>
                      <option>Madhur Night</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-custom">Number</label>
                    <input
                      type="number"
                      className="custom-input"
                      placeholder="Enter number"
                    />
                  </div>
                </div>
                <div className="enter-result-actions">
                  <button
                    type="button"
                    className="btn-back"
                    onClick={() => navigate("/dashboard")}
                  >
                    Back
                  </button>
                  <button type="submit" className="btn-submit">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="admin-content">
        <div className="disclaimer-card">
          <h3>DISCLAIMER</h3>
          <p>
            View this website is on your own risk. All the information shown on
            website is sponsored and we warn you that is only for entertainment
            purpose... We respect all country rules/laws... if you not agree
            with our site. Please quit site right now.
          </p>
        </div>
      </div>
    </>
  );
};

export default EnterResult;
