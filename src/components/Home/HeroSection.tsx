
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { TrueFocus } from "@/components/ui/true-focus";
import { ParticlesBackground } from "@/components/ui/particles-background";

const HeroSection = () => {
  const isMobile = useIsMobile();

  return (
    <div className="bg-white text-gray-900 relative overflow-hidden">
      {/* Particles Background - using journey variant */}
      <ParticlesBackground 
        className="absolute inset-0 z-0" 
        quantity={isMobile ? 60 : 150}
        staticity={40}
        ease={60}
        size={0.6}
        variant="journey"
      />
      
      <div className="container mx-auto px-4 flex items-center justify-center min-h-[90vh] md:h-[100vh] max-w-7xl py-16 md:py-0">
        <div className="relative w-full">
          {/* Main hero content */}
          <div className="text-center max-w-4xl mx-auto z-20 relative py-4 md:py-8">
            <h1 className="text-3xl md:text-[4rem] font-bold mb-4 md:mb-6 leading-[1.2] md:leading-[1.125] text-gray-900">
              Your{" "}
              <TrueFocus 
                sentence="donors' intent"
                manualMode={true}
                blurAmount={3}
                borderColor="#007AFF"
                glowColor="rgba(0, 122, 255, 0.6)"
                animationDuration={0.5}
                pauseBetweenAnimations={2}
                fontSize="inherit"
                fontWeight="inherit"
                className="inline-block"
                treatAsOneUnit={true}
              /><br />
              {isMobile ? (
                <>can be hidden.<br /></>
              ) : (
                <>can be hidden.<br /></>
              )}
              Donor Camp<br />
              uncovers it.
            </h1>
            <p className="text-base md:text-[1.25rem] font-[300] mb-6 md:mb-8 max-w-2xl mx-auto px-2 md:px-4 leading-[1.5] text-gray-700">
              {isMobile ? (
                <>Connect your fundraising stack, and we'll analyze your data for actionable insights to know when donors are ready to donate.</>
              ) : (
                <>Connect your fundraising stack, and we'll analyze your data for<br />
                actionable insights to know when donors are ready to donate.</>
              )}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-2 md:px-4">
              <Link to="/auth/signup" className="w-full sm:w-auto">
                <Button size="lg" className="bg-primary text-white hover:bg-primary/90 font-semibold px-6 md:px-8 w-full">
                  Get Started Free
                </Button>
              </Link>
              <Link to="#" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 font-semibold px-6 md:px-8 w-full">
                  Book a Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Wavy border at the bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-10">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[70px] md:h-[100px]">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0S65.41,91.94,321.39,56.44Z" 
                fill="#f8fafc"></path>
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;
