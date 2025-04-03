
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { IconCreditCard, IconUsers, IconReportMoney } from "@tabler/icons-react";
import TestimonialCard from "./TestimonialCard";

const HeroSection = () => {
  return (
    <div className="container mx-auto px-4 py-20 md:py-32 max-w-7xl">
      <div className="relative">
        {/* First testimonial card - floating to the left of hero */}
        <div className="hidden md:block absolute left-0 top-24 max-w-xs">
          <TestimonialCard 
            icon={<IconUsers className="text-primary" size={20} />}
            text="Monthly donations increased 12% with donor automation"
          />
        </div>
        
        {/* Second testimonial card - floating to the right of hero */}
        <div className="hidden md:block absolute right-0 top-24 max-w-xs">
          <TestimonialCard 
            icon={<IconCreditCard className="text-primary" size={20} />}
            text="Renewed 87% of lapsed donors this quarter"
          />
        </div>
        
        {/* Main hero content */}
        <div className="text-center max-w-4xl mx-auto z-20 relative py-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Donor intent is<br />
            hiding in plain sight.<br />
            Donor Camp reveals it<br />
            so you can act on it.
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto">
            Engage the right donors at the right time. Donor Camp captures intent and connects it to the tools your team already uses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90 font-semibold px-8 w-full sm:w-auto">
                Get Started Free
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 font-semibold px-8 w-full sm:w-auto">
              Book a Demo
            </Button>
          </div>
        </div>
        
        {/* Third testimonial card - floating left under the buttons */}
        <div className="hidden md:block absolute left-4 bottom-0 transform translate-y-1/2 max-w-xs z-10">
          <TestimonialCard 
            icon={<IconReportMoney className="text-primary" size={20} />}
            text="See your donor dashboard in minutes"
          />
        </div>
        
        {/* Fourth testimonial card - floating right under the buttons */}
        <div className="hidden md:block absolute right-4 bottom-0 transform translate-y-1/2 max-w-xs z-10">
          <TestimonialCard 
            icon={<IconCreditCard className="text-primary" size={20} />}
            text="Automate donor follow-ups with precision"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
