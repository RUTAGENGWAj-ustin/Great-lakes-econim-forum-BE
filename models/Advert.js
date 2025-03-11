import { Schema, model } from "mongoose";

const advertSchema = new Schema(
  {
    image: {
      type: String, // URL or file path to the image
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    link: {
      type: String, // URL for the advertisement
      required: true,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

export default model("Advert", advertSchema);