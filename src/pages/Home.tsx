
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import HomeHeader from "@/components/Home/HomeHeader";
import HeroSection from "@/components/Home/HeroSection";
import FeaturesSection from "@/components/Home/FeaturesSection";
import CTASection from "@/components/Home/CTASection";
import HomeFooter from "@/components/Home/HomeFooter";

const Home = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-donor-gray">
      <div className="bg-primary relative">
        <HomeHeader />
        <HeroSection />
      </div>

      <FeaturesSection />
      <CTASection />
      <HomeFooter />
    </div>
  );
};

export default Home;
