import { FormControl } from '@angular/forms';
 
export class YearValidator {
 
    static isValid(control: FormControl): any {
 
        if(isNaN(control.value)){
            return {
                "not_number": true
            };
        }
 
        if(control.value % 1 !== 0){
            return {
                "decimal": true
            };
        }
 
        if (control.value > new Date().getFullYear()){
            return {
                "too_big": true
            };
        }

        if (control.value < new Date().getFullYear()- 50){
            return {
                "too_small": true
            };
        }
 
        return null;
    }
 
}