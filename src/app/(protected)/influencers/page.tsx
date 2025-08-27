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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-sm mx-auto">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 border-4 border-transparent border-t-purple-600 rounded-full animate-spin mx-auto" style={{ animationDelay: '0.5s' }}></div>
          </div>
          <div>
            <p className="text-gray-600 font-medium text-sm sm:text-base">Loading influencers...</p>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">Please wait while we fetch your data</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-xl border-b border-white/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4 sm:space-x-6">
              <button
                onClick={() => router.push("/dashboard")}
                className="group p-2 sm:p-3 rounded-xl bg-white/50 hover:bg-white/80 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-gray-600 group-hover:text-gray-800 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Influencers
                </h1>
                <p className="text-gray-600 mt-1 flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 text-sm">
                  <span>Manage your influencer database</span>
                  <span className="hidden sm:inline w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                  <span className="text-xs sm:text-sm text-gray-500">{influencers?.length || 0} influencers</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="group w-full sm:w-auto px-4 sm:px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm sm:text-base">{showForm ? "Cancel" : "Add Influencer"}</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Add Influencer Form */}
        {showForm && (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl border border-white/30 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Add New Influencer</h2>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm ${
                      errors.name ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Influencer name"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Follower Count</label>
                  <input
                    type="number"
                    value={form.followerCount}
                    onChange={(e) => handleInputChange("followerCount", e.target.value)}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm ${
                      errors.followerCount ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="100000"
                  />
                  {errors.followerCount && <p className="text-red-500 text-xs mt-1">{errors.followerCount}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Engagement Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.engagementRate}
                    onChange={(e) => handleInputChange("engagementRate", e.target.value)}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm ${
                      errors.engagementRate ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="3.5"
                  />
                  {errors.engagementRate && <p className="text-red-500 text-xs mt-1">{errors.engagementRate}</p>}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1 px-4 sm:px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-sm"
                >
                  {createMutation.isPending ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Adding...</span>
                    </div>
                  ) : (
                    'Add Influencer'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 sm:px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Influencers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {influencers?.map((influencer, index) => (
            <div
              key={influencer.id}
              className="group bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex justify-between items-start mb-4 sm:mb-6">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-sm sm:text-lg">
                      {influencer.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-lg line-clamp-1">{influencer.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Influencer</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="px-2 sm:px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                    {influencer.engagement_rate}% ER
                  </div>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center p-3 sm:p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl sm:rounded-2xl border border-indigo-200/50">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Followers</p>
                      <p className="text-sm sm:text-lg font-bold text-gray-900">
                        {formatNumber(influencer.follower_count)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="text-center p-2 sm:p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl sm:rounded-2xl border border-emerald-200/50">
                    <p className="text-xs text-gray-500 mb-1">Engagement</p>
                    <p className="text-xs sm:text-sm font-semibold text-gray-900">
                      {influencer.engagement_rate}%
                    </p>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl sm:rounded-2xl border border-orange-200/50">
                    <p className="text-xs text-gray-500 mb-1">Reach</p>
                    <p className="text-xs sm:text-sm font-semibold text-gray-900">
                      {formatNumber(Math.round(influencer.follower_count * (influencer.engagement_rate / 100)))}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {influencers?.length === 0 && (
          <div className="text-center py-12 sm:py-16 px-4">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">No influencers yet</h3>
            <p className="text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">Start building your influencer database by adding your first influencer. Track their performance and manage partnerships all in one place.</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm sm:text-base">Add Your First Influencer</span>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
