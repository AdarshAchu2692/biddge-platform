import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Navigation } from '../components/Navigation';
import { CommunityCard } from '../components/CommunityCard';
import { Button } from '../components/ui/button';
import { ArrowRight, Sparkles, PlusCircle, Smartphone } from 'lucide-react';

const API = 'https://final-sfqz.onrender.com/api';

export default function Home() {
  const [featuredCommunities, setFeaturedCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  useEffect(() => {
    fetchFeaturedCommunities();
  }, []);

  const fetchFeaturedCommunities = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/communities/featured`);
      setFeaturedCommunities(response.data || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching featured communities:', error);
      setError('Failed to load communities');
      
      // Fallback to regular communities
      try {
        const fallbackResponse = await axios.get(`${API}/communities`);
        setFeaturedCommunities((fallbackResponse.data || []).slice(0, 6));
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 px-4 sm:px-6 md:px-12 lg:px-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.15)_0%,_rgba(10,10,10,0)_70%)]" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
              <Sparkles size={16} className="text-blue-400" />
              <span className="text-sm text-zinc-300">Transform Your Life Today</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white">
              A better you
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                every day
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed px-4">
              Be part of the world's most powerful life transformation platform
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <Link to="/membership">
                <Button
                  size="lg"
                  className="bg-primary text-white rounded-full px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] w-full sm:w-auto"
                >
                  Become a Member
                  <ArrowRight className="ml-2" size={16} />
                </Button>
              </Link>
              <Link to="/communities">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white rounded-full px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base hover:bg-white/10 transition-all w-full sm:w-auto"
                >
                  Explore Communities
                </Button>
              </Link>
              
              {user?.is_creator ? (
                <Link to="/create-community">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary/50 text-primary rounded-full px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base hover:bg-primary/10 transition-all w-full sm:w-auto"
                  >
                    <PlusCircle className="mr-2" size={16} />
                    Create Community
                  </Button>
                </Link>
              ) : (
                <Link to="/login" state={{ from: '/create-community' }}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary/50 text-primary rounded-full px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base hover:bg-primary/10 transition-all w-full sm:w-auto"
                  >
                    <PlusCircle className="mr-2" size={16} />
                    Create Community
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Popular Communities Section - FIXED MOBILE VIEW */}
      <section className="py-16 md:py-32 px-4 sm:px-6 md:px-12 lg:px-24 bg-gradient-to-b from-transparent to-zinc-950/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 px-2"
          >
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-semibold tracking-tight mb-2 md:mb-4 text-white">
                Popular Communities
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-zinc-400">
                Join thousands of like-minded individuals
              </p>
            </div>
            
            <Link to="/communities" className="mt-4 md:mt-0">
              <Button
                variant="ghost"
                className="text-primary hover:text-primary/80 hover:bg-primary/10 transition-all text-sm sm:text-base"
              >
                View all communities
                <ArrowRight className="ml-2" size={16} />
              </Button>
            </Link>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 px-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 sm:h-40 md:h-48 lg:h-64 bg-zinc-900/50 rounded-xl sm:rounded-2xl md:rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 px-4">
              <p className="text-zinc-400 text-sm sm:text-base">{error}</p>
              <button 
                onClick={fetchFeaturedCommunities}
                className="mt-4 px-4 sm:px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm sm:text-base"
              >
                Try Again
              </button>
            </div>
          ) : featuredCommunities.length === 0 ? (
            <div className="text-center py-12 px-4">
              <p className="text-zinc-400 text-sm sm:text-base">No communities found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 px-2" data-testid="communities-grid">
              {featuredCommunities.map((community, index) => (
                <CommunityCard 
                  key={community.id || community._id || `featured-${index}`} 
                  community={community} 
                  index={index} 
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Creator Call-to-Action Section - REDUCED SIZE */}
      <section className="py-12 md:py-32 px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary/20 via-purple-600/20 to-pink-600/20 rounded-xl sm:rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10 border border-white/10 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.1)_0%,_transparent_70%)]" />
            
            <div className="relative z-10">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <PlusCircle size={24} className="text-primary" />
              </div>
              
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3">
                Want to start your own community?
              </h2>
              
              <p className="text-sm sm:text-base md:text-lg text-zinc-300 mb-4 sm:mb-6 max-w-xl mx-auto px-2">
                Become a creator and build your tribe. Share your passion, knowledge, and connect with like-minded people.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center px-2">
                {user?.is_creator ? (
                  <Link to="/create-community">
                    <Button
                      className="bg-primary text-white rounded-full px-5 sm:px-6 py-4 sm:py-5 text-xs sm:text-sm hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] w-full sm:w-auto"
                    >
                      Create a Community
                      <ArrowRight className="ml-2" size={14} />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/login" state={{ from: '/create-community' }}>
                      <Button
                        className="bg-primary text-white rounded-full px-5 sm:px-6 py-4 sm:py-5 text-xs sm:text-sm hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] w-full sm:w-auto"
                      >
                        Register as Creator
                        <ArrowRight className="ml-2" size={14} />
                      </Button>
                    </Link>
                    <Link to="/communities">
                      <Button
                        variant="outline"
                        className="border-white/20 text-white rounded-full px-5 sm:px-6 py-4 sm:py-5 text-xs sm:text-sm hover:bg-white/10 transition-all w-full sm:w-auto"
                      >
                        Explore Communities
                      </Button>
                    </Link>
                  </>
                )}
              </div>
              
              {!user?.is_creator && (
                <p className="text-zinc-400 text-xs mt-4">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary hover:text-primary/80">
                    Sign in
                  </Link>
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* App Download Section - REDUCED SIZE */}
      <section className="py-12 md:py-32 px-4 sm:px-6 md:px-12 lg:px-24 bg-gradient-to-b from-transparent to-zinc-950/50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            {/* App Poster Image - SMALLER ON MOBILE */}
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-2xl mx-auto mb-4 sm:mb-6 md:mb-8 rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden">
              <div className="aspect-[16/9] bg-gradient-to-r from-primary/30 to-purple-600/30 border border-white/10 rounded-xl sm:rounded-2xl md:rounded-3xl flex items-center justify-center">
                <img 
                  src={require('./assets/app-poster.jpg')} 
                  alt="App Poster" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop";
                  }}
                />
              </div>
            </div>
            
            {/* Download Text - SMALLER ON MOBILE */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-8">
              <Smartphone className="text-primary w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                Download the app now
              </h2>
            </div>
            
            {/* App Store Buttons - SMALLER ON MOBILE */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center px-2">
              <a 
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full sm:w-auto"
              >
                <Button
                  size="lg"
                  className="bg-white text-black rounded-xl px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 text-xs sm:text-sm md:text-base hover:bg-white/90 transition-all flex items-center gap-2 sm:gap-3 w-full justify-center"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <span className="flex flex-col items-start">
                    <span className="text-[10px] sm:text-xs">Download on the</span>
                    <span className="text-xs sm:text-sm md:text-base font-semibold">App Store</span>
                  </span>
                </Button>
              </a>
              
              <a 
                href="https://play.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full sm:w-auto"
              >
                <Button
                  size="lg"
                  className="bg-white text-black rounded-xl px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 text-xs sm:text-sm md:text-base hover:bg-white/90 transition-all flex items-center gap-2 sm:gap-3 w-full justify-center"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.61 2.71C3.24 2.87 3 3.24 3 3.65v16.7c0 .41.24.78.61.94l.07.03L13 12 3.61 2.71zm13.78 6.69l-3.73-2.16L7.7 15.34l10.69-5.94c.44-.24.69-.68.69-1.16 0-.48-.25-.92-.69-1.16zm.28 5.2l-3.73-2.16-2.64 2.87 2.64 2.87 3.73-2.16c.44-.24.69-.68.69-1.16 0-.48-.25-.92-.69-1.16z"/>
                  </svg>
                  <span className="flex flex-col items-start">
                    <span className="text-[10px] sm:text-xs">Get it on</span>
                    <span className="text-xs sm:text-sm md:text-base font-semibold">Google Play</span>
                  </span>
                </Button>
              </a>
            </div>
            
            {/* Small text */}
            <p className="text-zinc-500 text-[10px] sm:text-xs mt-4 sm:mt-6">
              Available on iOS and Android devices
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
