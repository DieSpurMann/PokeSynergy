import { Router, Request, Response } from 'express';
import { TeamModel } from '../../back/teamStruct'; // Vérifie bien le chemin vers ton modèle

const router = Router();

/**
 * @openapi
 * /api/teams:
 *   post:
 *     summary: Créer une nouvelle équipe de Pokémon
 *     tags:
 *       - Teams
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 description: L'ID MongoDB de l'utilisateur
 *               name:
 *                 type: string
 *               pokemons:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Équipe créée
 *       500:
 *         description: Erreur serveur
 */
router.post('/teams', async (req: Request, res: Response) => {
  try {
    const { user, name, pokemons } = req.body;
    if (pokemons.length > 6) {
      return res.status(400).json({ error: "Une équipe ne peut pas contenir plus de 6 Pokémon." });
    }
    const newTeam = new TeamModel({
      user: user,
      name: name,
      pokemons: pokemons
    });

    await newTeam.save();
    return res.status(201).json({ message: "L'équipe a été sauvegardée avec succès !", team: newTeam });
  } catch (error) {
    console.error("Erreur lors de la création de l'équipe:", error);
    return res.status(500).json({ error: "Erreur lors de la sauvegarde de l'équipe." });
  }
});

export default router;