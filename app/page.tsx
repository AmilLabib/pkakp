import Hero from "./components/Hero";
import AboutSection from "./components/AboutSection";
import ArticlesSection from "./components/ArticlesSection";
import AchievementsSection from "./components/AchievementsSection";
import FooterSection from "./components/FooterSection";

export default function Home() {
  return (
    <main className="w-full overflow-x-hidden bg-white">
      <Hero />
      <AboutSection />
      <ArticlesSection />
      <AchievementsSection />
      <FooterSection />
    </main>
  );
}
