
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { IconCreditCard, IconUsers, IconReportMoney } from "@tabler/icons-react";
import TestimonialCard from "./TestimonialCard";
import { useIsMobile } from "@/hooks/use-mobile";

const HeroSection = () => {
  const isMobile = useIsMobile();

  return (
    <div className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 flex items-center justify-center h-[100vh] max-w-7xl">
        <div className="relative w-full">
          {/* Testimonial cards for desktop */}
          {!isMobile && (
            <>
              {/* First testimonial card - floating to the left of hero */}
              <div className="hidden md:block absolute left-0 top-8 z-10 transform hover:-translate-y-1 transition-transform">
                <TestimonialCard 
                  icon={<IconUsers className="text-primary" size={16} />}
                  text="Monthly donations increased 12% with donor automation"
                />
              </div>
              
              {/* Second testimonial card - floating to the right of hero, positioned higher than left card */}
              <div className="hidden md:block absolute right-0 top-0 z-10 transform hover:-translate-y-1 transition-transform">
                <TestimonialCard 
                  icon={<IconCreditCard className="text-primary" size={16} />}
                  text="Renewed 87% of lapsed donors this quarter"
                />
              </div>
            </>
          )}
          
          {/* Main hero content */}
          <div className="text-center max-w-4xl mx-auto z-20 relative py-4 md:py-8">
            <h1 className="text-[4rem] font-bold mb-4 md:mb-6 leading-[1.125]">
              Your donors intent<br />
              can be unclear.<br />
              We are here to<br />
              change that.
            </h1>
            <p className="text-[1.25rem] font-[300] mb-6 md:mb-8 max-w-2xl mx-auto px-4 leading-[1.5]">
              Engage the right donors at the right time. Donor Camp captures intent and connects it to the tools your team already uses.
            </p>
            
            {/* Testimonial cards for mobile - placed between text and buttons */}
            {isMobile && (
              <div className="grid grid-cols-1 gap-4 mb-6 px-2">
                <TestimonialCard 
                  icon={<IconUsers className="text-primary" size={16} />}
                  text="Monthly donations increased 12% with donor automation"
                />
                <TestimonialCard 
                  icon={<IconCreditCard className="text-primary" size={16} />}
                  text="Renewed 87% of lapsed donors this quarter"
                />
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <Link to="/auth/signup" className="w-full sm:w-auto">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-6 md:px-8 w-full">
                  Get Started Free
                </Button>
              </Link>
              <Link to="#" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-semibold px-6 md:px-8 w-full">
                  Book a Demo
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Bottom testimonial cards for desktop */}
          {!isMobile && (
            <>
              {/* Third testimonial card - floating left under the buttons */}
              <div className="hidden md:block absolute left-4 bottom-4 transform z-10 hover:-translate-y-1 transition-transform">
                <TestimonialCard 
                  icon={<IconReportMoney className="text-primary" size={16} />}
                  text="See your donor dashboard in minutes"
                />
              </div>
              
              {/* Fourth testimonial card - floating right under the buttons */}
              <div className="hidden md:block absolute right-4 bottom-4 transform z-10 hover:-translate-y-1 transition-transform">
                <TestimonialCard 
                  icon={<IconCreditCard className="text-primary" size={16} />}
                  text="Automate donor follow-ups with precision"
                />
              </div>
            </>
          )}
          
          {/* Bottom testimonial cards for mobile - placed after buttons */}
          {isMobile && (
            <div className="grid grid-cols-1 gap-4 mt-8 px-2">
              <TestimonialCard 
                icon={<IconReportMoney className="text-primary" size={16} />}
                text="See your donor dashboard in minutes"
              />
              <TestimonialCard 
                icon={<IconCreditCard className="text-primary" size={16} />}
                text="Automate donor follow-ups with precision"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
