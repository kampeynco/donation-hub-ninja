
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { TrueFocus } from "@/components/ui/true-focus";

const HeroSection = () => {
  const isMobile = useIsMobile();

  return (
    <div className="bg-white text-gray-900">
      <div className="container mx-auto px-4 flex items-center justify-center min-h-[90vh] md:h-[100vh] max-w-7xl py-16 md:py-0">
        <div className="relative w-full">
          {/* Main hero content */}
          <div className="text-center max-w-4xl mx-auto z-20 relative py-4 md:py-8">
            <h1 className="text-3xl md:text-[4rem] font-bold mb-4 md:mb-6 leading-[1.2] md:leading-[1.125] text-gray-900">
              Your{" "}
              <TrueFocus 
                sentence="donors intent"
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
                <>be unclear.<br /></>
              ) : (
                <>be unclear.<br /></>
              )}
              Donor Camp<br />
              uncovers it.
            </h1>
            <p className="text-base md:text-[1.25rem] font-[300] mb-6 md:mb-8 max-w-2xl mx-auto px-2 md:px-4 leading-[1.5] text-gray-700">
              Connect your fundraising stack, and we'll analyze your data for<br />
              actionable insights to know when donors are ready to donate.
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
    </div>
  );
};

export default HeroSection;
