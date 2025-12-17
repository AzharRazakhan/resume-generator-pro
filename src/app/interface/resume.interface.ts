import { FormArray, FormControl } from "@angular/forms";

export interface Experience {
    role: FormControl<string>;
    company: FormControl<string>;
    duration: FormControl<string>;
    points: FormArray<FormControl<string>>;
}

export interface Project {
    name: FormControl<string>;
    link: FormControl<string>;
    desc: FormControl<string>;
}