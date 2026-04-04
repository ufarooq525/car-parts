import React from 'react';
import { FiTruck, FiLock, FiUsers, FiStar } from 'react-icons/fi';
import styles from './StaticPage.module.css';

const AboutPage: React.FC = () => {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>About Us</h1>
        <p className={styles.heroSubtitle}>
          Your trusted source for quality automotive parts
        </p>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Who We Are</h2>
          <p className={styles.text}>
            Car Parts Store is a leading online retailer of automotive parts and accessories.
            We are committed to providing our customers with high-quality parts at competitive
            prices, backed by exceptional customer service.
          </p>
          <p className={styles.text}>
            With an extensive catalog covering thousands of vehicles and parts, we make it easy
            for you to find exactly what you need. Whether you're a professional mechanic or a
            DIY enthusiast, we have the parts you need to keep your vehicle running smoothly.
          </p>
        </section>

        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><FiTruck size={28} /></div>
            <h3 className={styles.featureTitle}>Fast Shipping</h3>
            <p className={styles.featureText}>
              Quick and reliable delivery to get your parts to you as soon as possible.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><FiLock size={28} /></div>
            <h3 className={styles.featureTitle}>Quality Guarantee</h3>
            <p className={styles.featureText}>
              All parts are sourced from trusted manufacturers and suppliers.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><FiUsers size={28} /></div>
            <h3 className={styles.featureTitle}>Expert Support</h3>
            <p className={styles.featureText}>
              Our knowledgeable team is here to help you find the right parts.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><FiStar size={28} /></div>
            <h3 className={styles.featureTitle}>Best Prices</h3>
            <p className={styles.featureText}>
              Competitive pricing with regular deals and discounts.
            </p>
          </div>
        </div>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Our Mission</h2>
          <p className={styles.text}>
            Our mission is to simplify the process of finding and purchasing automotive parts.
            We leverage technology to provide an intuitive search experience, allowing you to
            find compatible parts for your specific vehicle quickly and easily.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
