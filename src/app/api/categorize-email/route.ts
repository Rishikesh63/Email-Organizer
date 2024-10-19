import { NextResponse } from 'next/server';
import { CategorizedEmail } from '@/types/emailTypes'; // Importing the type

// Mock email categorization function
const categorizeEmail = (emailContent: string): CategorizedEmail[] => {
  const categorizedEmails: CategorizedEmail[] = [];

  const subjectMatch = emailContent.match(/Subject:\s*(.*)/);
  const fromMatch = emailContent.match(/From:\s*(.*)/);
  const contentMatch = emailContent.match(/Dear\s*\[.*?\](.*?)Best regards,/);

  if (subjectMatch) {
    const emailDetail: CategorizedEmail = {
      subject: subjectMatch[1].trim(),
      urgency: 'Normal',
      content: contentMatch ? contentMatch[1].trim() : 'No content available',
      sender: fromMatch ? fromMatch[1].trim() : 'Unknown Sender',
      date: new Date().toISOString(),
      category: 'Promotions',
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
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to categorize email.' }, { status: 500 });
    console.log('Error categorizing email:', _error);
  }
}
