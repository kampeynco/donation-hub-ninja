
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to streamline your fundraising?
        </h2>
        <p className="text-xl mb-10 max-w-2xl mx-auto">
          Join thousands of organizations using Donor Camp to manage their donations and donors.
        </p>
        <Link to="/auth/signup">
          <Button size="lg" className="font-semibold px-8">
            Get Started Free
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
