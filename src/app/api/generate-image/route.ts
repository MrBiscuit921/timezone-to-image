import sharp from "sharp";
import { Geist } from "next/font/google";
import { NextResponse } from "next/server";

// Load the fonts with variables for CSS custom properties
const geistSans = Geist({
  variable: "--font-geist-sans",  // Custom CSS variable for Geist font
  subsets: ["latin"],  // Specify which subsets of the font to include
});

export async function GET(req: Request) {
  const {searchParams} = new URL(req.url); // Access the search parameters from the URL
  const timezone = searchParams.get("timezone"); // Get the timezone query parameter

  if (!timezone) {
    return NextResponse.json({error: "Timezone is required"}, {status: 400});
  }

  try {
    const currentTime = new Date().toLocaleString("en-US", {
      timeZone: timezone,
    });

    // Set up the base image size and background color
    const width = 600;
    const height = 200;
    const bgColor = "#1a202c"; // Tailwind's bg-dark color
    const textColor = "#ffffff"; // White text
    const text = `Current time: ${currentTime}`;

    // Calculate text width and adjust font size accordingly
    let fontSize = 24;
    if (text.length > 50) fontSize = 20; // Reduce font size if text is too long
    if (text.length > 80) fontSize = 16; // Further reduce if even longer

    console.log("Generated SVG:", `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <text x="50%" y="50%" font-size="${fontSize}" text-anchor="middle" fill="${textColor}" dominant-baseline="middle" font-family="${geistSans.variable}">
          ${text}
        </text>
      </svg>
    `);
    // Generate the image using sharp
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
          input: Buffer.from(
            `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
              <rect width="100%" height="100%" fill="${bgColor}" />
                <text x="50%" y="50%" font-size="${fontSize}" text-anchor="middle" fill="${textColor}" dominant-baseline="middle" font-family="${geistSans.variable}">
                  ${text}
                </text>
            </svg>`
          ),
          top: 0,
          left: 0,
        },
      ])
      .png()
      .toBuffer();

    // Send the image in the response
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
