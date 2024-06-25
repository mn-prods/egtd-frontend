import { FormControl } from '@angular/forms';

type FormControlValue = string | number | Date | null;

export type FormGroupValue<Ttpe extends Record<string, FormControlValue>> = {
  [P in keyof Ttpe]: FormControl<Ttpe[P] | null>;
};
