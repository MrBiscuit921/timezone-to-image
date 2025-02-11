import { createCanvas } from 'canvas';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const timezone = searchParams.get('timezone');

  if (!timezone) {
    return NextResponse.json({ error: 'Timezone is required' }, { status: 400 });
  }

  try {
    const currentTime = new Date().toLocaleString('en-US', { timeZone: timezone });

    const width = 600;
    const height = 200;
    const bgColor = '#1a202c';
    const textColor = '#ffffff';
    const text = `Current time: ${currentTime}`;

    // Create a canvas object
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Fill background color
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Set up the font
    let fontSize = 24;
    if (text.length > 50) fontSize = 20;
    if (text.length > 80) fontSize = 16;
    
    ctx.font = `${fontSize}px Arial`;  // Use Arial font
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Render the text
    ctx.fillText(text, width / 2, height / 2);

    // Convert canvas to PNG buffer
    const buffer = canvas.toBuffer('image/png');

    // Return the image as a response
    return new NextResponse(buffer, {
      headers: { 'Content-Type': 'image/png' },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}