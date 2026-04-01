import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import { connectToDatabase, url } from '../back/database';
import { PokemonModel } from '../back/pokemon';
import { swaggerDocs } from './config/swagger';
import { UserModel } from '../back/user';
import getEvoPokeRoutes from './routes/getEvoPoke.routes';
import pokebyidRoutes from './routes/pokebyid.routes';
import teamRoutes from './routes/team.routes';
import teamLoad from './routes/teamload.routes';

dotenv.config({ path: 'utils.conf' });
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/api', getEvoPokeRoutes);
app.use('/api', pokebyidRoutes);
app.use('/api', teamRoutes); // Routes pour les équipes
app.use('/api', teamLoad);

// Configuration Swagger + API
const PORT: number = process.env['PORT'] ? parseInt(process.env['PORT']) : 3000;
connectToDatabase(url).then(() => {
  console.log("DB connectée !");
  app.listen(PORT, '0.0.0.0',() => console.log(`Serveur sur http://192.168.1.100:${PORT}`));
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
    const page: number = req.query['page'] ? parseInt( req.query['page'] as string) : 0;
    const limit: number = req.query['limit'] ? parseInt( req.query['limit'] as string) : 20;

    const count = await PokemonModel.countDocuments();
    console.log(`Nombre total de Pokémon en DB : ${count}`);

    const pokemons = await PokemonModel.find()
      .skip(page * limit)
      .limit(limit);

    res.json(pokemons);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors du chargement" });
  }
});

/**
 * @openapi
 * /api/register:
 *   post:
 *     summary: Inscription d'un nouveau dresseur
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pseudo:
 *                 type: string
 *               email:
 *                 type: string
 *               mdp:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Dresseur créé avec succès
 */
app.post('/api/register', async (req, res) => {
  try {
    const { pseudo, email, mdp } = req.body;
    const newUser = new UserModel({ pseudo, email, mdp });
    await newUser.save();
    res.status(201).json({ message: "Dresseur enregistré !" });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ error: "Email ou Pseudo déjà utilisé." });
    } else {
      res.status(500).json({ error: "Erreur lors de l'inscription" });
    }
  }
});

/**
 * @openapi
 * /api/login:
 *   post:
 *     summary: Connexion d'un dresseur
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               mdp:
 *                 type: string
 *               uid:
 *                 type: string
 *
 *     responses:
 *       '200':
 *         description: Connexion réussie
 */
app.post('/api/login', async (req, res) => {
  try {
    const { email, mdp } = req.body;
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ error: "Dresseur non trouvé." });
    }

    
    if (user.mdp !== mdp) {
      return res.status(401).json({ error: "Mot de passe incorrect." });
    }

    return res.status(200).json({ 
      message: "Connexion réussie !", 
      user: { pseudo: user.pseudo, email: user.email, uid: user._id } 
    });
  } catch (error) {
    return res.status(500).json({ error: "Erreur lors de la connexion." });
  }
});
