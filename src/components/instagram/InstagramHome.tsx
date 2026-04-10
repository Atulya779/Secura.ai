import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusSquare, Home, Search, Heart, User, LogOut, MessageCircle, Film, Grid3X3 } from "lucide-react";

interface Post {
  id: string;
  imageUrl: string;
  caption: string;
  likes: number;
  timestamp: Date;
  moderation: {
    label: string;
    confidence: number;
    needsReview: boolean;
    reviewReason?: string;
  };
}

interface InstagramHomeProps {
  username: string;
  isVerified: boolean;
  onCreatePost: () => void;
  onLogout: () => void;
  onExitDemo: () => void;
  posts?: Post[];
}

// Sample stories data
const sampleStories = [
  { id: 1, username: "Your Story", hasStory: false, isOwn: true },
  { id: 2, username: "secura.ai", hasStory: true, isOwn: false },
  { id: 3, username: "tech_news", hasStory: true, isOwn: false },
  { id: 4, username: "ai_safety", hasStory: true, isOwn: false },
  { id: 5, username: "deepfake_aware", hasStory: true, isOwn: false },
];

// Sample reels data
const sampleReels = [
  { id: 1, thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=300&fit=crop", views: "12.5K" },
  { id: 2, thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&h=300&fit=crop", views: "8.2K" },
  { id: 3, thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=200&h=300&fit=crop", views: "45.1K" },
];

export default function InstagramHome({ 
  username, 
  isVerified, 
  onCreatePost, 
  onLogout,
  onExitDemo,
  posts = []
}: InstagramHomeProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'reels' | 'profile'>('home');
  const [showChats, setShowChats] = useState(false);

  return (
    <div className="min-h-screen bg-[#fafafa] pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-300 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div>
            <h1 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: "'Billabong', cursive" }}>
              Instagram
            </h1>
            <p className="text-[10px] text-primary -mt-1">Protected by Secura.AI</p>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-2">
            <button 
              onClick={onCreatePost}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Create new post"
            >
              <PlusSquare className="h-6 w-6 text-gray-900" />
            </button>
            <button 
              onClick={() => setShowChats(!showChats)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
              title="Messages"
            >
              <MessageCircle className="h-6 w-6 text-gray-900" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button 
              onClick={onLogout}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Log out"
            >
              <LogOut className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Chats Panel */}
      {showChats && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowChats(false)}>
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-semibold text-lg">Messages</h2>
              <button onClick={() => setShowChats(false)} className="p-1 hover:bg-gray-100 rounded">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-4">
              {/* Chat items */}
              <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5">
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold">SA</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Secura.AI Support</p>
                  <p className="text-xs text-gray-500">Welcome to Secura.AI! • 2h</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-semibold">TN</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">tech_news</p>
                  <p className="text-xs text-gray-500">Check out this article! • 1d</p>
                </div>
              </div>
              <p className="text-center text-sm text-gray-400 mt-8">End of messages</p>
            </div>
          </div>
        </div>
      )}

      {/* Stories Section */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-xl mx-auto px-4">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            {sampleStories.map((story) => (
              <div key={story.id} className="flex flex-col items-center gap-1 flex-shrink-0">
                <div className={`w-16 h-16 rounded-full p-0.5 ${story.hasStory || story.isOwn ? 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600' : 'bg-gray-300'}`}>
                  <div className="w-full h-full bg-white rounded-full p-0.5">
                    <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center relative">
                      {story.isOwn ? (
                        <>
                          <User className="h-6 w-6 text-gray-400" />
                          <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-[#0095f6] rounded-full flex items-center justify-center border-2 border-white">
                            <span className="text-white text-xs">+</span>
                          </div>
                        </>
                      ) : (
                        <span className="text-xs font-semibold text-gray-600">{story.username.slice(0, 2).toUpperCase()}</span>
                      )}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-900 truncate w-16 text-center">
                  {story.isOwn ? "Your Story" : story.username}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-xl mx-auto px-4 py-4">
        {activeTab === 'home' && (
          <>
            {/* User's Posts Feed */}
            {posts.length > 0 ? (
              <div className="space-y-6">
                {posts.map((post) => (
                  <div key={post.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    {/* Post Header */}
                    <div className="flex items-center gap-3 p-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5">
                        <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold">{username[0]?.toUpperCase()}</span>
                        </div>
                      </div>
                      <span className="font-semibold text-sm text-gray-900 flex items-center gap-1">
                        {username}
                        {isVerified && (
                          <span className="inline-flex items-center justify-center w-4 h-4 bg-[#0095f6] rounded-full">
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                      </span>
                    </div>
                    {/* Post Image */}
                    <img src={post.imageUrl} alt="Post" className="w-full aspect-square object-cover" />
                    {/* Post Actions */}
                    <div className="p-3">
                      <div className="flex gap-4 mb-2">
                        <Heart className="h-6 w-6 cursor-pointer hover:text-gray-500" />
                        <MessageCircle className="h-6 w-6 cursor-pointer hover:text-gray-500" />
                      </div>
                      <p className="font-semibold text-sm">{post.likes} likes</p>
                      <p className="text-sm mt-1">
                        <span className="font-semibold">{username}</span> {post.caption}
                      </p>
                      <div className="mt-2 text-xs text-gray-500">
                        <span className="font-semibold text-gray-700">Label:</span>{" "}
                        {post.moderation.label} • {post.moderation.confidence}%
                        {post.moderation.needsReview && (
                          <span className="text-amber-600"> • Review recommended</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1 uppercase">
                        {new Date(post.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5 mb-4">
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-400" />
                  </div>
                </div>
                
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center justify-center gap-2">
                    @{username}
                    {isVerified && (
                      <span className="inline-flex items-center justify-center w-5 h-5 bg-[#0095f6] rounded-full">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </h2>
                  {isVerified && (
                    <p className="text-xs text-[#0095f6] mt-1">Verified Identity</p>
                  )}
                </div>

                <div className="py-8">
                  <div className="w-24 h-24 mx-auto border-2 border-gray-900 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <circle cx="12" cy="13" r="3" strokeWidth={1.5} />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-light text-gray-900 mb-2">Share Photos</h3>
                  <p className="text-gray-500 text-sm mb-6">
                    When you share photos, they will appear on your profile.
                  </p>
                  <button 
                    onClick={onCreatePost}
                    className="text-[#0095f6] font-semibold text-sm hover:text-[#00376b]"
                  >
                    Share your first photo
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'reels' && (
          <div className="py-4">
            <h3 className="text-lg font-semibold mb-4">Reels</h3>
            <div className="grid grid-cols-3 gap-1">
              {sampleReels.map((reel) => (
                <div key={reel.id} className="relative aspect-[9/16] bg-gray-100 rounded overflow-hidden cursor-pointer group">
                  <img src={reel.thumbnail} alt="Reel" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-end p-2">
                    <div className="flex items-center gap-1 text-white text-xs">
                      <Film className="h-3 w-3" />
                      <span>{reel.views}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-gray-400 mt-6">Create reels to share moments</p>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="py-4">
            {/* Profile Header */}
            <div className="flex items-center gap-6 mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  @{username}
                  {isVerified && (
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-[#0095f6] rounded-full">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </h2>
              </div>
            </div>

            {/* Stats */}
            <div className="flex justify-around border-y border-gray-200 py-3 mb-4">
              <div className="text-center">
                <p className="font-semibold">{posts.length}</p>
                <p className="text-xs text-gray-500">posts</p>
              </div>
              <div className="text-center">
                <p className="font-semibold">0</p>
                <p className="text-xs text-gray-500">followers</p>
              </div>
              <div className="text-center">
                <p className="font-semibold">0</p>
                <p className="text-xs text-gray-500">following</p>
              </div>
            </div>

            {/* My Posts Grid */}
            <div className="flex items-center gap-2 mb-4">
              <Grid3X3 className="h-4 w-4" />
              <span className="text-sm font-semibold">My Posts</span>
            </div>
            
            {posts.length > 0 ? (
              <div className="grid grid-cols-3 gap-1">
                {posts.map((post) => (
                  <div key={post.id} className="aspect-square">
                    <img src={post.imageUrl} alt="Post" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                <div className="w-16 h-16 mx-auto border-2 border-gray-900 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <circle cx="12" cy="13" r="3" strokeWidth={1.5} />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">No posts yet</p>
                <button 
                  onClick={onCreatePost}
                  className="text-[#0095f6] font-semibold text-sm mt-2 hover:text-[#00376b]"
                >
                  Create your first post
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300">
        <div className="flex items-center justify-around h-14">
          <button 
            onClick={() => setActiveTab('home')} 
            className="p-3"
          >
            <Home className={`h-6 w-6 ${activeTab === 'home' ? 'text-gray-900' : 'text-gray-500'}`} fill={activeTab === 'home' ? 'currentColor' : 'none'} />
          </button>
          <button className="p-3">
            <Search className="h-6 w-6 text-gray-500" />
          </button>
          <button onClick={onCreatePost} className="p-3">
            <PlusSquare className="h-6 w-6 text-gray-500" />
          </button>
          <button 
            onClick={() => setActiveTab('reels')} 
            className="p-3"
          >
            <Film className={`h-6 w-6 ${activeTab === 'reels' ? 'text-gray-900' : 'text-gray-500'}`} />
          </button>
          <button 
            onClick={() => setActiveTab('profile')} 
            className="p-3"
          >
            <User className={`h-6 w-6 ${activeTab === 'profile' ? 'text-gray-900' : 'text-gray-500'}`} />
          </button>
        </div>
      </nav>

      {/* Exit Demo Button */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-40">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onExitDemo}
          className="bg-white shadow-lg text-xs"
        >
          Exit Demo → Back to Secura.AI
        </Button>
      </div>
    </div>
  );
}
