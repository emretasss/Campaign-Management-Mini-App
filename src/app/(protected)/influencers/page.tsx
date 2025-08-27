"use client";
import React from "react";
import { trpc } from "@/lib/trpc";

export default function InfluencersPage() {
  const { data, refetch } = trpc.influencer.list.useQuery();
  const createMutation = trpc.influencer.create.useMutation();
  const [form, setForm] = React.useState({ name: "", followerCount: 0, engagementRate: 0 });
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Influencers</h1>
      <form
        className="flex gap-2 items-end"
        onSubmit={async (e) => {
          e.preventDefault();
          await createMutation.mutateAsync({ ...form });
          setForm({ name: "", followerCount: 0, engagementRate: 0 });
          await refetch();
        }}
      >
        <input className="border rounded px-3 py-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="border rounded px-3 py-2" type="number" placeholder="Followers" value={form.followerCount} onChange={(e) => setForm({ ...form, followerCount: Number(e.target.value) })} />
        <input className="border rounded px-3 py-2" type="number" placeholder="Engagement %" value={form.engagementRate} onChange={(e) => setForm({ ...form, engagementRate: Number(e.target.value) })} />
        <button className="bg-black text-white px-4 py-2 rounded">Add</button>
      </form>
      <ul className="space-y-2">
        {data?.map((i: any) => (
          <li key={i.id} className="border rounded p-3 flex justify-between">
            <span>{i.name}</span>
            <span className="text-sm text-gray-600">{i.followerCount} • {String(i.engagementRate)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
