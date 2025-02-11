import sharp from "sharp";
import {NextResponse} from "next/server";

export async function GET(req: Request) {
  const {searchParams} = new URL(req.url);
  const timezone = searchParams.get("timezone");

  if (!timezone) {
    return NextResponse.json({error: "Timezone is required"}, {status: 400});
  }

  try {
    const currentTime = new Date().toLocaleString("en-US", {
      timeZone: timezone,
    });

    const width = 600;
    const height = 200;
    const bgColor = "#1a202c";
    const text = `Current time: ${currentTime}`;

    // Calculate text width and adjust font size
    let fontSize = 24;
    if (text.length > 50) fontSize = 20;
    if (text.length > 80) fontSize = 16;

    const svgContent = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect width="100%" height="100%" fill="#1a202c" />
    <text x="50%" y="50%" font-size="${fontSize}" text-anchor="middle" fill="$#ffffff" dominant-baseline="middle" font-family="Arial, Helvetica, sans-serif">
      ${text}
    </text>
  </svg>
`;

    const image = await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: bgColor,
      },
    })
      .composite([
        {
          input: Buffer.from(svgContent),
          top: 0,
          left: 0,
        },
      ])
      .png()
      .toBuffer();

    return new NextResponse(image, {
      headers: {
        "Content-Type": "image/png",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {error: "Failed to generate image"},
      {status: 500}
    );
  }
}
