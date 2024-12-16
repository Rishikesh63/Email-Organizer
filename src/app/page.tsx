'use client';
import Image from 'next/image';
import logo from '../image/image.png';
import background from '../image/email-background.jpg';

import { useState } from 'react';
import { EmailCard } from '@/components/EmailCard';
import { CategorizedEmail } from '@/types/emailTypes'; // Import the type

export default function Home() {
  // Properly typing the emails state
  const [emails, setEmails] = useState<CategorizedEmail[]>([]);
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

      if (Array.isArray(data.categorizedData)) {
        setEmails(data.categorizedData); // Set state with the fetched emails
        setCategorized(true);
      } else {
        setEmails([]); // Clear the state if no valid data is received
        setError('No emails were categorized.');
      }
    } catch (err: unknown) {
      setError('Failed to categorize emails.');
      console.error('Error categorizing emails:', err); // Handle error logging
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
    {/* Background Image */}
    <Image
      src={background}
      alt="Background"
      layout="fill"
      objectFit="cover"
      quality={100}
      className="-z-10" // Sends the image to the background
    />
      <main className="max-w-3xl mx-auto bg-white p-8 rounded shadow">
      <Image 
    src={logo} 
    alt="Email Organizer Logo" 
    width={80} 
    height={80} 
    className="mx-auto mb-4" 
  />
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
                  subject={email.subject}
                  urgency={email.urgency}
                  content={email.content}
                  sender={email.sender}
                  date={email.date}
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
