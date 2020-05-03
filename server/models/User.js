const { TOKEN_SIGNATURE } = require("../utils/config");
const bcrypt = require("bcrypt");
const Board = require("../models/Board");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const isEmail = require("validator/lib/isEmail");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      trim: true,
      minlength: 4,
    },
    fname: {
      type: String,
      required: true,
      trim: true,
      minlength: 4,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      trim: true,
      required: true,
      validate(value) {
        if (!isEmail(value)) throw new Error("Email is invalid");
      },
    },
    password: {
      type: String,
      trim: true,
      required: true,
      minlength: 7,
      validate(value) {
        if (value.toLowerCase().includes("password"))
          throw new Error(`Password should not include 'password'`);
      },
    },
    starred: {
      type: Array,
      required: true,
      default: [],
    },
    viewedRecent: {
      type: Array,
      required: true,
      default: [],
    },
    idBoards: {
      type: Array,
      required: true,
      default: [],
    },
    avatar: {
      type: Array,
      required: true,
      default: [],
    },
    bio: {
      type: String,
      trim: true,
      minlength: 4,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

UserSchema.virtual("boards", {
  ref: "Board",
  localField: "_id",
  foreignField: "owner",
});

UserSchema.virtual("comment", {
  ref: "Comment",
  localField: "_id",
  foreignField: "owner",
});

UserSchema.virtual("InvitedBoards", {
  ref: "Board",
  localField: "_id",
  foreignField: "creator",
});

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

UserSchema.methods.getAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    { _id: user._id.toString(), expiresIn: 3600 },
    TOKEN_SIGNATURE
  );
  user.tokens = user.tokens.concat({ token });
  user.username = user.email.split("@")[0];

  await user.save();
  return token;
};

UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) throw new Error("Login error: check your email or password.");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Login error: check your email or password.");
  return user;
};

UserSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password"))
    user.password = await bcrypt.hash(user.password, 8);

  next();
});

UserSchema.pre("remove", async function (next) {
  const user = this;
  await Board.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
