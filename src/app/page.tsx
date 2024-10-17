'use client';

import { useState } from 'react';
import { EmailCard } from '@/components/EmailCard';

export default function Home() {
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState<string>('');
  const [categorized, setCategorized] = useState<boolean>(false);

  const handleCategorize = async () => {
    if (!emailInput.trim()) {
      setError('Please enter email content.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/categorize-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailContent: emailInput }),
      });

      if (!res.ok) {
        throw new Error('Error fetching categorized emails');
      }

      const data = await res.json();
      console.log('API Response:', data); // Log response for debugging

      // Check if the response contains the categorizedData field and is an array
      if (Array.isArray(data.categorizedData)) {
        setEmails(data.categorizedData);
        setCategorized(true);
      } else {
        setEmails([]); // Handle case where there's no valid categorized data
        setError('No emails were categorized.');
      }
    } catch (err) {
      setError('Failed to categorize emails.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <main className="max-w-3xl mx-auto bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">Email Organizer</h1>

        <div className="mb-6">
          <textarea
            className="w-full p-3 border border-gray-300 rounded"
            rows={5}
            placeholder="Paste your email content here..."
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
          ></textarea>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        <button
          className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition"
          onClick={handleCategorize}
          disabled={loading}
        >
          {loading ? 'Categorizing...' : 'Categorize Emails'}
        </button>

        {categorized && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Categorized Emails</h2>
            {emails.length > 0 ? (
              emails.map((email, index) => (
                <EmailCard
                  key={index}
                  subject={email.subject}   // Adjust to match actual API response
                  urgency={email.urgency}   // Adjust to match actual API response
                  content={email.content}   // Adjust to match actual API response
                  sender={email.sender}     // Adjust to match actual API response
                  date={email.date}         // Adjust to match actual API response
                />
              ))
            ) : (
              <p>No emails found.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
