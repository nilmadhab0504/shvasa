import mongoose, { Schema, Document, Model } from 'mongoose';

interface UserAttributes {
  id?: string;
  name: string;
  email: string;
  password: string;
  featureFlag?: boolean;
  googleCalendarToken?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserDocument extends Document {
  id: string;
  name: string;
  email: string;
  password: string;
  featureFlag: boolean;
  googleCalendarToken: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema<UserDocument>(
  {
    id: {
      type: String,
      default: () => require('crypto').randomBytes(4).toString('hex'),
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    featureFlag: {
      type: Boolean,
      default: false,
    },
    googleCalendarToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, 
  }
);

const User: Model<UserDocument> =
  mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema);

export default User;
