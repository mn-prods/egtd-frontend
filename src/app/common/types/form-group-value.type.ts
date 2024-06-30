import { FormControl } from '@angular/forms';

type FormControlValue = string | number | Date | null;

export type FormGroupValue<T extends Record<string, FormControlValue>> = {
  [P in keyof T]: FormControl<T[P] | null>;
};
