import React from 'react';
import styles from './StaticPage.module.css';

const PrivacyPage: React.FC = () => {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Privacy Policy</h1>
        <p className={styles.heroSubtitle}>
          How we collect, use, and protect your information
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.legalContent}>
          <section className={styles.legalSection}>
            <h2>1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you create an
              account, make a purchase, or contact us for support. This includes your name,
              email address, phone number, shipping address, and payment information.
            </p>
          </section>

          <section className={styles.legalSection}>
            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Process and fulfill your orders</li>
              <li>Send you order confirmations and shipping updates</li>
              <li>Respond to your comments, questions, and customer service requests</li>
              <li>Communicate with you about products, services, and promotional offers</li>
              <li>Monitor and analyze trends, usage, and activities</li>
              <li>Detect, investigate, and prevent fraudulent transactions</li>
            </ul>
          </section>

          <section className={styles.legalSection}>
            <h2>3. Information Sharing</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personal information to outside
              parties except as necessary to provide our services (e.g., shipping carriers,
              payment processors). We may also release information when required by law or to
              protect our rights.
            </p>
          </section>

          <section className={styles.legalSection}>
            <h2>4. Data Security</h2>
            <p>
              We implement a variety of security measures to maintain the safety of your
              personal information. Your personal data is stored on secured networks and is
              only accessible by a limited number of persons who have special access rights.
            </p>
          </section>

          <section className={styles.legalSection}>
            <h2>5. Cookies</h2>
            <p>
              We use cookies to improve your browsing experience, analyze site traffic, and
              understand where our visitors are coming from. You can choose to disable cookies
              through your browser settings, though this may affect functionality.
            </p>
          </section>

          <section className={styles.legalSection}>
            <h2>6. Your Rights</h2>
            <p>
              You have the right to access, update, or delete your personal information at any
              time. You can do this through your account settings or by contacting us directly.
            </p>
          </section>

          <section className={styles.legalSection}>
            <h2>7. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any
              changes by posting the new policy on this page and updating the effective date.
            </p>
          </section>

          <p className={styles.lastUpdated}>Last updated: January 2025</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
