import { useState, useEffect } from "react";
import { useCopilotReadable } from "@copilotkit/react-core";

// Interface for Email
interface Email {
  subject: string;
  category: string;
}

// Custom hook to fetch categorized emails
const useCategorizedEmails = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState<string | null>(null);  // Error state

  useEffect(() => {
    async function fetchEmails() {
      try {
        setLoading(true);  // Start loading
        const response = await fetch("/api/categorize-email", {
          method: "POST",
          body: JSON.stringify({
            emailContent: "Some sample email content", // Replace with actual data
          }),
          headers: {
            "Content-Type": "application/json", // Ensure the correct content type
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch emails: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched Categorized Data:", data); // Log the fetched data

        setEmails(data.categorizedData || []); // Set state with categorized data
        setError(null);  // Clear any previous errors
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);  // Capture any errors with a message
        } else {
          setError(String(error));  // Handle non-Error types
        }
        console.error("Error fetching emails:", error); // Log any errors
      } finally {
        setLoading(false);  // Stop loading
      }
    }

    fetchEmails();
  }, []);

  return { emails, loading, error };
};

// Component to display categorized emails
export function EmailContextComponent() {
  const { emails, loading, error } = useCategorizedEmails();

  // Define Copilot readable state
  useCopilotReadable({
    description: "Categorized emails for the current user",
    value: emails,
  });

  // Log the emails when they change
  useEffect(() => {
    console.log("Current Emails:", emails);
  }, [emails]);

  return (
    <div>
      <h2>Categorized Emails</h2>

      {/* Handle Loading State */}
      {loading ? (
        <p>Loading emails...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p> // Display error if present
      ) : emails.length > 0 ? (
        <ul>
          {emails.map((email, index) => (
            <li key={index}>
              {email.subject} - {email.category}
            </li>
          ))}
        </ul>
      ) : (
        <p>No categorized emails available.</p>
      )}
    </div>
  );
}
