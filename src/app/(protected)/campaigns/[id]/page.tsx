"use client";
import { useParams, useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import React, { useState } from "react";

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id);
  
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: campaign, isLoading: campaignLoading } = trpc.campaign.byId.useQuery({ id }, { enabled: Number.isFinite(id) });
  const { data: assigned, refetch } = trpc.campaign.influencers.useQuery({ campaignId: id }, { enabled: Number.isFinite(id) });
  const { data: allInfluencers, isLoading: influencersLoading } = trpc.influencer.list.useQuery();
  const assignMutation = trpc.campaign.assignInfluencer.useMutation();

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return "Invalid Date";
    }
  };

  const isActiveCampaign = (endDate: string) => {
    try {
      const end = new Date(endDate);
      return end > new Date();
    } catch {
      return false;
    }
  };

  const handleAssignInfluencer = async (influencerId: number) => {
    try {
      await assignMutation.mutateAsync({ campaignId: id, influencerId });
      await refetch();
      setShowAssignModal(false);
    } catch (error) {
      console.error("Failed to assign influencer:", error);
    }
  };

  const filteredInfluencers = allInfluencers?.filter(influencer =>
    influencer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (!Number.isFinite(id)) return null;

  if (campaignLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-sm mx-auto">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 border-4 border-transparent border-t-purple-600 rounded-full animate-spin mx-auto" style={{ animationDelay: '0.5s' }}></div>
          </div>
          <div>
            <p className="text-gray-600 font-medium text-sm sm:text-base">Loading campaign details...</p>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">Please wait while we fetch your data</p>
          </div>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-md mx-auto">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 sm:w-12 sm:h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Campaign Not Found</h1>
                              <p className="text-gray-600 mb-6 text-sm sm:text-base">The campaign you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 sm:px-8 py-3 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-xl border-b border-white/30 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4 sm:space-x-6">
              <button
                onClick={() => router.push("/dashboard")}
                className="group p-2 sm:p-3 rounded-xl bg-white/50 hover:bg-white/80 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-gray-800 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent truncate">
                  {campaign.title}
                </h1>
                <p className="text-gray-600 mt-1 flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 text-xs sm:text-sm">
                  <span>Campaign Details</span>
                  <span className="hidden sm:inline w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isActiveCampaign(campaign.end_date)
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {isActiveCampaign(campaign.end_date) ? 'Active' : 'Ended'}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => router.push(`/campaigns/${id}/edit`)}
                className="group px-3 sm:px-6 py-2 sm:py-3 bg-white/50 hover:bg-white/80 text-gray-700 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md border border-gray-200/50 text-xs sm:text-sm"
              >
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span className="hidden sm:inline">Edit</span>
                </div>
              </button>
              <button
                onClick={() => setShowAssignModal(true)}
                className="group px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl text-xs sm:text-sm"
              >
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="hidden sm:inline">Assign Influencer</span>
                  <span className="sm:hidden">Assign</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Campaign Info */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Campaign Details Card */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl border border-white/30">
              <div className="flex justify-between items-start mb-6 sm:mb-8">
                <div className="space-y-3 sm:space-y-4 flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{campaign.title}</h2>
                  {campaign.description && (
                    <p className="text-gray-600 text-sm sm:text-lg leading-relaxed max-w-2xl">{campaign.description}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                    isActiveCampaign(campaign.end_date) ? 'bg-emerald-500' : 'bg-gray-400'
                  }`}></div>
                  <span className="text-xs sm:text-sm text-gray-500">
                    {isActiveCampaign(campaign.end_date) ? 'Live' : 'Ended'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div className="group bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-indigo-200/50 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-indigo-600">Total Budget</p>
                      <p className="text-lg sm:text-2xl font-bold text-gray-900">${Number(campaign.budget).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="group bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-emerald-200/50 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-emerald-600">Start Date</p>
                      <p className="text-sm sm:text-lg font-semibold text-gray-900">{formatDate(campaign.start_date)}</p>
                    </div>
                  </div>
                </div>

                <div className="group bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-orange-200/50 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-orange-600">End Date</p>
                      <p className="text-sm sm:text-lg font-semibold text-gray-900">{formatDate(campaign.end_date)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Assigned Influencers Section */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl border border-white/30">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Assigned Influencers</h3>
                  <p className="text-gray-600 text-sm">Manage your campaign&apos;s influencer partnerships</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="px-2 sm:px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full text-xs sm:text-sm font-medium">
                    {assigned?.length || 0} assigned
                  </span>
                  <button
                    onClick={() => setShowAssignModal(true)}
                    className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              </div>

              {assigned && assigned.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {assigned.map((influencer: any, index: number) => (
                    <div 
                      key={influencer.id} 
                      className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200/50 hover:shadow-lg transition-all duration-300 hover:scale-105"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <span className="text-white font-bold text-sm sm:text-lg">
                              {influencer.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm sm:text-lg">{influencer.name}</h4>
                            <p className="text-xs sm:text-sm text-gray-600">Influencer</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="px-2 sm:px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                            {influencer.engagement_rate}% ER
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 sm:gap-4">
                        <div className="text-center">
                          <p className="text-xs text-gray-500 mb-1">Followers</p>
                          <p className="text-xs sm:text-sm font-semibold text-gray-900">
                            {formatNumber(influencer.follower_count)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500 mb-1">Engagement</p>
                          <p className="text-xs sm:text-sm font-semibold text-gray-900">
                            {influencer.engagement_rate}%
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500 mb-1">Reach</p>
                          <p className="text-xs sm:text-sm font-semibold text-gray-900">
                            {formatNumber(Math.round(influencer.follower_count * (influencer.engagement_rate / 100)))}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <svg className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">No influencers assigned yet</h4>
                  <p className="text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto text-sm">Start building your campaign&apos;s reach by assigning influencers. Each influencer will help amplify your message to their audience.</p>
                  <button
                    onClick={() => setShowAssignModal(true)}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 sm:px-8 py-3 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
                  >
                    Assign Your First Influencer
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Campaign Stats Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-white/30">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Campaign Analytics</h3>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex justify-between items-center p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl border border-blue-200/50">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Total Reach</p>
                      <p className="text-sm sm:text-lg font-bold text-gray-900">
                        {formatNumber(assigned?.reduce((total, inf: any) => total + inf.follower_count, 0) || 0)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 sm:p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl sm:rounded-2xl border border-emerald-200/50">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Avg Engagement</p>
                      <p className="text-sm sm:text-lg font-bold text-gray-900">
                        {assigned && assigned.length > 0 
                          ? (assigned.reduce((total, inf: any) => total + inf.engagement_rate, 0) / assigned.length).toFixed(1) + '%'
                          : '0%'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 sm:p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl sm:rounded-2xl border border-orange-200/50">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Days Remaining</p>
                      <p className="text-sm sm:text-lg font-bold text-gray-900">
                        {isActiveCampaign(campaign.end_date) 
                          ? Math.ceil((new Date(campaign.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                          : 0
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-white/30">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowAssignModal(true)}
                  className="w-full p-3 sm:p-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl sm:rounded-2xl font-medium hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
                >
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add Influencer</span>
                  </div>
                </button>
                <button
                  onClick={() => router.push(`/campaigns/${id}/edit`)}
                  className="w-full p-3 sm:p-4 bg-white border border-gray-200 text-gray-700 rounded-xl sm:rounded-2xl font-medium hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md text-sm"
                >
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Edit Campaign</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assign Influencer Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-4xl sm:max-w-5xl w-full max-h-[85vh] overflow-hidden shadow-2xl border border-white/30">
            <div className="p-4 sm:p-8 border-b border-gray-200/50">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Assign Influencer</h3>
                  <p className="text-gray-600 mt-1 text-sm">Choose influencers to collaborate with on this campaign</p>
                </div>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="p-2 sm:p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-4 sm:mt-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search influencers by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 sm:py-3 pl-10 sm:pl-12 border border-gray-300 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
                  />
                  <svg className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="p-4 sm:p-8 overflow-y-auto max-h-[60vh]">
              {influencersLoading ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600 text-sm">Loading influencers...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filteredInfluencers?.map((influencer: any) => (
                    <div key={influencer.id} className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {influencer.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm">{influencer.name}</h4>
                            <p className="text-xs text-gray-600">{formatNumber(influencer.follower_count)} followers</p>
                          </div>
                        </div>
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">
                          {influencer.engagement_rate}% ER
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
                        <div className="text-center p-2 sm:p-3 bg-white/50 rounded-lg sm:rounded-xl">
                          <p className="text-xs text-gray-500 mb-1">Followers</p>
                          <p className="text-xs sm:text-sm font-semibold text-gray-900">
                            {formatNumber(influencer.follower_count)}
                          </p>
                        </div>
                        <div className="text-center p-2 sm:p-3 bg-white/50 rounded-lg sm:rounded-xl">
                          <p className="text-xs text-gray-500 mb-1">Reach</p>
                          <p className="text-xs sm:text-sm font-semibold text-gray-900">
                            {formatNumber(Math.round(influencer.follower_count * (influencer.engagement_rate / 100)))}
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleAssignInfluencer(influencer.id)}
                        disabled={assignMutation.isPending}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 sm:py-3 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-sm"
                      >
                        {assignMutation.isPending ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Assigning...</span>
                          </div>
                        ) : (
                          'Assign to Campaign'
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
