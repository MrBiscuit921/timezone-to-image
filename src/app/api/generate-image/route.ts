import { registerFont, createCanvas } from "canvas";
import path from "path";
import { NextResponse } from "next/server";

// Register the Geist font
const fontPath = path.resolve(process.cwd(), "public", "fonts", "Geist-VariableFont_wght.ttf");
console.log("Registering font:", fontPath);
registerFont(fontPath, { family: "Geist Thin" });


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const timezone = searchParams.get("timezone");

  if (!timezone) {
    return NextResponse.json({ error: "Timezone is required" }, { status: 400 });
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

    // Create a canvas object
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Fill background color
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Debug: List available fonts
    console.log("Setting font to Geist...");
    ctx.font = '24px "Geist Regular", sans-serif';
    console.log("Current font set:", ctx.font);

    // Set up text color
    ctx.fillStyle = textColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Render the text
    ctx.fillText(text, width / 2, height / 2);

    // Convert canvas to PNG buffer
    const buffer = canvas.toBuffer("image/png");

    // Return the image as a response
    return new NextResponse(buffer, {
      headers: { "Content-Type": "image/png" },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
