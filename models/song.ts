import mongoose from "mongoose";

const SongSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    url: {
      type: String,
      required: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    size: {
      type: Number,
      required: true,
    },
     objectName: { 
      type: String,
       required: true 
      },
  },
  {
    timestamps: true, // ✅ adds createdAt & updatedAt automatically
  }
);

export const Song =
  mongoose.models.Song || mongoose.model("Song", SongSchema);
