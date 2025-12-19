import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    designation: {
      type: String,
      required: true, // e.g., "CEO", "Web Developer"
      trim: true,
    },
    description: {
      type: String,
      required: true, // Client testimonial or details
    },
    image: {
      type: String, // Stores the URL or path to the client's image
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Client", clientSchema);
