import mongoose, { Schema, Document } from 'mongoose';
import Event from './event';

export interface IBooking extends Document {
  eventId: mongoose.Types.ObjectId;
  userEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// Ensure referenced event exists and is not in the past before saving
bookingSchema.pre<IBooking>('save', async function () {
  // Only validate on new documents or when eventId changes
  if (!this.isNew && !this.isModified('eventId')) return;

  const event = await Event.findById(this.eventId).exec();
  if (!event) {
    throw new Error('Referenced event does not exist.');
  }

  // If event has a date, ensure it's not in the past
  if (event.date && event.date < new Date()) {
    throw new Error('Cannot create booking for an event in the past');
  }
});

export default mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
