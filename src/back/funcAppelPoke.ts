import axios from 'axios';
import { PokéDataStruct } from './pokéDataStruct';

export async function fetchPokemonData(url: string): Promise<PokéDataStruct> {
  try {
    const response = await axios.get(url);
    const data = response.data;

    // Transformation du tableau stats de l'API en objet structuré
    // L'ordre dans PokeAPI est : 0:hp, 1:atk, 2:def, 3:sp-atk, 4:sp-def, 5:speed
    const statsMapping = {
        hp: data.stats[0].base_stat,
        attack: data.stats[1].base_stat,
        defense: data.stats[2].base_stat,
        specialattack: data.stats[3].base_stat,
        specialdefense: data.stats[4].base_stat,
        speed: data.stats[5].base_stat,
    };

    return {
        pokedexnumber: data.id,
        name: data.name,
        weight: data.weight,
        stats: statsMapping,
        // On récupère tous les types, pas seulement les deux premiers
        type: data.types.map((t: any) => t.type.name),
        img: data.sprites.front_default || "",
        family: data.species.name,
        desc: "No description available",
        talent: data.abilities.map((a: any) => a.ability.name)
    };
  } catch (error) {
    throw new Error(`Erreur lors du fetch : ${error}`);
  }
}