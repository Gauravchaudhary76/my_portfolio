import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  recruiterName: string;
  companyEmail: string;
  messageBody: string;
  timestamp: Date;
}

const MessageSchema = new Schema<IMessage>({
  recruiterName: { type: String, required: true },
  companyEmail: { type: String, required: true },
  messageBody: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
}, {
  bufferCommands: false // Disable buffering so it fails fast instead of hanging on serverless
});

// Avoid overwriting model compiled previously
export const MessageModel = mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);
