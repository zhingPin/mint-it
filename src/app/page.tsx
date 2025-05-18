import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>Woke</h1>
        <p className={styles.subtitle}>
          Empowering creatives to sell their work directly to the world
        </p>
        <a href="#get-started" className={styles.cta}>
          Get Started
        </a>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Built for Creators</h2>
        <p className={styles.sectionDescription}>
          Whether you're a music producer, visual artist, or film director, Woke lets you showcase and sell your work on your terms.
        </p>

        <div className={styles.featuresGrid}>
          <Feature
            title="🎨 For Artists"
            description="Upload and sell digital art, illustrations, designs, and more. Keep full control of your work and earnings."
          />
          <Feature
            title="🎧 For Producers"
            description="Monetize beats, tracks, and audio samples with a simple interface and direct-to-fan sales model."
          />
          <Feature
            title="🎬 For Directors"
            description="Distribute trailers, short films, and scripts to audiences or collaborators without the middlemen."
          />
        </div>

        <p className={styles.quote}>
          “Woke is the future for independent creatives.”
        </p>
      </section>

      <footer className={styles.footer}>
        &copy; 2025 Woke Inc. All rights reserved.
      </footer>
    </main>
  );
}

interface FeatureProps {
  title: string;
  description: string;
}

function Feature({ title, description }: FeatureProps) {
  return (
    <div className={styles.featureCard}>
      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureDescription}>{description}</p>
    </div>
  );
}
