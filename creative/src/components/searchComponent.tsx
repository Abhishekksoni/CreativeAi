import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

interface SearchResult {
  posts: any[];
  users: any[];
  totalResults: number;
}

interface User {
  id: string;
  userName: string;
  name: string;
  bio?: string;
  profilePicture?: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: User;
  createdAt: string;
  imageUrl?: string;
}

const SearchComponent: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save recent searches to localStorage
  useEffect(() => {
    if (recentSearches.length > 0) {
      localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    }
  }, [recentSearches]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults(null);
      setShowDropdown(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/search/all?q=${encodeURIComponent(searchQuery)}`);
      setResults(response.data);
      setShowDropdown(true);
      
      // Add to recent searches
      if (!recentSearches.includes(searchQuery)) {
        setRecentSearches(prev => [searchQuery, ...prev.slice(0, 4)]);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.trim()) {
      handleSearch(value);
    } else {
      setResults(null);
      setShowDropdown(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      handleSearch(query);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults(null);
    setShowDropdown(false);
  };

  const getProfilePictureUrl = (user: User): string | undefined => {
    if (!user) return undefined;
    return user.profilePicture || "/default-avatar.png";
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="relative flex-1 max-w-md" ref={searchRef}>
      <div className="relative">
        <Input
          type="text"
          placeholder="Search posts, users, or topics..."
          value={query}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onFocus={() => {
            if (query.trim() || recentSearches.length > 0) {
              setShowDropdown(true);
            }
          }}
          className="w-full px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2">Searching...</p>
            </div>
          ) : results ? (
            <div className="p-2">
              {/* Results Summary */}
              <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100 dark:border-gray-700">
                {results.totalResults} results found
              </div>

              {/* Users Section */}
              {results.users.length > 0 && (
                <div className="mb-4">
                  <div className="px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                    Users
                  </div>
                  {results.users.map((user: User) => (
                    <Link
                      key={user.id}
                      to={`/profile/${user.id}`}
                      className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={getProfilePictureUrl(user)}
                          alt={user.userName}
                        />
                        <AvatarFallback>{user.userName.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.userName}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {user.name}
                        </div>
                        {user.bio && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {truncateText(user.bio, 50)}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Posts Section */}
              {results.posts.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                    Posts
                  </div>
                  {results.posts.map((post: Post) => (
                    <Link
                      key={post.id}
                      to={`/post/${post.id}`}
                      className="block px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-6 h-6 mt-1">
                          <AvatarImage
                            src={getProfilePictureUrl(post.author)}
                            alt={post.author.userName}
                          />
                          <AvatarFallback>{post.author.userName.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {post.title}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            by {post.author.userName} • {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                            {truncateText(post.content, 80)}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* No Results */}
              {results.totalResults === 0 && (
                <div className="p-4 text-center text-gray-500">
                  <p>No results found for "{query}"</p>
                  <p className="text-xs mt-1">Try different keywords</p>
                </div>
              )}
            </div>
          ) : (
            /* Recent Searches */
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                Recent Searches
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setQuery(search);
                    handleSearch(search);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  {search}
                </button>
              ))}
              {recentSearches.length === 0 && (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No recent searches
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchComponent; 