import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/navbar.css"
import Logo from "../assets/LogoSucofindo.png"

function Navbar() {
  const navigate = useNavigate();

  const Logout = async () => {
    try {
      await axios.delete("http://localhost:5000/logout");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-primary">
      {/* <!-- Container wrapper --> */}
      <div className="container">
        {/* <!-- Toggle button --> */}
        <button
          className="navbar-toggler"
          type="button"
          data-mdb-toggle="collapse"
          data-mdb-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="fas fa-bars"></i>
        </button>

        {/* <!-- Collapsible wrapper --> */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {/* <!-- Navbar brand --> */}
          <a className="navbar-brand mt-2 mt-lg-0" href="/data">
            <img
              src={Logo}
              height="55"
              alt="MDB Logo"
              loading="lazy"
            />
          </a>
        </div>
        {/* <!-- Collapsible wrapper --> */}

        {/* <!-- Right elements --> */}
        <div className="d-flex align-items-center">
          {/* <!-- Icon --> */}
          <a className="link-secondary me-3" href="#s">
            <i className="fas fa-shopping-cart"></i>
          </a>
          {/* <!-- Avatar --> */}
          <Dropdown>
            <Dropdown.Toggle variant="primary" id="dropdown-avatar">
              <img
                src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp"
                className="rounded-circle"
                height="30"
                alt="Black and White Portrait of a Man"
                loading="lazy"
              />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={Logout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        {/* <!-- Right elements --> */}
      </div>
      {/* <!-- Container wrapper --> */}
    </nav>
  );
}

export default Navbar;
