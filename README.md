# PokéSynergy

### Pour lancer le projet il faut avoir les prérequis suivant:

- PNPM
```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

- Node en version LTS
- Cloner le projet au préalable

### Ensuite pour faire fonctioner la partie API il faut:
- Créer un fichier de configuration <b>utils.conf</b> avec en contenu:
```
DBLINK=mongodb+srv://user:ceciestunmotdepasse@pokesynergy.tsy15x6.mongodb.net/?appName=PokeSynergy
PORT=3000
```
- Installer toutes les dépendences
```bash
pnpm install
```

### Pour lancer l'app
- Il faut 2 terminaux
- Dans le premier lancer l'API
```bash
pnpm run api
```
- Et ensuite lancer le site
```bash
pnpm ng serve
```