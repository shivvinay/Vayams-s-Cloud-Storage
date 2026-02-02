import { s3 } from "@/lib/minio";
import { connectDB } from "@/lib/mongo";
import { Song } from "@/models/song";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const file = await Song.findById((await params).id);

    if (!file) {
      return NextResponse.json(
        { message: "File not found" },
        { status: 404 }
      );
    }

    if (!file.objectName) {
      return NextResponse.json(
        { message: "objectName missing for this file" },
        { status: 400 }
      );
    }

    // 🔥 Delete from MinIO
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.MINIO_BUCKET!,
        Key: file.objectName,
      })
    );

    // 🔥 Delete from MongoDB
    await Song.findByIdAndDelete((await params).id);

    return NextResponse.json(
      { message: "File deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
