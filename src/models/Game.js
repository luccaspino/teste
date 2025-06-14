import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  genre: String,
  releaseDate: Date,
  rawgId: { type: Number, unique: true }, // ID da RAWG
  background_image: String,
  rating: Number,
  ratings_count: Number
});

const Game = mongoose.model('Game', gameSchema);
export default Game;