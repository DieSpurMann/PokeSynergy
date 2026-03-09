import { Schema, model } from 'mongoose';

const PokemonSchema = new Schema({
  pokedexnumber: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  type: [String],
  talent: [String],
  weight: { type: Number },
  stats: {
    hp: Number,
    attack: Number,
    defense: Number,
    specialattack: Number,
    specialdefense: Number,
    speed: Number
  },
  img: String,
  desc: String,
  family: { type: Number, default: null } //Pointe vers l'id de la pré-évolution
});

export const PokemonModel = model('Pokemon_temp', PokemonSchema);