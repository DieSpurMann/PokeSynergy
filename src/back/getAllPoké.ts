import * as dotenv from 'dotenv';
import { connectToDatabase, disconnectFromDatabase } from './database';
import { PokéDataStruct } from './pokéDataStruct';
import { PokemonModel } from './pokemon';

dotenv.config({ path: 'utils.conf' });

export const url: string = process.env['DBLINK'] ? process.env['DBLINK'] : '';

export async function getPokemon() {
    await connectToDatabase(url);
    const allPokemon: PokéDataStruct[] = await PokemonModel.find();
    await disconnectFromDatabase();
    return allPokemon;
}