import axios from 'axios';
import { PokéDataStruct } from './pokéDataStruct';
import { fetchPokemonData } from './funcAppelPoke';
import { connectToDatabase, disconnectFromDatabase, url } from './database';
import { PokemonModel } from './pokemon';
import { disconnect } from 'node:cluster';

const apiUrl: string = 'https://pokeapi.co/api/v2/pokemon?limit=1000000&offset=0'; // Commençons par 100 pour tester

async function start() {
  try {
    await connectToDatabase(url);
    const response = await axios.get(apiUrl);
    const rawData = response.data.results;
    const listUrls: string[] = rawData.map((pokemon: { url: string }) => pokemon.url);
    const listsOfPokemons: Partial<PokéDataStruct>[] = [];

    // On utilise for...of pour attendre chaque réponse
    for (const url of listUrls) {
      try {
        const pokemonData = await fetchPokemonData(url);
        console.log(`Récupéré : ${pokemonData}`);
        listsOfPokemons.push(pokemonData);
      } catch (err) {
        console.error(`Erreur sur ${url}`);
      }
    }
    const docs = await PokemonModel.insertMany(listsOfPokemons, { ordered: false });
    disconnectFromDatabase();
    console.log(`Terminé ! ${listsOfPokemons.length} Pokémon chargés.`);
  } catch (error) {
    console.error("Erreur lors du fetch initial:", error);
  }
}

start();