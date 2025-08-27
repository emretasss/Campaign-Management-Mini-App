"use client";
import { supabase } from "@/lib/supabase/client";
import React from "react";

export default function TestAuthPage() {
  const [email, setEmail] = React.useState("emip1459@gmail.com");
  const [password, setPassword] = React.useState("test123456");
  const [result, setResult] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);

  const testSignUp = async () => {
    setLoading(true);
    setResult("");
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        setResult(`Error: ${error.message}`);
      } else {
        setResult(`Success! User: ${data.user?.email}, Session: ${data.session ? 'Yes' : 'No'}`);
        console.log("SignUp result:", data);
      }
    } catch (err) {
      setResult(`Exception: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const testSignIn = async () => {
    setLoading(true);
    setResult("");
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        setResult(`Error: ${error.message}`);
      } else {
        setResult(`Success! User: ${data.user?.email}, Session: ${data.session ? 'Yes' : 'No'}`);
        console.log("SignIn result:", data);
      }
    } catch (err) {
      setResult(`Exception: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const checkCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setResult(`Current user: ${user ? user.email : 'None'}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-cyan-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Supabase Auth Test</h1>
        
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="p-3 border rounded-lg"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="p-3 border rounded-lg"
            />
          </div>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={testSignUp}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Test Sign Up
            </button>
            <button
              onClick={testSignIn}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              Test Sign In
            </button>
            <button
              onClick={checkCurrentUser}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
            >
              Check Current User
            </button>
          </div>
          
          {result && (
            <div className="bg-gray-100 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm">{result}</pre>
            </div>
          )}
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">Supabase Settings to Check:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Go to Supabase Dashboard → Authentication → Settings</li>
              <li>• Check "Enable email confirmations" - should be OFF for testing</li>
              <li>• Check "Site URL" - should be http://localhost:3001</li>
              <li>• Check "Redirect URLs" - should include http://localhost:3001/auth/callback</li>
              <li>• Check "Email provider" - should be enabled</li>
              <li>• Check "SMTP settings" if using custom email</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Environment Variables:</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p>NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
              <p>NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
              <p>SUPABASE_SERVICE_ROLE_KEY: {process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing'}</p>
              <p>DATABASE_URL: {process.env.DATABASE_URL ? '✅ Set' : '❌ Missing'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
