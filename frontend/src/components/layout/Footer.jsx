import {
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaEnvelope,
} from "react-icons/fa";
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>About Lost & Found</h4>
          <p>
            Helping our community reconnect with their lost items since 2024.
            Making a difference, one item at a time.
          </p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <span className="footer-plain-text">About Us</span>
            </li>
            <li>
              <span className="footer-plain-text">Privacy Policy</span>
            </li>
            <li>
              <span className="footer-plain-text">Terms of Service</span>
            </li>
            <li>
              <span className="footer-plain-text">Contact Us</span>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Connect With Us</h4>
          <div className="social-links">
            <span className="social-icon" aria-hidden="true">
              <FaGithub />
            </span>
            <span className="social-icon" aria-hidden="true">
              <FaTwitter />
            </span>
            <span className="social-icon" aria-hidden="true">
              <FaLinkedin />
            </span>
            <span className="social-icon" aria-hidden="true">
              <FaEnvelope />
            </span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          Developed by{" "}
          <a
            href="https://www.ericcapiz.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Eric Capiz
          </a>{" "}
          © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}

export default Footer;
