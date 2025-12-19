import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String, // Stores the URL or path to the image
      required: true,
    },
    // Optional: Link for the "Read More" button if it becomes functional later
    link: {
      type: String,
      default: "#",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
