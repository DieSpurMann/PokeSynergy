import axios from 'axios';
import { PokéDataStruct } from './pokéDataStruct';

// Fonction récursive qui cherche le Pokémon précédent dans la chaîne d'évolution
function findPredecessor(currentStep: any, targetName: string): string | null {
    // Si l'étape actuelle n'existe pas ou n'a pas d'évolutions suivantes, on arrête
    if (!currentStep || !currentStep.evolves_to) return null;

    // On parcourt toutes les évolutions possibles à partir de cette étape
    for (const evolution of currentStep.evolves_to) {

        // Si le nom recherché correspond à l'évolution actuelle (ou inversement),
        // alors l'espèce actuelle est la pré-évolution
        if (targetName.includes(evolution.species.name) || evolution.species.name.includes(targetName)) {
            return currentStep.species.name;
        }

        // Sinon on continue la recherche récursivement dans les évolutions suivantes
        const found = findPredecessor(evolution, targetName);
        if (found) return found;
    }

    // Si rien n'est trouvé dans cette branche
    return null;
}

export async function fetchPokemonData(url: string): Promise<PokéDataStruct> {
    try {
        // Récupération des données principales du Pokémon
        const response = await axios.get(url);
        const data = response.data;

        // Récupération des données d'espèce (description, chaîne d'évolution, etc.)
        const speciesResponse = await axios.get(data.species.url);
        const speciesData = speciesResponse.data;

        // Liste des suffixes indiquant des formes spéciales (Mega, Gmax, formes météo, etc.)
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

        // Liste des suffixes de formes régionales
        const regionalSuffixes = ['-alola', '-galar', '-hisui', '-paldea', '-white-striped'];

        // Détermine si le Pokémon est une forme spéciale
        const isSpecialVariant = specialSuffixes.some(suffix => data.name.includes(suffix));
        
        // Variable qui contiendra l'ID de la pré-évolution
        let preEvolutionId: number | null = null;

        // Si ce n'est PAS une forme spéciale et qu'une chaîne d'évolution existe
        if (!isSpecialVariant && speciesData.evolution_chain) {

            // Récupération de la chaîne d'évolution complète
            const evoChainResponse = await axios.get(speciesData.evolution_chain.url);
            const chain = evoChainResponse.data.chain;

            // Recherche du parent dans la chaîne
            const parentName = findPredecessor(chain, data.name);

            if (parentName) {
                // Recherche d'un suffixe régional correspondant
                let suffixToTest = regionalSuffixes.find(s => data.name.includes(s)) || '';
                
                // Cas particuliers de Pokémon évoluant uniquement dans la forme de Galar
                if (['obstagoon', 'perrserker', 'sirfetchd', 'mr-rime', 'cursola', 'runerigus'].includes(data.name)) suffixToTest = '-galar';

                try {
                    // On tente d'abord de récupérer la pré-évolution avec la forme régionale
                    const regPreEvo = await axios.get(`https://pokeapi.co/api/v2/pokemon/${parentName}${suffixToTest}`);
                    preEvolutionId = regPreEvo.data.id;
                } catch {
                    try {
                        // Sinon on essaie la forme de base
                        const basePreEvo = await axios.get(`https://pokeapi.co/api/v2/pokemon/${parentName}`);
                        preEvolutionId = basePreEvo.data.id;
                    } catch { 
                        // Si tout échoue, pas de pré-évolution trouvée
                        preEvolutionId = null; 
                    }
                }
            }
        }

        // Cas spécial pour Basculegion (forme mâle/femelle gérée différemment dans l'API)
        if (data.name.includes('basculegion')) {
            preEvolutionId = 10247; 
        }

        // Gestion des formes spéciales
        else if (isSpecialVariant) {

            // Si l'ID diffère de celui de l'espèce, on utilise l'espèce comme base
            if (data.id !== speciesData.id) {
                preEvolutionId = speciesData.id;
            }

            // Sinon on récupère la pré-évolution depuis les données d'espèce
            else if (speciesData.evolves_from_species) {
                const urlParts = speciesData.evolves_from_species.url.split('/');
                preEvolutionId = parseInt(urlParts[urlParts.length - 2]);
            }
        }

        // Mapping des statistiques du Pokémon
        const statsMapping = {
            hp: data.stats[0].base_stat,
            attack: data.stats[1].base_stat,
            defense: data.stats[2].base_stat,
            specialattack: data.stats[3].base_stat,
            specialdefense: data.stats[4].base_stat,
            speed: data.stats[5].base_stat,
        };

        // Recherche de la description française dans les entrées de texte
        const frenchDesc = speciesData.flavor_text_entries.find((e: any) => e.language.name === 'fr');

        // Construction de l'objet final correspondant à la structure PokéDataStruct
        return {
            pokedexnumber: data.id,
            name: data.name,
            family: preEvolutionId,
            weight: data.weight,
            stats: statsMapping,
            type: data.types.map((t: any) => t.type.name), // Liste des types
            desc: frenchDesc ? frenchDesc.flavor_text.replace(/[\n\f]/g, ' ') : "Pas de description", // Nettoyage des retours ligne
            talent: data.abilities.map((a: any) => a.ability.name), // Capacités spéciales
            img: data.sprites.front_default || "" // Image du sprite principal
        };

    } catch (error) {
        // Affiche une erreur si la récupération des données échoue
        console.error(`Erreur fetch : ${url}`);
        throw error;
    }
}