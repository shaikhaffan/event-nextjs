import mongoose, { Schema, Document } from 'mongoose';
export type EventData = {
  title: string;
  slug?: string;
  description?: string;
  date?: string | Date;
  time?: string;
  location?: string;
  venue?: string;
  category?: string;
  image?: string;
  price?: number;
  capacity?: number;
  attendees?: number;
  organizer?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  date: Date | string;
  time: string;
  location: string;
  venue?: string;
  category?: string;
  image?: string;
  price?: number;
  capacity?: number;
  attendees?: number;
  organizer?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Please provide event title'],
      trim: true,
      maxlength: 100,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide event description'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Please provide event date'],
    },
    time: {
      type: String,
      required: [true, 'Please provide event time'],
    },
    location: {
      type: String,
      required: [true, 'Please provide event location'],
    },
    venue: {
      type: String,
      required: [true, 'Please provide event venue'],
    },
    category: {
      type: String,
      required: [true, 'Please provide event category'],
    },
    image: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      default: 0,
    },
    capacity: {
      type: Number,
      required: [true, 'Please provide event capacity'],
    },
    attendees: {
      type: Number,
      default: 0,
    },
    organizer: {
      type: String,
      required: [true, 'Please provide organizer name'],
    },
  },
  { timestamps: true }
);

// Pre-save hook to generate slug from title
eventSchema.pre('save', function () {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
});

export default mongoose.models.Event || mongoose.model('Event', eventSchema);
