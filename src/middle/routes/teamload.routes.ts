import { Router } from 'express';
import { TeamModel } from '../../back/teamStruct';

const router = Router();

/**
 * @openapi
 * /api/teams:
 *   get:
 *     summary: Récupérer toutes les équipes (avec pagination)
 *     tags:
 *       - Teams
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 0
 *         description: Numéro de la page (par défaut 0)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 20
 *         description: Nombre d'éléments par page (par défaut 20)
 *     responses:
 *       200:
 *         description: Liste des équipes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   user:
 *                     type: string
 *                   name:
 *                     type: string
 *                   pokemons:
 *                     type: array
 *                     items:
 *                       type: string
 *       500:
 *         description: Erreur serveur
 */
router.get('/teams', async (req, res) => {
  try {
    const page: number = req.query['page'] ? parseInt( req.query['page'] as string) : 0;
    const limit: number = req.query['limit'] ? parseInt( req.query['limit'] as string) : 20;

    const count = await TeamModel.countDocuments();
    console.log(`Nombre total de teams en DB : ${count}`);

    const teams = await TeamModel.find()
      .skip(page * limit)
      .limit(limit);

    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors du chargement" });
  }
});

/**
 * @openapi
 * /api/teams/user/{userId}:
 *   get:
 *     summary: Récupérer les équipes d'un utilisateur
 *     tags:
 *       - Teams
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 0
 *         description: Numéro de la page (par défaut 0)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 20
 *         description: Nombre d'éléments par page (par défaut 20)
 *     responses:
 *       200:
 *         description: Liste des équipes de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   user:
 *                     type: string
 *                   name:
 *                     type: string
 *                   pokemons:
 *                     type: array
 *                     items:
 *                       type: string
 *       500:
 *         description: Erreur serveur
 */
router.get('/teams/user/:userId', async (req, res) => {
  try {
    const userId = req.params['userId'];
    const page: number = req.query['page'] ? parseInt( req.query['page'] as string) : 0;
    const limit: number = req.query['limit'] ? parseInt( req.query['limit'] as string) : 20;

    const count = await TeamModel.countDocuments();
    console.log(`Nombre total de teams en DB : ${count}`);

    const teams = await TeamModel.find({user: userId })
      .skip(page * limit)
      .limit(limit);

    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors du chargement" });
  }
});

export default router;