import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

const parser = new Parser();

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const rssUrl = searchParams.get('url') || 'https://finance.yahoo.com/rss/topstories';

    try {
        const feed = await parser.parseURL(rssUrl);
        return NextResponse.json({ items: feed.items });
    } catch (error: any) {
        console.error('Error fetching RSS feed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
