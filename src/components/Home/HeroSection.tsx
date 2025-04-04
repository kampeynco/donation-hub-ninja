
import { Button } from "@/components/ui/button";
import { ParticlesBackground } from "@/components/ui/particles-background";
import { TrueFocus } from "@/components/ui/true-focus";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[600px] flex items-center overflow-hidden">
      {/* Journey Map Background */}
      <div className="absolute inset-0 z-0">
        <ParticlesBackground 
          variant="journey"
          quantity={100}
          size={1.2}
          staticity={20}
          ease={30}
          connectionDistance={150}
          connectionOpacity={0.4}
          connectionWidth={0.8}
        />
      </div>
      
      <div className="container relative z-10 mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
            <span className="block">Manage your donors</span>
            <span className="block">and <TrueFocus sentence="track donations" treatAsOneUnit={true} borderColor="#007AFF" glowColor="rgba(0, 122, 255, 0.6)" /> with ease</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
            Transform your fundraising efforts with powerful donor management, 
            actionable insights, and seamless donation tracking. DonorCamp helps 
            you build stronger relationships with your donors and maximize your impact.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button 
              size="lg" 
              className="bg-donor-blue hover:bg-donor-blue/90"
              onClick={() => navigate("/signup")}
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/signin")}
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
