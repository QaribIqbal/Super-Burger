import Link from "next/link";
import styles from "./Footer.module.css";
import { NAV_LINKS } from "@/lib/config";

export default function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.footer__inner}>
        <div className={styles.footer__brand}>
          <Link href="/" className={styles.footer__logo} aria-label="Super Burger Co. Home">
            <span className={styles.footer__logoScript}>Super</span>
            <span className={styles.footer__logoBold}>Burger Co.</span>
          </Link>
          <p className={styles.footer__tagline}>
            Fresh smashed burgers made daily. Quality ingredients, no shortcuts.
          </p>
          <div className={styles.footer__social} role="list" aria-label="Social links">
            <a href="https://instagram.com" className={styles.footer__socialLink} aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href="https://twitter.com" className={styles.footer__socialLink} aria-label="Twitter" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
              </svg>
            </a>
            <a href="https://tiktok.com" className={styles.footer__socialLink} aria-label="TikTok" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M16 2a5 5 0 0 1 3.82 8.5A5 5 0 0 1 13.5 20a5.5 5.5 0 0 1-5.12-3.28 3 3 0 0 0-1.67.44A5 5 0 0 0 7 17.5a5 5 0 0 0 7.82-1" />
                <path d="M12 17.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
              </svg>
            </a>
          </div>
        </div>

        <nav className={styles.footer__nav} aria-label="Footer navigation">
          <h3 className={styles.footer__sectionTitle}>Explore</h3>
          <ul className={styles.footer__links}>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={styles.footer__link}>
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href={ORDER_URL} className={styles.footer__link}>
                Order Online
              </Link>
            </li>
          </ul>
        </nav>

        <div className={styles.footer__contact}>
          <h3 className={styles.footer__sectionTitle}>Visit Us</h3>
          <address className={styles.footer__contactList}>
            <div className={styles.footer__contactItem}>
              <svg className={styles.footer__contactIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>123 Burger Lane, Flavor Town, FT 12345</span>
            </div>
            <div className={styles.footer__contactItem}>
              <svg className={styles.footer__contactIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <span>Mon–Thu: 11am–10pm<br />Fri–Sat: 11am–11pm<br />Sun: 12pm–9pm</span>
            </div>
            <div className={styles.footer__contactItem}>
              <svg className={styles.footer__contactIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <a href="tel:+1234567890" className={styles.footer__link}>+1 (234) 567-890</a>
            </div>
          </address>
        </div>

        <div className={styles.footer__newsletter}>
          <h3 className={styles.footer__sectionTitle}>Stay Updated</h3>
          <p className={styles.footer__tagline}>Get the latest deals and new menu drops.</p>
          <form className={styles.newsletterForm} action="#">
            <label htmlFor="email" className={styles.visuallyHidden}>Email address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className={styles.newsletterInput}
              required
            />
            <button type="submit" className={styles.newsletterBtn} aria-label="Subscribe">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </form>
        </div>

        <div className={styles.footer__bottom}>
          <p className={styles.footer__copyright}>© {new Date().getFullYear()} Super Burger Co. All rights reserved.</p>
          <div className={styles.footer__legal}>
            <Link href="/privacy" className={styles.footer__legalLink}>Privacy</Link>
            <Link href="/terms" className={styles.footer__legalLink}>Terms</Link>
            <Link href="/accessibility" className={styles.footer__legalLink}>Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

const ORDER_URL = "https://order.example.com";