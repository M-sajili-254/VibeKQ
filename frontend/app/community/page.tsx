'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, Calendar, Users, TrendingUp, Camera, MapPin, Loader2 } from 'lucide-react';
import { communityService, getImageUrl } from '@/utils/api';

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [vibeMemories, setVibeMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [registeringEventId, setRegisteringEventId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsData, eventsData, memoriesData] = await Promise.all([
          communityService.getPosts(),
          communityService.getEvents(),
          communityService.getVibeMemories(),
        ]);
        setPosts(postsData.results || postsData || []);
        setEvents(eventsData.results || eventsData || []);
        setVibeMemories(memoriesData.results || memoriesData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLike = async (postId: number) => {
    try {
      await communityService.likePost(postId);
      // Refresh posts
      const postsData = await communityService.getPosts();
      setPosts(postsData.results || postsData || []);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleEventRegister = async (eventId: string | number) => {
    // Check if user is logged in
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Please log in to register for events');
      window.location.href = '/login';
      return;
    }

    setRegisteringEventId(String(eventId));
    try {
      await communityService.registerForEvent(eventId);
      // Refresh events to get updated registration status
      const eventsData = await communityService.getEvents();
      setEvents(eventsData.results || eventsData || []);
      alert('Successfully registered for the event!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to register for event';
      alert(errorMessage);
    } finally {
      setRegisteringEventId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Community Vibes</h1>
          <p className="text-xl mb-8">
            Connect with KQ staff, share stories, and engage with passion projects
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('posts')}
              className={`py-4 px-2 border-b-2 font-semibold transition ${
                activeTab === 'posts'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Posts</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`py-4 px-2 border-b-2 font-semibold transition ${
                activeTab === 'events'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Events</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('memories')}
              className={`py-4 px-2 border-b-2 font-semibold transition ${
                activeTab === 'memories'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Camera className="w-5 h-5" />
                <span>Vibe Memories</span>
              </div>
            </button>
            <Link
              href="/community/merchandise"
              className="py-4 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 font-semibold transition"
            >
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Merchandise</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow animate-pulse">
                    <div className="h-48 bg-gray-300"></div>
                    <div className="p-6">
                      <div className="h-6 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
                      <div className="h-4 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {posts.map((post: any) => (
                  <div key={post.id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
                    {post.image && (
                      <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-400 overflow-hidden">
                        <img
                          src={getImageUrl(post.image) || ''}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                          {post.post_type}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.content}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleLike(post.id)}
                            className="flex items-center space-x-1 hover:text-red-500 transition"
                          >
                            <Heart className={`w-4 h-4 ${post.is_liked ? 'fill-red-500 text-red-500' : ''}`} />
                            <span>{post.likes_count}</span>
                          </button>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{post.comments_count}</span>
                          </div>
                        </div>
                        <span className="text-xs">{post.author_name}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="grid md:grid-cols-2 gap-6">
            {events.map((event: any) => (
              <div key={event.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-primary">
                      {new Date(event.start_date).getDate()}
                    </span>
                    <span className="text-xs text-gray-600">
                      {new Date(event.start_date).toLocaleString('default', { month: 'short' })}
                    </span>
                  </div>
                  <div className="flex-1">
                    <span className="px-3 py-1 bg-purple-100 text-purple-600 text-xs font-semibold rounded-full">
                      {event.event_type}
                    </span>
                    <h3 className="text-xl font-semibold mt-2 mb-2">{event.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{event.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <p>{event.location || 'Virtual Event'}</p>
                        <p>{event.participants_count} participants</p>
                      </div>
                      <button 
                        onClick={() => !event.is_registered && handleEventRegister(event.id)}
                        disabled={event.is_registered || registeringEventId === event.id}
                        className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                          event.is_registered 
                            ? 'bg-green-600 text-white cursor-default' 
                            : 'bg-primary text-white hover:bg-primary/90'
                        } ${registeringEventId === event.id ? 'opacity-70 cursor-wait' : ''}`}
                      >
                        {registeringEventId === event.id ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Registering...
                          </>
                        ) : event.is_registered ? (
                          '✓ Registered'
                        ) : (
                          'Register'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Vibe Memories Tab */}
        {activeTab === 'memories' && (
          <div>
            <div className="mb-6 text-center">
              <p className="text-gray-600">
                Explore beautiful moments captured by our KQ community members around the world
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {loading ? (
                <>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="aspect-square bg-gray-300 rounded-lg animate-pulse"></div>
                  ))}
                </>
              ) : vibeMemories.length === 0 ? (
                <div className="col-span-full text-center py-20">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-600 mb-2">No Memories Yet</h3>
                  <p className="text-gray-500">
                    Be the first to share your travel memories with the community!
                  </p>
                </div>
              ) : (
                <>
                  {vibeMemories.map((memory: any) => (
                    <div
                      key={memory.id}
                      className="group relative aspect-square rounded-lg overflow-hidden shadow hover:shadow-xl transition cursor-pointer"
                    >
                      {memory.image ? (
                        <img
                          src={getImageUrl(memory.image) || ''}
                          alt={memory.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                          <Camera className="w-12 h-12 text-white" />
                        </div>
                      )}
                      
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <h4 className="font-semibold mb-1 line-clamp-1">{memory.title}</h4>
                          {memory.location && (
                            <div className="flex items-center text-xs text-white/90">
                              <MapPin className="w-3 h-3 mr-1" />
                              <span>{memory.location}</span>
                            </div>
                          )}
                          {memory.description && (
                            <p className="text-xs text-white/80 mt-2 line-clamp-2">{memory.description}</p>
                          )}
                          <div className="flex items-center mt-2 text-xs">
                            <Heart className="w-3 h-3 mr-1" />
                            <span>{memory.likes_count} likes</span>
                            <span className="mx-2">•</span>
                            <span>by {memory.uploader_name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
