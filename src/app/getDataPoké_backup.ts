import axios from 'axios';

const apiUrl: string = 'https://pokeapi.co/api/v2/pokemon/solgaleo';

axios.get(apiUrl, {
  params: {
    _limit: 5
  }
})
.then(response => console.log(response.data))
.catch(error => console.error("Error:", error));  