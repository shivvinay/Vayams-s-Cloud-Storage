import { connectDB } from "@/lib/mongo";
import { Song } from "@/models/song";


export async function GET() {
  await connectDB();

  const songs = await Song.find().sort({ createdAt: -1 });

  return Response.json({ songs });
}


export async function POST(req: Request) {
  await connectDB();

  const { name, url, mimeType, size, objectName } = await req.json();

  if (!name || !url || !mimeType || !size || !objectName) {
    return Response.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  const song = await Song.create({
    name,
    url,
    mimeType,
    size,
    objectName,
  });

  return Response.json({
    message: "Song created successfully",
    song,
  });
}
