import axios from 'axios';
import { PokéDataStruct } from './pokéDataStruct';

export async function fetchPokemonData(url: string): Promise<Partial<PokéDataStruct>> {
  try {
    const response = await axios.get(url);
    const data = response.data;
    return {
        pokedexnumber: data.id,
        name: data.name,
        weight: data.weight,
        stats: data.stats,
        type: data.types[1]? [data.types[0].type.name, data.types[1].type.name]: [data.types[0].type.name],
        img: data.sprites.front_default,
    };
  } catch (error) {
    throw new Error("Erreur lors de la récupération des données du Pokémon");
  }
}