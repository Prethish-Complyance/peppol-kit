"use client";

import { useState } from "react";

export default function Home() {
  const [participant, setParticipant] = useState("");
  const [sml, setSml] = useState<"test" | "production">("test");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function lookup() {
    if (!participant) return;

    setLoading(true);
    setResult(null);
    setError("");

    try {
      const response = await fetch(
        `/api/lookup?participant=${encodeURIComponent(participant)}&sml=${sml}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setResult(data);
    } catch (error) {
      setError(`Lookup failed in ${sml}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bg-zinc-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6">
        <h1 className="text-4xl font-bold">Peppol Kit Demo</h1>

        <p className="mt-2 text-zinc-400">
        Peppol participant information.
        </p>

        <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="flex gap-3">
            <input
              value={participant}
              onChange={(e) => setParticipant(e.target.value)}
              placeholder="0235:1341924489"
              className="flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-zinc-400"
            />

            <select
              value={sml}
              onChange={(e) =>
                setSml(e.target.value as "test" | "production")
              }
              className="rounded-lg border border-zinc-700 bg-zinc-950 px-4"
            >
              <option value="test">Test</option>
              <option value="production">Production</option>
            </select>
          </div>

          <button
            onClick={lookup}
            disabled={loading || !participant}
            className="mt-4 w-full rounded-lg bg-white py-3 font-medium text-black hover:bg-zinc-200 disabled:opacity-50"
          >
            {loading ? "Looking up..." : "Lookup Participant"}
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-900 bg-red-950/40 p-4 text-red-300">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <h2 className="mb-3 font-semibold">Result</h2>

            <pre className="overflow-auto rounded-lg bg-zinc-950 p-4 text-sm text-zinc-300">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}