import { FormControl } from '@angular/forms';
 
export class PercentValidator {
 
    static isValid(control: FormControl): any {
 
        if(isNaN(control.value)){
            return {
                "not-number": true
            };
        }
 
        if(control.value % 1 !== 0){
            return {
                "decimal": true
            };
        }
 
        if (control.value > 100){
            return {
                "too_big": true
            };
        }
 
        return null;
    }
 
}