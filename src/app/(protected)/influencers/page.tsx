"use client";
import React from "react";
import { trpc } from "@/lib/trpc";
import { useRouter } from "next/navigation";

export default function InfluencersPage() {
  const router = useRouter();
  const { data: influencers, refetch, isLoading } = trpc.influencer.list.useQuery();
  const createMutation = trpc.influencer.create.useMutation();
  
  const [form, setForm] = React.useState({ 
    name: "", 
    followerCount: "", 
    engagementRate: "" 
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [showForm, setShowForm] = React.useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!form.followerCount || Number(form.followerCount) < 0) {
      newErrors.followerCount = "Follower count must be a positive number";
    }
    
    if (!form.engagementRate || Number(form.engagementRate) < 0 || Number(form.engagementRate) > 100) {
      newErrors.engagementRate = "Engagement rate must be between 0 and 100";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await createMutation.mutateAsync({
        name: form.name,
        followerCount: Number(form.followerCount),
        engagementRate: Number(form.engagementRate),
      });
      
      setForm({ name: "", followerCount: "", engagementRate: "" });
      setShowForm(false);
      await refetch();
    } catch (error) {
      console.error("Failed to create influencer:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading influencers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Influencers
                </h1>
                <p className="text-gray-600 mt-1">Manage your influencer database</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {showForm ? 'Cancel' : '+ Add Influencer'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Influencer Form */}
        {showForm && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Influencer</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={form.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                    errors.name ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Influencer name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="followerCount" className="block text-sm font-medium text-gray-700 mb-2">
                  Followers *
                </label>
                <input
                  type="number"
                  id="followerCount"
                  value={form.followerCount}
                  onChange={(e) => handleInputChange("followerCount", e.target.value)}
                  min="0"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                    errors.followerCount ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="100000"
                />
                {errors.followerCount && (
                  <p className="mt-1 text-sm text-red-600">{errors.followerCount}</p>
                )}
              </div>

              <div>
                <label htmlFor="engagementRate" className="block text-sm font-medium text-gray-700 mb-2">
                  Engagement Rate (%) *
                </label>
                <input
                  type="number"
                  id="engagementRate"
                  value={form.engagementRate}
                  onChange={(e) => handleInputChange("engagementRate", e.target.value)}
                  min="0"
                  max="100"
                  step="0.1"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                    errors.engagementRate ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="4.5"
                />
                {errors.engagementRate && (
                  <p className="mt-1 text-sm text-red-600">{errors.engagementRate}</p>
                )}
              </div>

              <div className="md:col-span-3 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setForm({ name: "", followerCount: "", engagementRate: "" });
                    setErrors({});
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createMutation.isPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Adding...</span>
                    </div>
                  ) : (
                    "Add Influencer"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Influencers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {influencers?.map((influencer: any, index: number) => (
            <div
              key={influencer.id}
              className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {influencer.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                  {influencer.engagement_rate}% ER
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{influencer.name}</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Followers</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatNumber(influencer.follower_count)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Engagement</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {influencer.engagement_rate}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Reach</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatNumber(Math.round(influencer.follower_count * (influencer.engagement_rate / 100)))}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {influencers?.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No influencers yet</h3>
            <p className="text-gray-600 mb-6">Start building your influencer database</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Add Your First Influencer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
