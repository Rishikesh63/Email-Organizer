import { NextResponse } from 'next/server';

// Mock email categorization function
const categorizeEmail = (emailContent: string) => {
  const categorizedEmails: any[] = [];

  // Example categorization logic (replace with your own)
  const subjectMatch = emailContent.match(/Subject:\s*(.*)/);
  const fromMatch = emailContent.match(/From:\s*(.*)/);
  const emailMatch = emailContent.match(/Email:\s*(.*)/);
  const contentMatch = emailContent.match(/Dear\s*\[.*?\](.*?)Best regards,/s);

  if (subjectMatch) {
    const emailDetail = {
      subject: subjectMatch[1].trim(),
      urgency: 'Normal', // Set a default urgency or categorize based on logic
      content: contentMatch ? contentMatch[1].trim() : 'No content available',
      sender: fromMatch ? fromMatch[1].trim() : 'Unknown Sender',
      date: new Date().toISOString(), // Use the current date as a placeholder
      category: 'Promotions', // Example category; modify based on your logic
    };
    
    categorizedEmails.push(emailDetail);
  }

  return categorizedEmails;
};

// API endpoint for categorizing emails using POST method in Next.js
export async function POST(request: Request) {
  try {
    const { emailContent } = await request.json();

    if (!emailContent) {
      return NextResponse.json({ error: 'Email content is required.' }, { status: 400 });
    }

    const categorizedData = categorizeEmail(emailContent);

    if (categorizedData.length > 0) {
      return NextResponse.json({ categorizedData }, { status: 200 });
    } else {
      return NextResponse.json({ category: 'Uncategorized' }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to categorize email.' }, { status: 500 });
  }
}
