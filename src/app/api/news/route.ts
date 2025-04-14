import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || 'default query';
  const aiPrompt = searchParams.get('aiPrompt') || 'Summarize the following news articles.';
  const searxngUrl = searchParams.get('searxngUrl') || process.env.SEARXNG_URL || 'https://searx.example.com'; // Replace with your default SearxNG URL

  try {
    // Fetch news from SearxNG
    const response = await fetch(`${searxngUrl}?q=${query}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Apply AI prompts (implementation depends on your AI setup)
    const aiProcessedResults = await applyAIPrompt(data.results, aiPrompt);

    // Save results to local JSON file
    const filename = `${Date.now()}-${query.replace(/[^a-zA-Z0-9]/g, '-')}.json`;
    const filepath = path.join(process.cwd(), 'news-data', filename);

    // Ensure the news-data directory exists
    const dir = path.join(process.cwd(), 'news-data');
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filepath, JSON.stringify(aiProcessedResults, null, 2));

    return NextResponse.json({
      message: 'News fetched and processed successfully!',
      filename: filename,
    });
  } catch (error: any) {
    console.error('Error fetching and processing news:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function applyAIPrompt(results: any[], aiPrompt: string): Promise<any[]> {
  // TODO: Implement AI prompt processing logic here
  // This is a placeholder function
  console.log('Applying AI prompt:', aiPrompt);
  return results.map(result => ({
    ...result,
    aiSummary: `AI Summary: ${aiPrompt} - This is a placeholder.`,
  }));
}

