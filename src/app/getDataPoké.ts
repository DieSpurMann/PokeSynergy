import axios from 'axios';

// d d d d d (pour ton d cassé)
const apiUrl: string = 'https://pokeapi.co/api/v2/pokemon/palkia';

axios.get(apiUrl)
.then(response => {
  // Extraction des données (le "filtrage" manuel)
  const rawData = response.data;

  const filteredData = {
    nom: rawData.name,
    poids: rawData.weight,
    image: rawData.sprites.front_default,
    id: rawData.id,
    stats: rawData.stats,
    types: rawData.types
  };

  console.log("Données filtrées :", filteredData);
})
.catch(error => console.error("Error:", error));