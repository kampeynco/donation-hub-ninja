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
  return <div className="min-h-screen bg-white">
      <header className="bg-primary text-white">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
              <img src={DARK_LOGO_MARK} alt="Donor Camp Logo" className="w-5 h-5" />
            </div>
            <span className="text-xl font-semibold tracking-tight">Donor Camp</span>
          </Link>
          <div className="flex gap-4">
            <Link to="/auth/signin">
              <Button variant="outline" className="bg-white text-primary hover:bg-gray-100">
                Sign In
              </Button>
            </Link>
            <Link to="/auth/signup">
              <Button className="bg-white text-primary hover:bg-gray-100">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-20 md:py-32 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl">Donor intent is hiding in plain sight. </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-2xl">
            Engage the right donors at the right time. Donor Camp captures intent and connects it to the tools your team already uses.
          </p>
          <Link to="/auth/signup">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100 font-semibold px-8">
              Get Started Free <IconArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </header>

      <section className="py-20">
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
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
                <img src={DARK_LOGO_MARK} alt="Donor Camp Logo" className="w-4 h-4" />
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