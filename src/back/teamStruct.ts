// Dans un nouveau fichier back/team.ts ou similaire
import { Schema, model, Document, Types } from 'mongoose';

export interface ITeam extends Document {
  user: Types.ObjectId;
  name: string;
  date: number;
  pokemons: Types.ObjectId[];
}

const TeamSchema = new Schema<ITeam>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
  
  name: { type: String, required: true },
  date: { type: Number, default: () => Date.now() }, 

  pokemons: [{type: Schema.Types.ObjectId, ref: 'Pokemon'}]
});

export const TeamModel = model<ITeam>('Team', TeamSchema);