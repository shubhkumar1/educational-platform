import mongoose from 'mongoose';

const quizAttemptSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true },
  answers: [{
    questionIndex: Number,
    selectedAnswerIndex: Number,
  }],
  completedAt: { type: Date, default: Date.now },
});

const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);
export default QuizAttempt;