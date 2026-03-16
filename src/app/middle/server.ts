import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import { connectToDatabase, url } from '../../back/database';
import { PokemonModel } from '../../back/pokemon';
import { swaggerDocs } from './config/swagger';

dotenv.config({ path: 'utils.conf' });
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // Morgan pour voir les requêtes passer

// Configuration Swagger + API
const PORT: number = process.env['PORT'] ? parseInt(process.env['PORT']) : 3000;
connectToDatabase(url).then(() => {
  console.log("DB connectée !");
  app.listen(PORT, () => console.log(`Serveur sur http://localhost:${PORT}`));
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @openapi
 * /api/pokemons:
 *   get:
 *     summary: Récupère la liste des Pokémon (Infinite Scroll)
 *     tags:
 *       - Pokemons
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         default: 0
 *         description: Numéro de la page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         default: 20
 *         description: Nombre de Pokémon par paquet
 *     responses:
 *       '200':
 *         description: Succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   nom:
 *                     type: string
 *                   apiId:
 *                     type: integer
 */
app.get('/api/pokemons', async (req, res) => {
  try {
    // On récupère les params, avec des valeurs par défaut (Page 0, 20 Pokémon)
    const page: number = req.query['page'] ? parseInt( req.query['page'] as string) : 0;
    const limit: number = req.query['limit'] ? parseInt( req.query['limit'] as string) : 20;

    const count = await PokemonModel.countDocuments();
    console.log(`Nombre total de Pokémon en DB : ${count}`);

    const pokemons = await PokemonModel.find()
      .skip(page * limit) // On saute ceux des pages précédentes
      .limit(limit);      // On n'en prend que 'limit'

    res.json(pokemons);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors du chargement" });
  }
});
