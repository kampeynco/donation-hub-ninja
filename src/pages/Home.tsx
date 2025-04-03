
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { IconArrowRight, IconCreditCard, IconUsers, IconReportMoney } from "@tabler/icons-react";

// Logo mark image from assets bucket
const DARK_LOGO_MARK = "https://igjnhwvtasegwyiwcdkr.supabase.co/storage/v1/object/public/assets//updated_dc_logomark_dark.png";

const Home = () => {
  const {
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
      </div>;
  }

  return <div className="min-h-screen bg-donor-gray">
      <header className="bg-white">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <img src={DARK_LOGO_MARK} alt="Donor Camp Logo" className="w-6 h-6" />
            </div>
            <span className="text-xl font-semibold tracking-tight">Donor Camp</span>
          </Link>
          <div className="flex gap-4">
            <Link to="/auth/signin">
              <Button variant="ghost" className="text-primary hover:bg-gray-100">
                Log in
              </Button>
            </Link>
            <Link to="/auth/signup">
              <Button className="bg-primary text-white hover:bg-primary/90">
                Get started
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-20 md:py-32 max-w-7xl">
          <div className="relative">
            {/* First testimonial card - floating to the left of hero */}
            <div className="hidden md:block absolute left-0 top-24 max-w-xs">
              <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <IconUsers className="text-primary" size={20} />
                  </div>
                  <p className="text-sm font-medium">Monthly donations increased 12% with donor automation</p>
                </div>
              </div>
            </div>
            
            {/* Second testimonial card - floating to the right of hero */}
            <div className="hidden md:block absolute right-0 top-24 max-w-xs">
              <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <IconCreditCard className="text-primary" size={20} />
                  </div>
                  <p className="text-sm font-medium">Renewed 87% of lapsed donors this quarter</p>
                </div>
              </div>
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
              <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <IconReportMoney className="text-primary" size={20} />
                  </div>
                  <p className="text-sm font-medium">See your donor dashboard in minutes</p>
                </div>
              </div>
            </div>
            
            {/* Fourth testimonial card - floating right under the buttons */}
            <div className="hidden md:block absolute right-4 bottom-0 transform translate-y-1/2 max-w-xs z-10">
              <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <IconCreditCard className="text-primary" size={20} />
                  </div>
                  <p className="text-sm font-medium">Automate donor follow-ups with precision</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Everything you need to manage your fundraising
          </h2>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-6">
                <IconUsers className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Donor Management</h3>
              <p className="text-gray-600">
                Keep track of all your donors in one place. Store contact information, donation history, and more.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-6">
                <IconCreditCard className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Donation Tracking</h3>
              <p className="text-gray-600">
                Track all donations in real-time. See who donated, when they donated, and how much.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-6">
                <IconReportMoney className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Fundraising Analytics</h3>
              <p className="text-gray-600">
                Get insights into your fundraising efforts with detailed reports and analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

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

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Link to="/" className="flex items-center gap-2 mb-6 md:mb-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                <img src={DARK_LOGO_MARK} alt="Donor Camp Logo" className="w-6 h-6" />
              </div>
              <span className="text-xl font-semibold tracking-tight">Donor Camp</span>
            </Link>
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Donor Camp. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>;
};

export default Home;
