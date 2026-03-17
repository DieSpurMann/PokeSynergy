import { Router } from 'express';
import { PokemonModel } from '../../back/pokemon'; // On ajuste le chemin d'import

const router = Router();

/**
 * @swagger
 * /api/pokemons/evolution-chain/{id}:
 *   get:
 *     summary: Get the complete evolution chain for a Pokémon
 *     description: Retrieves the full evolution chain starting from the root Pokémon (no pre-evolution) that the given Pokémon belongs to, including all descendants.
 *     tags:
 *       - Pokémon
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The Pokedex number of the Pokémon
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved the evolution chain
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   pokedexnumber:
 *                     type: integer
 *                     example: 1
 *                   family:
 *                     type: integer
 *                     example: null
 *       404:
 *         description: Pokémon not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Pokémon non trouvé"
 *       500:
 *         description: Server error calculating the evolution chain
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur lors du calcul de la lignée"
 */
router.get('/pokemons/evolution-chain/:id', async (req, res): Promise<void> => {
  try {
    const startId = parseInt(req.params['id']);
    console.log("HelloWorld");
    
    // 1. Remonter à la racine (le Pokémon qui n'a pas de pré-évo)
    let current = await PokemonModel.findOne({ pokedexnumber: startId });
    if (!current) {
      res.status(404).json({ error: "Pokémon non trouvé" });
      return;
    }

    let root = current;
    while (root.family) {
      const parent = await PokemonModel.findOne({ pokedexnumber: root.family });
      if (!parent) break;
      root = parent;
    }

    // 2. Récupérer tous les descendants de cette racine
    // On cherche tous les Pokémon qui appartiennent à cette lignée
    // Pour simplifier, on peut chercher récursivement ou utiliser un champ commun
    // Si vous n'avez que le lien 'family', voici une approche récursive simple :
    const familyChain = [];
    familyChain.push(root);

    let children = [root.pokedexnumber];
    while (children.length > 0) {
      const nextGen = await PokemonModel.find({ family: { $in: children } });
      if (nextGen.length === 0) break;
      
      familyChain.push(...nextGen);
      children = nextGen.map(p => p.pokedexnumber);
    }

    res.json(familyChain);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors du calcul de la lignée" });
  }
});

// Ajoute ici tes autres routes (family, evolution-chain, etc.)

export default router;