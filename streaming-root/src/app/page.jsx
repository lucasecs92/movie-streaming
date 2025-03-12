import styles from "../styles/page.module.scss";
import Header from "../components/Header";
import Main from "../components/Main";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <section className={styles.containerPage}>
      <Header />
      <Main />
      <Footer />
    </section>
  );
}
