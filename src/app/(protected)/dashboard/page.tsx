"use client";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";

import React, { useState } from "react";

export default function DashboardPage() {
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
                Campaign Dashboard
              </h1>
              <p className="text-gray-600 mt-1 flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 text-sm">
                <span>Manage your marketing campaigns</span>
                <span className="hidden sm:inline w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                <span className="text-xs sm:text-sm text-gray-500">{campaigns?.length || 0} campaigns</span>
              </p>
            </div>
            <button
              onClick={() => router.push("/campaigns/new")}
              className="group w-full sm:w-auto px-4 sm:px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="group bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Campaigns</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{campaigns?.length || 0}</p>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <div className="text-xs text-gray-500">Active</div>
                <div className="text-sm font-semibold text-emerald-600">
                  {campaigns?.filter(c => isActiveCampaign(c.end_date)).length || 0}
                </div>
              </div>
            </div>
          </div>

          <div className="group bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Budget</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                    ${formatNumber(campaigns?.reduce((sum, campaign) => sum + Number(campaign.budget), 0) || 0)}
                  </p>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <div className="text-xs text-gray-500">Avg/Campaign</div>
                <div className="text-sm font-semibold text-emerald-600">
                  ${campaigns && campaigns.length > 0 
                    ? formatNumber(Math.round(campaigns.reduce((sum, campaign) => sum + Number(campaign.budget), 0) / campaigns.length))
                    : '0'
                  }
                </div>
              </div>
            </div>
          </div>

          <div className="group bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-300 hover:scale-105 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Active Campaigns</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {campaigns?.filter(c => isActiveCampaign(c.end_date)).length || 0}
                  </p>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <div className="text-xs text-gray-500">Ending Soon</div>
                <div className="text-sm font-semibold text-orange-600">
                  {campaigns?.filter(c => {
                    const end = new Date(c.end_date);
                    const now = new Date();
                    const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                    return daysLeft <= 7 && daysLeft > 0;
                  }).length || 0}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {campaigns?.map((campaign, index) => (
            <div
              key={campaign.id}
              className="group bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex justify-between items-start mb-4 sm:mb-6">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-200">
                    {campaign.title}
                  </h3>
                  {campaign.description && (
                    <p className="text-gray-600 text-xs sm:text-sm mt-2 line-clamp-2">
                      {campaign.description}
                    </p>
                  )}
                </div>
                <div className="flex space-x-1 sm:space-x-2 ml-2 sm:ml-4">
                  <button
                    onClick={() => router.push(`/campaigns/${campaign.id}`)}
                    className="p-1.5 sm:p-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg sm:rounded-xl transition-all duration-200 group-hover:scale-110"
                    title="View Campaign"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => router.push(`/campaigns/${campaign.id}/edit`)}
                    className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg sm:rounded-xl transition-all duration-200 group-hover:scale-110"
                    title="Edit Campaign"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(campaign.id, campaign.title)}
                    className="p-1.5 sm:p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg sm:rounded-xl transition-all duration-200 group-hover:scale-110"
                    title="Delete Campaign"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center p-3 sm:p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl sm:rounded-2xl border border-indigo-200/50">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Budget</p>
                      <p className="text-sm sm:text-lg font-bold text-gray-900">
                        ${Number(campaign.budget).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="text-center p-2 sm:p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl sm:rounded-2xl border border-emerald-200/50">
                    <p className="text-xs text-gray-500 mb-1">Start</p>
                    <p className="text-xs sm:text-sm font-semibold text-gray-900">
                      {formatDate(campaign.start_date)}
                    </p>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl sm:rounded-2xl border border-orange-200/50">
                    <p className="text-xs text-gray-500 mb-1">End</p>
                    <p className="text-xs sm:text-sm font-semibold text-gray-900">
                      {formatDate(campaign.end_date)}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                      isActiveCampaign(campaign.end_date) ? 'bg-emerald-500' : 'bg-gray-400'
                    }`}></div>
                    <span className={`text-xs sm:text-sm font-medium ${
                      isActiveCampaign(campaign.end_date) ? 'text-emerald-700' : 'text-gray-600'
                    }`}>
                      {isActiveCampaign(campaign.end_date) ? 'Active' : 'Ended'}
                    </span>
                  </div>
                  <button
                    onClick={() => router.push(`/campaigns/${campaign.id}`)}
                    className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-700 font-medium hover:underline transition-all duration-200"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {campaigns?.length === 0 && (
          <div className="text-center py-12 sm:py-16 px-4">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">No campaigns yet</h3>
            <p className="text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">Start building your marketing success by creating your first campaign. Track performance, manage budgets, and collaborate with influencers all in one place.</p>
            <button
              onClick={() => router.push("/campaigns/new")}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm sm:text-base">Create Your First Campaign</span>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-sm sm:max-w-md w-full shadow-2xl border border-white/30 animate-in">
            <div className="p-6 sm:p-8">
              <div className="text-center mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Delete Campaign</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Are you sure you want to delete <span className="font-semibold text-gray-900">&quot;{deleteModal.campaignTitle}&quot;</span>? 
                  This action cannot be undone.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => setDeleteModal({ isOpen: false, campaignId: null, campaignTitle: '' })}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleteMutation.isPending}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  {deleteMutation.isPending ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Deleting...</span>
                    </div>
                  ) : (
                    'Delete Campaign'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
