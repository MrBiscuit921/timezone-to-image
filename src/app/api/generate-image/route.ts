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
    const textColor = "#ffffff";
    const text = `Current time: ${currentTime}`;

    // Set font size based on text length
    let fontSize = 24;
    if (text.length > 50) fontSize = 20;
    if (text.length > 80) fontSize = 16;

    // Create a PNG with a background
    const image = await sharp({
      create: {
        width,
        height,
        channels: 4, // RGBA (red, green, blue, alpha for transparency)
        background: bgColor,
      },
    })
      .png()
      .composite([
        {
          input: Buffer.from(
            `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
              <text x="50%" y="50%" font-size="${fontSize}" text-anchor="middle" fill="${textColor}" dominant-baseline="middle" font-family="Arial, Helvetica, sans-serif">
                ${text}
              </text>
            </svg>`
          ),
          top: 0,
          left: 0,
        },
      ])
      .toBuffer();

    return new NextResponse(image, {
      headers: {
        "Content-Type": "image/png",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({error: "Failed to generate image"}, {status: 500});
  }
}
