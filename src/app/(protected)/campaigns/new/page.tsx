"use client";
import React from "react";
import { trpc } from "@/lib/trpc";
import { useRouter } from "next/navigation";

export default function NewCampaignPage() {
  const router = useRouter();
  const createMutation = trpc.campaign.create.useMutation();
  const [form, setForm] = React.useState({
    title: "",
    description: "",
    budget: "",
    startDate: "",
    endDate: "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!form.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!form.budget || Number(form.budget) < 0) {
      newErrors.budget = "Budget must be a positive number";
    }
    
    if (!form.startDate) {
      newErrors.startDate = "Start date is required";
    }
    
    if (!form.endDate) {
      newErrors.endDate = "End date is required";
    }
    
    if (form.startDate && form.endDate && new Date(form.startDate) > new Date(form.endDate)) {
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
      await createMutation.mutateAsync({
        title: form.title,
        description: form.description,
        budget: Number(form.budget),
        startDate: new Date(form.startDate),
        endDate: new Date(form.endDate),
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to create campaign:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-xl border-b border-white/30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  Create Campaign
                </h1>
                <p className="text-gray-600 mt-1 text-sm">Start a new marketing campaign</p>
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
                value={form.title}
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
                value={form.description}
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
                  value={form.budget}
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
                  value={form.startDate}
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
                  value={form.endDate}
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
                disabled={createMutation.isPending}
                className="flex-1 px-4 sm:px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-sm"
              >
                {createMutation.isPending ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </div>
                ) : (
                  'Create Campaign'
                )}
              </button>
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
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
