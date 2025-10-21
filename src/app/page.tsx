"use client";

import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/header";
import Loading from "@/components/loading";

export default function Home() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* HEADER */}
      <Header />

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-10">

      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-lg border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-600">
            © 2025 Clone Marke List.
          </p>
        </div>
      </footer>
    </div>
  );
}