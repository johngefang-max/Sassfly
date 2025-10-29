"use client";

import { Header } from "../../components";
import { Gem, Image as ImageIcon } from "lucide-react";

export default function MyArtsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Global Header */}
      <Header />

      {/* Sub Navigation */}
      <div className="bg-white/60 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-8 py-4">
            <a href="/my-subscription" className="flex items-center text-gray-600 hover:text-purple-700">
              <Gem className="w-5 h-5 mr-2" />
              My Subscription
            </a>
            <a href="/my-arts" className="flex items-center text-purple-700 font-medium">
              <ImageIcon className="w-5 h-5 mr-2" />
              My Arts
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Arts</h1>
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <p className="text-gray-600">You haven't generated any images yet.</p>
        </div>

        <div className="mt-10 text-center text-sm text-gray-500">
          © 2025 ImagePrompt.org. All rights reserved. | Privacy policy | Terms and conditions
        </div>
      </div>
    </div>
  );
}