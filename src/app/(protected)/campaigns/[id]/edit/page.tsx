"use client";
import { useParams, useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import React, { useState, useEffect } from "react";

export default function CampaignEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    startDate: "",
    endDate: "",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { data: campaign, isLoading } = trpc.campaign.byId.useQuery({ id }, { enabled: Number.isFinite(id) });
  const updateMutation = trpc.campaign.update.useMutation();

  useEffect(() => {
    if (campaign) {
      setFormData({
        title: campaign.title,
        description: campaign.description || "",
        budget: String(campaign.budget),
        startDate: campaign.start_date,
        endDate: campaign.end_date,
      });
    }
  }, [campaign]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.budget || Number(formData.budget) < 0) {
      newErrors.budget = "Budget must be a positive number";
    }
    
    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }
    
    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }
    
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = "End date must be after start date";
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
      await updateMutation.mutateAsync({
        id,
        title: formData.title,
        description: formData.description,
        budget: Number(formData.budget),
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
      });
      
      router.push(`/campaigns/${id}`);
    } catch (error) {
      console.error("Failed to update campaign:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (!Number.isFinite(id)) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-sm mx-auto">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 border-4 border-transparent border-t-purple-600 rounded-full animate-spin mx-auto" style={{ animationDelay: '0.5s' }}></div>
          </div>
          <div>
            <p className="text-gray-600 font-medium text-sm sm:text-base">Loading campaign...</p>
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
      <div className="bg-white/70 backdrop-blur-xl border-b border-white/30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4 sm:space-x-6">
              <button
                onClick={() => router.push(`/campaigns/${id}`)}
                className="group p-2 sm:p-3 rounded-xl bg-white/50 hover:bg-white/80 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-gray-600 group-hover:text-gray-800 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Edit Campaign
                </h1>
                <p className="text-gray-600 mt-1 text-sm">Update your campaign details</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl border border-white/30">
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Campaign Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">Campaign Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm ${
                  errors.title ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter campaign title"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1 sm:mt-2">{errors.title}</p>}
            </div>

            {/* Campaign Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={4}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm resize-none"
                placeholder="Describe your campaign goals and strategy..."
              />
            </div>

            {/* Budget and Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">Budget ($) *</label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => handleInputChange("budget", e.target.value)}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm ${
                    errors.budget ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="5000"
                />
                {errors.budget && <p className="text-red-500 text-xs mt-1 sm:mt-2">{errors.budget}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">Start Date *</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm ${
                    errors.startDate ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.startDate && <p className="text-red-500 text-xs mt-1 sm:mt-2">{errors.startDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">End Date *</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm ${
                    errors.endDate ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.endDate && <p className="text-red-500 text-xs mt-1 sm:mt-2">{errors.endDate}</p>}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6">
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="flex-1 px-4 sm:px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-sm"
              >
                {updateMutation.isPending ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating...</span>
                  </div>
                ) : (
                  'Update Campaign'
                )}
              </button>
              <button
                type="button"
                onClick={() => router.push(`/campaigns/${id}`)}
                className="flex-1 px-4 sm:px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
