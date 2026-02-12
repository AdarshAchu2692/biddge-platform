import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { CommunityCard } from '../components/CommunityCard';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Search, PlusCircle } from 'lucide-react';

const API = 'https://final-sfqz.onrender.com/api';

export default function Communities() {
  const [communities, setCommunities] = useState([]);
  const [filteredCommunities, setFilteredCommunities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
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
    fetchCommunities();
  }, []);

  useEffect(() => {
    if (searchQuery && communities.length > 0) {
      const filtered = communities.filter(
        (community) =>
          community.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          community.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          community.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCommunities(filtered);
    } else {
      setFilteredCommunities(communities);
    }
  }, [searchQuery, communities]);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching communities from:', `${API}/communities`);
      
      const response = await axios.get(`${API}/communities`);
      console.log('✅ Communities received:', response.data);
      
      const communitiesData = response.data || [];
      setCommunities(communitiesData);
      setFilteredCommunities(communitiesData);
      setError(null);
      
    } catch (error) {
      console.error('❌ Error fetching communities:', error);
      setError('Failed to load communities. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <Navigation />
        <div className="pt-32 pb-24 px-6 md:px-12 lg:px-24">
          <div className="max-w-7xl mx-auto">
            <div className="h-8 w-64 bg-zinc-800/50 rounded-lg animate-pulse mb-4"></div>
            <div className="h-4 w-96 bg-zinc-800/50 rounded-lg animate-pulse mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-zinc-900/50 rounded-3xl animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <Navigation />
        <div className="pt-32 pb-24 px-6 md:px-12 lg:px-24">
          <div className="max-w-7xl mx-auto text-center">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">❌</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
            <p className="text-zinc-400 mb-8">{error}</p>
            <button
              onClick={fetchCommunities}
              className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation />
      
      <div className="pt-32 pb-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-white">
                All Communities
              </h1>
              <p className="text-lg text-zinc-400">
                {communities.length > 0 
                  ? `Discover ${communities.length} communities on Biddge`
                  : 'Join a community or create your own'
                }
              </p>
            </div>
            
            {/* Create Community Button */}
            <div className="mt-4 md:mt-0">
              {user?.is_creator ? (
                <Link to="/create-community">
                  <Button className="bg-primary text-white rounded-xl px-6 py-6 hover:bg-primary/90 transition-all flex items-center gap-2">
                    <PlusCircle size={20} />
                    <span>Create Community</span>
                  </Button>
                </Link>
              ) : (
                <Link to="/login" state={{ from: '/create-community' }}>
                  <Button className="bg-zinc-800 text-white rounded-xl px-6 py-6 hover:bg-zinc-700 transition-all flex items-center gap-2 border border-white/10">
                    <PlusCircle size={20} />
                    <span>Login to Create</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Search Bar - Only show if there are communities */}
          {communities.length > 0 && (
            <div className="relative max-w-xl mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
              <Input
                type="text"
                placeholder="Search communities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-zinc-900/50 border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-xl h-14 text-white placeholder:text-zinc-500"
              />
            </div>
          )}

          {/* Communities Grid or Empty State */}
          {communities.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-32 h-32 bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-8">
                <span className="text-6xl">🏝️</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                No Communities Yet
              </h2>
              <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
                Be the first to create a community and start building your tribe!
              </p>
              {user?.is_creator ? (
                <Link to="/create-community">
                  <Button className="bg-primary text-white rounded-xl px-8 py-4 text-lg hover:bg-primary/90 transition-all">
                    <PlusCircle className="mr-2" size={20} />
                    Create Your Community
                  </Button>
                </Link>
              ) : (
                <Link to="/login" state={{ from: '/create-community' }}>
                  <Button className="bg-primary text-white rounded-xl px-8 py-4 text-lg hover:bg-primary/90 transition-all">
                    Login to Create
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="mb-4 text-zinc-400">
                Showing {filteredCommunities.length} of {communities.length} community{communities.length !== 1 ? 'ies' : 'y'}
              </div>
              
              {/* Communities Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCommunities.map((community, index) => (
                  <CommunityCard 
                    key={community.id || community._id || `community-${index}`} 
                    community={community} 
                    index={index} 
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
