import mongoose, { Schema, Document, Model } from 'mongoose';

interface EventAttributes {
  id?: string;
  title: string;
  date: string; 
  time: string; 
  description: string;
  duration: number; 
  userId: string; 
  createdAt?: Date;
  updatedAt?: Date;
}

interface EventDocument extends Document {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  duration: number;
  userId: string; 
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema<EventDocument>(
  {
    id: {
      type: String,
      default: () => require('crypto').randomBytes(4).toString('hex'),
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    userId: { 
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Event: Model<EventDocument> =
  mongoose.models.Event || mongoose.model<EventDocument>('Event', EventSchema);

export default Event;
