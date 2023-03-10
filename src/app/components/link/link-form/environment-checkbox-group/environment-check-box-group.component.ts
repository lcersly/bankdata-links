import {ChangeDetectionStrategy, Component} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import {ThemePalette} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-environment-checkbox-group',
  templateUrl: './environment-check-box-group.component.html',
  styleUrls: ['./environment-check-box-group.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: EnvironmentCheckBoxGroupComponent,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: EnvironmentCheckBoxGroupComponent,
    },
  ],
  imports: [
    MatInputModule,
    MatCheckboxModule,
    NgForOf,
    FormsModule,
  ],
})
export class EnvironmentCheckBoxGroupComponent implements ControlValueAccessor, Validator {
  onChange: ((selection: string[]) => void) = () => {
  };
  onTouched = () => {
  };
  touched = false;
  disabled = false;

  task: Task = {
    name: 'All',
    completed: false,
    color: 'primary',
    isDisabled: false,
    subtasks: [
      {name: 'T', completed: false, color: 'primary', isDisabled: false},
      {name: 'S', completed: false, color: 'primary', isDisabled: false},
      {name: 'P', completed: false, color: 'primary', isDisabled: false},
    ],
  };

  allComplete: boolean = false;

  updateAllComplete(updateParent = true) {
    this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => t.completed);
    if (updateParent) this.updateParentForm();
  }

  someComplete(): boolean {
    if (this.task.subtasks == null) {
      return false;
    }
    return this.task.subtasks.filter(t => t.completed).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.task.subtasks == null) {
      return;
    }
    //this can be optimized
    this.task.subtasks.forEach(t => (t.completed = completed));
    this.updateParentForm();
  }

  updateParentForm() {
    this.markAsTouched();
    if (this.task.subtasks == null) {
      return;
    }
    this.onChange(this.task.subtasks?.filter(t => t.completed).map(t => t.name))
  }

  //todo all the inherited methods needs to be gone over
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  //todo disabled needs to be set on all checkboxes
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.task.isDisabled = isDisabled;
    this.task.subtasks?.forEach(subtask => subtask.isDisabled = isDisabled)
    // if(isDisabled){
    //   this.tagCtrl.disable();
    // }else{
    //   this.tagCtrl.enable();
    // }
  }

  writeValue(value: string[]): void {
    if (this.task.subtasks == null) {
      return;
    }
    this.task.subtasks.forEach(t => t.completed = value.includes(t.name));
    this.updateAllComplete(false);
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return null;
  }
}

export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  isDisabled: boolean;
  subtasks?: Task[];
}
