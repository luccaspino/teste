import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  rawgReviewId: { type: String, unique: true, sparse: true }, // Para reviews importadas da RAWG
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Para reviews locais
  game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  rawgGameId: { type: Number }, // Para reviews importadas da RAWG
  username: String, // Nome do usuário (RAWG ou local)
  text: String,
  created_at: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;