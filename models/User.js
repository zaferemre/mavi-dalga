import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Should be hashed in real apps
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
