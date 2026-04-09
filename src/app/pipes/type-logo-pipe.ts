import { Pipe, PipeTransform } from '@angular/core';
import { TypeLogo } from '../utils/typeLogo';

@Pipe({
  name: 'typeLogo',
  standalone: true // Important pour l'utiliser partout facilement
})
export class TypeLogoPipe implements PipeTransform {
  transform(typeName: string): string {
    // On retourne le logo correspondant, ou une image par défaut si on ne trouve pas
    return TypeLogo[typeName] || 'https://www.pokepedia.fr/images/1/1b/Miniature_Type_Inconnu_RS.png';
  }
}