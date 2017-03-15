import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'kebabCase' })
export class KebabCasePipe implements PipeTransform {
    transform(input: string): string {
        return input.toLowerCase().replace(' ', '-');
    }
}