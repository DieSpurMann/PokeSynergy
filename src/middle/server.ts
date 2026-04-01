import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import bcrypt from 'bcrypt';
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

app.post('/api/register', async (req, res) => {
  try {
    const { pseudo, email, mdp } = req.body; // 'mdp' arrive en clair : "Pikachu123"

    // GÉNÉRATION DU HASH
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(mdp, salt); // On crée le hash ici

    // CRÉATION DU MODÈLE
    // ATTENTION : Ici, on doit utiliser 'mdp: hashedPassword' 
    // pour écraser la valeur en clair par la valeur hashée
    const newUser = new UserModel({ 
      pseudo: pseudo, 
      email: email, 
      mdp: hashedPassword // <-- C'est CETTE ligne la plus importante
    });

    await newUser.save();
    console.log("Utilisateur créé avec hash :", hashedPassword); // Vérifie ton terminal Node !
    
    res.status(201).json({ message: "Dresseur enregistré !" });
  } catch (error) {
    res.status(500).json({ error: "Erreur inscription" });
  }
});


app.post('/api/login', async (req, res) => {
  try {
    const { email, mdp } = req.body;

    // 1. Chercher l'utilisateur par son email
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ error: "Dresseur non trouvé." });
    }

    // 2. COMPARER le mot de passe saisi avec le hash de la DB
    // bcrypt.compare prend (texte_clair, hash_db)
    const isMatch = await bcrypt.compare(mdp, user.mdp);

    if (!isMatch) {
      return res.status(401).json({ error: "Mot de passe incorrect." });
    }

    // 3. RENVOYER LES INFOS (dont l'ID pour ton collègue)
    // C'est ici que ton collègue récupère le fameux _id
    return res.status(200).json({ 
      message: "Connexion réussie !", 
      user: { 
        uid: user._id, 
        pseudo: user.pseudo, 
        email: user.email 
      } 
    });

  } catch (error) {
    console.error("Erreur Login:", error);
    return res.status(500).json({ error: "Erreur lors de la connexion." });
  }
});
