import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Navigation } from '../components/Navigation';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
const API = BACKEND_URL;

export default function CommunityDetail() {
  const { id } = useParams();
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Check if user is logged in - but NEVER redirect
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
    fetchCommunity();
  }, [id]);

  const fetchCommunity = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/communities/${id}`);
      setCommunity(response.data);
    } catch (err) {
      console.error('Error fetching community:', err);
      setError('Community not found');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!user) {
      window.location.href = `/login?from=/communities/${id}`;
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API}/communities/${id}/join`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Refresh community data to show updated member count
      fetchCommunity();
    } catch (err) {
      console.error('Error joining community:', err);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation />
      <div className="pt-32 text-center text-white">Loading...</div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation />
      <div className="pt-32 text-center text-white">{error}</div>
    </div>
  );
  
  if (!community) return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation />
      <div className="pt-32 text-center text-white">Community not found</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation />
      
      <div className="pt-32 pb-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <Link to="/communities" className="inline-flex items-center text-zinc-400 hover:text-white mb-6">
            <ArrowLeft size={16} className="mr-2" />
            Back to Communities
          </Link>

          <div className="bg-zinc-900/50 rounded-3xl p-8 border border-white/10">
            {community.image_url && (
              <img 
                src={community.image_url} 
                alt={community.name}
                className="w-full h-64 object-cover rounded-2xl mb-6"
              />
            )}

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {community.name}
            </h1>
            
            <p className="text-zinc-400 mb-6">
              {community.description}
            </p>

            <div className="flex items-center gap-4 mb-6">
              <div>
                <span className="text-zinc-500 text-sm">Members</span>
                <p className="text-white text-xl font-semibold">{community.member_count || 0}</p>
              </div>
              <div className="ml-6">
                <span className="text-zinc-500 text-sm">Created by</span>
                <p className="text-white">{community.creator_name || 'Biddge Team'}</p>
              </div>
            </div>

            {user ? (
              <Button 
                onClick={handleJoin}
                className="bg-primary text-white rounded-xl px-8 py-6 hover:bg-primary/90"
              >
                Join Community
              </Button>
            ) : (
              <Link to={`/login?from=/communities/${id}`}>
                <Button className="bg-primary text-white rounded-xl px-8 py-6 hover:bg-primary/90">
                  Login to Join
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
