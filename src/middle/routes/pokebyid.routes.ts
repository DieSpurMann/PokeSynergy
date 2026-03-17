import { Router } from 'express';
import { PokemonModel } from '../../back/pokemon'; // On ajuste le chemin d'import

const router = Router();

router.get('/pokemons/id/:id', async (req, res): Promise<void> => {
  try {
    const id = parseInt(req.params['id']);
    const pokemon = await PokemonModel.findOne({ pokedexnumber: id });
    if (!pokemon) {
      res.status(404).json({ error: "Pokémon non trouvé" });
      return;
    }
    res.json(pokemon);
  } catch (error) {
    console.error("Erreur lors de la récupération du Pokémon par ID:", error);
    res.status(500).json({ error: "Erreur serveur lors de la récupération du Pokémon" });
  }
});

export default router;