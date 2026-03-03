import { Schema, model } from 'mongoose';

const PokemonSchema = new Schema({
  pokedexnumber: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  weight: { type: Number },
  stats: {
    hp: Number,
    attack: Number,
    defense: Number,
    specialattack: Number,
    specialdefense: Number,
    speed: Number
  },
  type: [String],
  img: String,
  family: String,
  desc: String,
  talent: [String]
});

export const PokemonModel = model('Pokemon_temp', PokemonSchema);