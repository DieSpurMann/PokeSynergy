export interface PokéDataStruct {
    pokedexnumber: number;
    name: string;
    type: string[];
    talent: string[];
    weight: number;
    stats: {
        attack: number;
        defense: number;
        hp: number;
        specialattack: number;
        specialdefense: number;
        speed: number;
    }
    img: string;
    desc: string;
    family: number | null; //Pointe vers l'id de la pré-évolution
}