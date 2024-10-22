import { NextResponse } from 'next/server';
import { CategorizedEmail } from '@/types/emailTypes'; // Importing the type

// Improved email categorization function with urgency detection
const categorizeEmail = (emailContent: string): CategorizedEmail[] => {
  const categorizedEmails: CategorizedEmail[] = [];

  const subjectMatch = emailContent.match(/Subject:\s*(.*)/);
  const fromMatch = emailContent.match(/From:\s*(.*)/);
  const contentMatch = emailContent.match(/(?:Dear|Hi|Hello|Respected)[\s\S]*?,([\s\S]*?)(?=\s*(Best regards|Sincerely|Regards|Thanks|Yours truly|Cheers|Warm regards))/i);







  // Define urgency keywords
  const urgencyKeywords = ['ASAP', 'urgent', 'deadline', 'immediately', 'priority'];
  
  let urgency = 'Normal'; // Default urgency level

  // Check for urgency keywords in the email content
  if (urgencyKeywords.some(keyword => emailContent.toLowerCase().includes(keyword.toLowerCase()))) {
    urgency = 'High';
  }

  if (subjectMatch) {
    const emailDetail: CategorizedEmail = {
      subject: subjectMatch[1].trim(),
      urgency: urgency, // Assign urgency based on detected keywords
      content: contentMatch ? contentMatch[1].trim() : 'No content available',
      sender: fromMatch ? fromMatch[1].trim() : 'Unknown Sender',
      date: new Date().toISOString(),
      category: 'General', // Default category
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
    console.log('Error categorizing email:', error);
    return NextResponse.json({ error: 'Failed to categorize email.' }, { status: 500 });
  }
}
