"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";

export default function TestDBPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const supabase = createClient();

        // 1. Check Configuration Keys
        if (
          !process.env.NEXT_PUBLIC_SUPABASE_URL ||
          !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ) {
          throw new Error(
            "Variables d'environnement manquantes (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)"
          );
        }

        // 2. Ping Supabase (Get Session is a lightweight check)
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        // 3. Simple DB Select (Optional, to check Table access)
        // We select count from profiles, limit 1 just to see if table exists and is accessible public logic
        // Ignore error if RLS blocks, connection is still OK.
        await supabase
          .from("profiles")
          .select("count", { count: "exact", head: true });

        setStatus("success");
        setMessage("Connexion établie avec succès !");
      } catch (err: any) {
        console.error("Supabase Connection Error:", err);
        setStatus("error");
        setMessage(err.message || "Erreur inconnue");
      }
    };

    checkConnection();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0B0D12] text-gray-900 dark:text-gray-100 p-4">
      <div className="max-w-md w-full bg-white dark:bg-[#1C1F26] rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-[#2A2D35] text-center space-y-4">
        <h1 className="text-2xl font-bold">État de la Connexion Supabase</h1>

        <div className="flex flex-col items-center justify-center py-6">
          {status === "loading" && (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
          )}

          {status === "success" && (
            <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-2">
              <span className="text-4xl">🟢</span>
            </div>
          )}

          {status === "error" && (
            <div className="h-16 w-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-2">
              <span className="text-4xl">🔴</span>
            </div>
          )}
        </div>

        <div>
          <p
            className={`text-lg font-medium ${
              status === "success"
                ? "text-green-600 dark:text-green-400"
                : status === "error"
                ? "text-red-600 dark:text-red-400"
                : "text-gray-500"
            }`}
          >
            {status === "loading"
              ? "Vérification en cours..."
              : status === "success"
              ? "Supabase Connecté"
              : "Échec de Connexion"}
          </p>
          {message && <p className="text-sm text-gray-500 mt-2">{message}</p>}
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-white/5 text-xs text-left space-y-1 font-mono text-gray-400">
          <p>
            URL:{" "}
            {process.env.NEXT_PUBLIC_SUPABASE_URL
              ? "DÉFINIE ✅"
              : "MANQUANTE ❌"}
          </p>
          <p>
            KEY:{" "}
            {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
              ? "DÉFINIE ✅"
              : "MANQUANTE ❌"}
          </p>
        </div>
      </div>
    </div>
  );
}
