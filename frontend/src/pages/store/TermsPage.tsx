import React from 'react';
import styles from './StaticPage.module.css';

const TermsPage: React.FC = () => {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Terms of Service</h1>
        <p className={styles.heroSubtitle}>
          Please read these terms carefully before using our services
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.legalContent}>
          <section className={styles.legalSection}>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using Car Parts Store, you agree to be bound by these Terms of
              Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className={styles.legalSection}>
            <h2>2. Products and Pricing</h2>
            <p>
              All product descriptions, images, and prices are subject to change without notice.
              We make every effort to display accurate pricing and product information, but
              errors may occur. We reserve the right to correct any errors and to cancel orders
              arising from such errors.
            </p>
          </section>

          <section className={styles.legalSection}>
            <h2>3. Orders and Payment</h2>
            <p>
              By placing an order, you are making an offer to purchase the products. We reserve
              the right to accept or decline your order. Payment must be received in full before
              orders are processed and shipped.
            </p>
          </section>

          <section className={styles.legalSection}>
            <h2>4. Shipping and Delivery</h2>
            <p>
              We aim to process and ship orders within 1-3 business days. Delivery times vary
              based on location and shipping method selected. We are not responsible for delays
              caused by shipping carriers or customs processing.
            </p>
          </section>

          <section className={styles.legalSection}>
            <h2>5. Returns and Refunds</h2>
            <p>
              We accept returns within 30 days of delivery for unused, undamaged items in their
              original packaging. Refunds will be processed to the original payment method within
              5-10 business days of receiving the returned item. Return shipping costs are the
              responsibility of the customer unless the return is due to our error.
            </p>
          </section>

          <section className={styles.legalSection}>
            <h2>6. Warranty</h2>
            <p>
              Products sold through our store carry the manufacturer's warranty. We do not
              provide additional warranties beyond what the manufacturer offers. Please refer
              to the product documentation for specific warranty information.
            </p>
          </section>

          <section className={styles.legalSection}>
            <h2>7. Limitation of Liability</h2>
            <p>
              Car Parts Store shall not be liable for any indirect, incidental, special, or
              consequential damages arising from the use of our products or services. Our total
              liability shall not exceed the amount paid for the product in question.
            </p>
          </section>

          <section className={styles.legalSection}>
            <h2>8. Account Responsibilities</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials
              and for all activities that occur under your account. You agree to notify us
              immediately of any unauthorized use of your account.
            </p>
          </section>

          <section className={styles.legalSection}>
            <h2>9. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be effective
              immediately upon posting. Your continued use of our services constitutes acceptance
              of the modified terms.
            </p>
          </section>

          <p className={styles.lastUpdated}>Last updated: January 2025</p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
