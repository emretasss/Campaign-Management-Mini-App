"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import React, { useState } from "react";

export default function CampaignsPage() {
  const router = useRouter();
  const { data: campaigns, isLoading, refetch } = trpc.campaign.list.useQuery();
  const deleteMutation = trpc.campaign.delete.useMutation();

  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; campaignId: number | null; campaignTitle: string }>({
    isOpen: false,
    campaignId: null,
    campaignTitle: ''
  });
  
  const handleDelete = async (id: number, title: string) => {
    setDeleteModal({ isOpen: true, campaignId: id, campaignTitle: title });
  };

  const confirmDelete = async () => {
    if (deleteModal.campaignId) {
      await deleteMutation.mutateAsync({ id: deleteModal.campaignId });
      refetch();
      setDeleteModal({ isOpen: false, campaignId: null, campaignTitle: '' });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
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



  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-sm mx-auto">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 border-4 border-transparent border-t-purple-600 rounded-full animate-spin mx-auto" style={{ animationDelay: '0.5s' }}></div>
          </div>
          <div>
            <p className="text-gray-600 font-medium text-sm sm:text-base">Loading your campaigns...</p>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">Please wait while we fetch your data</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Page Header */}
      <div className="bg-white/70 backdrop-blur-xl border-b border-white/30 shadow-sm relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-16 sm:pt-4 pb-4 sm:py-6 space-y-4 sm:space-y-0">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Campaigns
              </h1>
              <p className="text-gray-600 mt-1 flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 text-sm">
                <span>Manage and organize your marketing campaigns</span>
                <span className="hidden sm:inline w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                <span className="text-xs sm:text-sm text-gray-500">{campaigns?.length || 0} campaigns</span>
              </p>
            </div>
            <button
              onClick={() => router.push("/campaigns/new")}
              className="group w-full sm:w-auto px-4 sm:px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm sm:text-base">Create Campaign</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {campaigns && campaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="p-4 sm:p-6">
                  {/* Campaign Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate mb-1">
                        {campaign.title}
                      </h3>
                      {campaign.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {campaign.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 ml-3">
                      <button
                        onClick={() => router.push(`/campaigns/${campaign.id}`)}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                        title="View Details"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => router.push(`/campaigns/${campaign.id}/edit`)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        title="Edit Campaign"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(campaign.id, campaign.title)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Delete Campaign"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Campaign Details */}
                  <div className="space-y-3">
                    {/* Budget */}
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Budget</p>
                        <p className="text-sm font-semibold text-gray-900">${Number(campaign.budget).toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Date Range */}
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Duration</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            {formatDate(campaign.startDate)}
                          </span>
                          <span className="text-gray-400">→</span>
                          <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                            {formatDate(campaign.endDate)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${isActiveCampaign(campaign.endDate) ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className={`text-xs font-medium ${isActiveCampaign(campaign.endDate) ? 'text-green-700' : 'text-red-700'}`}>
                          {isActiveCampaign(campaign.endDate) ? 'Active' : 'Ended'}
                        </span>
                      </div>
                      <Link
                        href={`/campaigns/${campaign.id}`}
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center space-x-1 transition-colors duration-200"
                      >
                        <span>View Details</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No campaigns yet</h3>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">Get started by creating your first marketing campaign</p>
            <button
              onClick={() => router.push("/campaigns/new")}
              className="inline-flex items-center px-4 sm:px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Your First Campaign
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Campaign</h3>
                              <p className="text-gray-600 text-sm">
                  Are you sure you want to delete <span className="font-semibold">&quot;{deleteModal.campaignTitle}&quot;</span>? This action cannot be undone.
                </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setDeleteModal({ isOpen: false, campaignId: null, campaignTitle: '' })}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {deleteMutation.isPending ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Deleting...</span>
                  </div>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
