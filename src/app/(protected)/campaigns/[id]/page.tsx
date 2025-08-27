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

  const filteredInfluencers = allInfluencers?.filter((influencer: any) =>
    influencer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!Number.isFinite(id)) return null;

  if (campaignLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading campaign...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Campaign not found</h1>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
          >
            Back to Dashboard
          </button>
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
                  {campaign.title}
                </h1>
                <p className="text-gray-600 mt-1">Campaign Details</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push(`/campaigns/${id}/edit`)}
                className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-2 rounded-xl font-medium hover:from-gray-700 hover:to-gray-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Edit Campaign
              </button>
              <button
                onClick={() => setShowAssignModal(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Assign Influencer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Campaign Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Campaign Details Card */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{campaign.title}</h2>
                  {campaign.description && (
                    <p className="text-gray-600 text-lg leading-relaxed">{campaign.description}</p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isActiveCampaign(campaign.end_date)
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {isActiveCampaign(campaign.end_date) ? 'Active' : 'Ended'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                  <div className="text-2xl font-bold text-indigo-600">${Number(campaign.budget).toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Budget</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">{formatDate(campaign.start_date)}</div>
                  <div className="text-sm text-gray-600">Start Date</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
                  <div className="text-2xl font-bold text-orange-600">{formatDate(campaign.end_date)}</div>
                  <div className="text-sm text-gray-600">End Date</div>
                </div>
              </div>
            </div>

            {/* Assigned Influencers */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Assigned Influencers</h3>
                <span className="text-sm text-gray-600">{assigned?.length || 0} assigned</span>
              </div>

              {assigned && assigned.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {assigned.map((influencer: any) => (
                    <div key={influencer.id} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900">{influencer.name}</h4>
                          <p className="text-sm text-gray-600">{influencer.follower_count.toLocaleString()} followers</p>
                          <p className="text-sm text-gray-600">{influencer.engagement_rate}% engagement rate</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">Reach</div>
                          <div className="text-sm font-semibold text-gray-900">
                            {Math.round(influencer.follower_count * (influencer.engagement_rate / 100)).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No influencers assigned</h4>
                  <p className="text-gray-600 mb-4">Start building your campaign by assigning influencers</p>
                  <button
                    onClick={() => setShowAssignModal(true)}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                  >
                    Assign Influencer
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Campaign Stats */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Campaign Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Reach</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {assigned?.reduce((total, inf: any) => total + inf.follower_count, 0).toLocaleString() || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Avg Engagement</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {assigned && assigned.length > 0 
                      ? (assigned.reduce((total, inf: any) => total + inf.engagement_rate, 0) / assigned.length).toFixed(1) + '%'
                      : '0%'
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Days Remaining</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {isActiveCampaign(campaign.end_date) 
                      ? Math.ceil((new Date(campaign.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                      : 0
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assign Influencer Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Assign Influencer</h3>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Search influencers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {influencersLoading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading influencers...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredInfluencers?.map((influencer: any) => (
                    <div key={influencer.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{influencer.name}</h4>
                          <p className="text-sm text-gray-600">{influencer.follower_count.toLocaleString()} followers</p>
                        </div>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          {influencer.engagement_rate}% ER
                        </span>
                      </div>
                                             <button
                         onClick={() => handleAssignInfluencer(influencer.id)}
                         disabled={assignMutation.isPending}
                         className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                       >
                         {assignMutation.isPending ? 'Assigning...' : 'Assign'}
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
