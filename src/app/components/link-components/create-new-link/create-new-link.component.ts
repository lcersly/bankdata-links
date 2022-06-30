import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {urlPattern} from '../constants';

@Component({
  selector: 'app-create-new-link',
  templateUrl: './create-new-link.component.html',
  styleUrls: ['./create-new-link.component.scss'],
})
export class CreateNewLinkComponent implements OnInit {

  public form = this.fb.group({
    url: ['', [Validators.required, Validators.pattern(urlPattern)]],
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required]],
    section: ['', [Validators.required]],
    path: ['', [Validators.required]],
    tags: [''],
    environment: ['', [Validators.required]],
    icon: [''],
  });

  constructor(private fb: FormBuilder) {
  }

  public get urlControl():FormControl{
    return this.form.get('url') as FormControl
  }

  public get nameControl():FormControl{
    return this.form.get('name') as FormControl
  }

  public get descriptionControl():FormControl{
    return this.form.get('description') as FormControl
  }

  public get sectionControl():FormControl{
    return this.form.get('section') as FormControl
  }

  public get pathControl():FormControl{
    return this.form.get('path') as FormControl
  }

  public get tagsControl():FormControl{
    return this.form.get('tags') as FormControl
  }

  public get environmentControl():FormControl{
    return this.form.get('environment') as FormControl
  }
  public get iconControl():FormControl{
    return this.form.get('icon') as FormControl
  }

  ngOnInit(): void {
  }

  create() {
    this.form.markAllAsTouched();
    console.info(this.form.valid, this.form.value)
    if(!this.form.valid){
      return;
    }
  }
}
