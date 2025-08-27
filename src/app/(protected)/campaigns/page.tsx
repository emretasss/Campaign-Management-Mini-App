"use client";
import Link from "next/link";
import { trpc } from "@/lib/trpc";

export default function CampaignsPage() {
  const { data, isLoading } = trpc.campaign.list.useQuery();
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Campaigns</h1>
        <Link href="/campaigns/new" className="bg-black text-white px-4 py-2 rounded">New</Link>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-2">
          {data?.map((c) => (
            <li key={c.id} className="border rounded p-3 flex items-center justify-between">
              <div>
                <p className="font-medium">{c.title}</p>
                <p className="text-sm text-gray-600">{c.description}</p>
              </div>
              <Link href={`/campaigns/${c.id}`} className="text-blue-600 underline">Open</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
