export interface PokéDataStruct {
    pokedexnumber: number;
    name: string;
    family: string; //Temporary
    stats: {
        attack: number;
        defense: number;
        hp: number;
        specialattack: number;
        specialdefense: number;
        speed: number;
    }
    type: string[];
    desc: string;
    talent: string[];
    img: string;
}

