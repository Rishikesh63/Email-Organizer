import React from 'react';

interface EmailCardProps {
  subject: string;
  sender: string;
  date: string;
  content: string;
  urgency: string;
  category?: string;
}

export const EmailCard: React.FC<EmailCardProps> = ({
  subject,
  sender,
  date,
  content,
  urgency,
}) => {
  // You can map urgency levels to different colors (for example)
  const urgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white shadow-md rounded-md p-6 mb-4">
      <h2 className="text-lg font-semibold mb-2">{subject}</h2>
      <p className="text-sm text-gray-500">From: {sender}</p>
      <p className="text-sm text-gray-500">Date: {date}</p>
      <p className={`font-bold mt-2 ${urgencyColor(urgency)}`}>
        Urgency: {urgency}
      </p>
      <p className="text-gray-700 mt-4">{content}</p>
    </div>
  );
};
