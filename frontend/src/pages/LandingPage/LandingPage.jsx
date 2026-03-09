import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import FeaturesSection from "./FeaturesSection";
import DealsSection from "./DealsSection";
import ReviewsSection from "./ReviewsSection";
import CTASection from "./CTASection";

export default function LandingPage() {
    

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <div className="pointer-events-none fixed inset-0 -z-10">
                <div className="absolute left-0 top-0 h-[420px] w-[420px] rounded-full bg-violet-500/20 blur-3xl" />
                <div className="absolute right-0 top-10 h-[480px] w-[480px] rounded-full bg-sky-500/20 blur-3xl" />
            </div>
            <main className="mx-auto w-full max-w-6xl px-4">
                <HeroSection />
                <AboutSection />
                <FeaturesSection />
                <DealsSection />
                <ReviewsSection />
                <CTASection />
            </main>
        </div>
    );
}