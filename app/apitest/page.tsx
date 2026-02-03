'use client';

import { useState } from 'react';
import Link from "next/link";
import axios from 'axios';
import { ApiResponse } from '@/types/api';

export default function ApiTestPage() {
  const [getResponse, setGetResponse] = useState<ApiResponse | null>(null);
  const [postResponse, setPostResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // GET API调用（使用axios）
  const handleGetApi = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/hello');
      setGetResponse(response.data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(`GET API Error: ${errorMsg}`);
      console.error('GET API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // POST API调用（使用axios）
  const handlePostApi = async () => {
    setLoading(true);
    setError(null);
    try {
      const postData = { name: 'World', message: 'Hello from apitest page!' };
      const response = await axios.post('/api/hello', postData);
      setPostResponse(response.data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(`POST API Error: ${errorMsg}`);
      console.error('POST API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left w-full">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            API Test Page
          </h1>
          {error && (
            <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg text-left dark:bg-red-900 dark:border-red-800">
              <p className="text-red-600 dark:text-red-300 font-medium">{error}</p>
            </div>
          )}

          <div className="flex flex-col gap-4 w-full sm:flex-row">
            <button
              onClick={handleGetApi}
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            >
              {loading ? 'Loading...' : 'Call GET API'}
            </button>
            <button
              onClick={handlePostApi}
              disabled={loading}
              className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            >
              {loading ? 'Loading...' : 'Call POST API'}
            </button>
          </div>

          {getResponse && (
            <div className="mt-6 w-full p-4 border border-gray-200 rounded-lg dark:border-gray-700 text-left">
              <h3 className="font-medium mb-2 text-black dark:text-white">GET API Response:</h3>
              <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto dark:bg-gray-900">
                {JSON.stringify(getResponse, null, 2)}
              </pre>
            </div>
          )}

          {postResponse && (
            <div className="mt-6 w-full p-4 border border-gray-200 rounded-lg dark:border-gray-700 text-left">
              <h3 className="font-medium mb-2 text-black dark:text-white">POST API Response:</h3>
              <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto dark:bg-gray-900">
                {JSON.stringify(postResponse, null, 2)}
              </pre>
            </div>
          )}

          <Link
            href="/"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
          >
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}