import { Schema, model, models } from 'mongoose';

const AnalysisSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Creates a relationship to the User model
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  resumeText: {
    type: String,
    required: true,
  },
  analysisResult: {
    type: Object, // We will store the JSON response from Gemini here
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Analysis = models.Analysis || model('Analysis', AnalysisSchema);

export default Analysis;
