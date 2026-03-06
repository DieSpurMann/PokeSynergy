import axios from 'axios';
import { PokéDataStruct } from './pokéDataStruct';

// Gardons findPredecessor pour les 1000 autres Pokémon standards
function findPredecessor(currentStep: any, targetName: string): string | null {
    if (!currentStep || !currentStep.evolves_to) return null;
    for (const evolution of currentStep.evolves_to) {
        if (targetName.includes(evolution.species.name) || evolution.species.name.includes(targetName)) {
            return currentStep.species.name;
        }
        const found = findPredecessor(evolution, targetName);
        if (found) return found;
    }
    return null;
}

export async function fetchPokemonData(url: string): Promise<PokéDataStruct> {
    try {
        const response = await axios.get(url);
        const data = response.data;
        const speciesResponse = await axios.get(data.species.url);
        const speciesData = speciesResponse.data;

        const specialSuffixes = [
            '-mega', '-gmax', '-totem', '-partner', '-starter', '-cap', '-primal',
            '-eternamax', '-crowned', '-origin', '-therian', '-mode', '-build',
            '-white', '-black', '-rock-star', '-belle', '-pop-star', '-phd',
            '-libre', '-cosplay', '-unbound', '-sky', '-heat', '-wash', '-frost',
            '-fan', '-mow', '-sunny', '-rainy', '-snowy', '-pirouette', '-resolute',
            '-ash', '-power-construct', '-complete', '-school', 'mimikyu-busted',
            '-original', '-dusk', '-dawn', '-ultra', '-gulping', '-gorging',
            '-noice', '-hangry', '-breed', '-mask', '-terastal', '-stellar', 
            '-male', '-female', '-small', '-average', '-large', '-super'
        ];

        const regionalSuffixes = ['-alola', '-galar', '-hisui', '-paldea', '-white-striped'];
        const isSpecialVariant = specialSuffixes.some(suffix => data.name.includes(suffix));
        
        let preEvolutionId: number | null = null;

        // --- 1. LOGIQUE DE GÉNÉALOGIE CLASSIQUE ---
        if (!isSpecialVariant && speciesData.evolution_chain) {
            const evoChainResponse = await axios.get(speciesData.evolution_chain.url);
            const chain = evoChainResponse.data.chain;
            const parentName = findPredecessor(chain, data.name);

            if (parentName) {
                let suffixToTest = regionalSuffixes.find(s => data.name.includes(s)) || '';
                
                // On garde les forcages de suffixes pour Obstagoon & co
                if (['obstagoon', 'perrserker', 'sirfetchd', 'mr-rime', 'cursola', 'runerigus'].includes(data.name)) suffixToTest = '-galar';
                if (['sneasler', 'overqwil', 'kleavor', 'ursaluna'].includes(data.name)) suffixToTest = '-hisui';

                try {
                    const regPreEvo = await axios.get(`https://pokeapi.co/api/v2/pokemon/${parentName}${suffixToTest}`);
                    preEvolutionId = regPreEvo.data.id;
                } catch {
                    try {
                        const basePreEvo = await axios.get(`https://pokeapi.co/api/v2/pokemon/${parentName}`);
                        preEvolutionId = basePreEvo.data.id;
                    } catch { preEvolutionId = null; }
                }
            }
        }

        // --- 2. SECTION "BRUTE FORCE" (Correctifs manuels prioritaires) ---
        // Basculin White-Striped est l'ID 10222 dans l'API officielle.
        // On force le lien pour n'importe quelle forme de Basculegion
        if (data.name.includes('basculegion')) {
            preEvolutionId = 10247; 
        }

        // --- 3. MAPPING FINAL ---
        const statsMapping = {
            hp: data.stats[0].base_stat,
            attack: data.stats[1].base_stat,
            defense: data.stats[2].base_stat,
            specialattack: data.stats[3].base_stat,
            specialdefense: data.stats[4].base_stat,
            speed: data.stats[5].base_stat,
        };

        const frenchDesc = speciesData.flavor_text_entries.find((e: any) => e.language.name === 'fr');

        return {
            pokedexnumber: data.id,
            name: data.name,
            family: preEvolutionId,
            weight: data.weight,
            stats: statsMapping,
            type: data.types.map((t: any) => t.type.name),
            desc: frenchDesc ? frenchDesc.flavor_text.replace(/[\n\f]/g, ' ') : "Pas de description",
            talent: data.abilities.map((a: any) => a.ability.name),
            img: data.sprites.front_default || ""
        };

    } catch (error) {
        console.error(`Erreur fetch : ${url}`);
        throw error;
    }
}