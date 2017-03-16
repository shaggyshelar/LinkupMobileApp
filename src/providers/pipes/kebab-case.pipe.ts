import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'kebabCase' })
export class KebabCasePipe implements PipeTransform {
    transform(input: string): string {
        if(input)
            return input.toLowerCase().replace(' ', '-');
        else
            return '';
    }
}