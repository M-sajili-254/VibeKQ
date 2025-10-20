'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, Calendar, Users, TrendingUp } from 'lucide-react';
import { communityService } from '@/utils/api';

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsData, eventsData] = await Promise.all([
          communityService.getPosts(),
          communityService.getEvents(),
        ]);
        setPosts(postsData.results || postsData || []);
        setEvents(eventsData.results || eventsData || []);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Vibe Community</h1>
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
                          src={post.image}
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
                      <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition">
                        {event.is_registered ? 'Registered' : 'Register'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
