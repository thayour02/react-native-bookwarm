import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs";

const authSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  profileImage: { type: String, default: "" },
}, { timestamps: true }
);

// hash password before sending to db
authSchema.pre("save", async function (next) {
  // important if you update the username
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// compare password for login
authSchema.methods.comparePassword = async function(userPassword) {
  return await bcrypt.compare(userPassword, this.password)
}

// token function
export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1hr" });
};


const Auth = mongoose.model("Auth", authSchema);

export default Auth;
