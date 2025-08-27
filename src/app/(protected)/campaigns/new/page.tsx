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
    budget: 0,
    startDate: "",
    endDate: "",
  });

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Create Campaign</h1>
      <form
        className="space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          await createMutation.mutateAsync({
            title: form.title,
            description: form.description || undefined,
            budget: Number(form.budget),
            startDate: new Date(form.startDate),
            endDate: new Date(form.endDate),
          });
          router.replace("/dashboard");
        }}
      >
        <input className="w-full border rounded px-3 py-2" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea className="w-full border rounded px-3 py-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input className="w-full border rounded px-3 py-2" type="number" placeholder="Budget" value={form.budget} onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })} />
        <input className="w-full border rounded px-3 py-2" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
        <input className="w-full border rounded px-3 py-2" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
        <button className="bg-black text-white px-4 py-2 rounded">Save</button>
      </form>
    </div>
  );
}
