import { Schema, model } from 'mongoose';

const contactSchema = new Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, match: /.+\@.+\..+/ },
    isFavourite: { type: Boolean, default: false },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      required: true,
      default: 'personal',
    },
    userId: { type: Schema.ObjectId, required: true },
    photo: { type: String },
  },
  {
    timestamps: true,
  },
);

export const Contact = model('contacts', contactSchema);
