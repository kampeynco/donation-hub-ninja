
import { IconUsers, IconCreditCard, IconReportMoney } from "@tabler/icons-react";
import FeatureCard from "./FeatureCard";

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          Everything you need to manage your fundraising
        </h2>
        
        <div className="grid md:grid-cols-3 gap-10">
          <FeatureCard
            icon={<IconUsers className="text-primary" size={24} />}
            title="Donor Management"
            description="Keep track of all your donors in one place. Store contact information, donation history, and more."
          />
          
          <FeatureCard
            icon={<IconCreditCard className="text-primary" size={24} />}
            title="Donation Tracking"
            description="Track all donations in real-time. See who donated, when they donated, and how much."
          />
          
          <FeatureCard
            icon={<IconReportMoney className="text-primary" size={24} />}
            title="Fundraising Analytics"
            description="Get insights into your fundraising efforts with detailed reports and analytics."
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
