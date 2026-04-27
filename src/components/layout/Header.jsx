import { Link, useLocation } from "react-router-dom";
import logoImg from "../../assets/images/Logo.avif";
import mobileLogoImg from "../../assets/images/madhur-mobile-logo.avif";
import userImg from "../../assets/images/User_img.avif";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Results", path: "/results" },
  { label: "About", path: "/about" },
  { label: "Games", path: "/games" },
];

function Header() {
  const location = useLocation();

  const closeOffcanvas = () => {
    const el = document.getElementById("offcanvasRight");
    if (el) {
      el.classList.remove("show");
      el.style.visibility = "";
      el.removeAttribute("aria-modal");
      el.removeAttribute("role");
    }
    const backdrop = document.querySelector(".offcanvas-backdrop");
    if (backdrop) backdrop.remove();
    document.body.classList.remove("overflow-hidden");
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  };

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <header className="pt-2">
      <div className="container header-rounded mt-4">
        <div className="row d-flex justify-content-between align-items-center py-2">
          <div className="col-xl-2 col-lg-2 col-md-4 col-sm-6 col-6">
            <Link to="/" className="text-decoration-none">
              <img
                src={logoImg}
                alt="Madhur Logo"
                className="pt-1 pb-1"
                width="100%"
              />
            </Link>
          </div>
          <div className="col-xl-7 col-lg-7 col-md-6 col-sm-6 col-6 d-flex justify-content-center">
            <nav className="navbar navbar-expand-lg desktop-view">
              <div className="container-fluid main-navigation px-0">
                <div
                  className="collapse navbar-collapse pe-0"
                  id="navbarSupportedContent"
                >
                  <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    {navItems.map((item) => (
                      <li className="nav-item" key={item.path}>
                        <Link
                          className={`nav-link ${isActive(item.path) ? "active-nav" : ""}`}
                          to={item.path}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </nav>
            <div className="mobile-view align-items-center gap-4 pe-5">
              <i
                className="fas fa-bars pe-2 text-white"
                role="button"
                style={{ cursor: "pointer" }}
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasRight"
                aria-controls="offcanvasRight"
              ></i>
            </div>
          </div>
          {/* <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col-5 contact-none d-flex">
            <div className="d-flex justify-content-between maindiv-profile w-100">
              <div className="profile-div py-1">
                <h5 className="mb-0">Hi,</h5>
                <p className="mb-0">Ramesh</p>
              </div>
              <div className="circle-bg">
                <img src={userImg} alt="user-img" width="65%" />
              </div>
            </div>
          </div> */}
        </div>
      </div>

      {/* Mobile Offcanvas */}
      <div
        className="offcanvas offcanvas-end offcanvas-none normal-view-none"
        tabIndex="-1"
        id="offcanvasRight"
        aria-labelledby="offcanvasRightLabel"
        data-bs-backdrop="true"
      >
        <div className="offcanvas-header p-1 mobile_view_header">
          <Link to="/" className="text-decoration-none">
            <img src={mobileLogoImg} alt="" className="mobile_logo w-75" />
          </Link>
          <button
            type="button"
            className="btn-close btn-close-dark ps-5"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body py-0 mt-2">
          {navItems.map((item) => (
            <p
              key={item.path}
              className={isActive(item.path) ? "active-nav" : "border-bottom"}
            >
              <Link
                to={item.path}
                className={`text-decoration-none ankar-hover ${isActive(item.path) ? "" : "text-dark"}`}
                onClick={closeOffcanvas}
              >
                {item.label}
              </Link>
            </p>
          ))}
        </div>
      </div>
    </header>
  );
}

export default Header;
