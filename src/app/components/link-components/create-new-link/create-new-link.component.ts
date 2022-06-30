import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {urlPattern} from '../constants';

@Component({
  selector: 'app-create-new-link',
  templateUrl: './create-new-link.component.html',
  styleUrls: ['./create-new-link.component.scss'],
})
export class CreateNewLinkComponent implements OnInit {

  public form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      url: this.fb.control(['', [Validators.required, Validators.pattern(urlPattern)]]),
      name: this.fb.control(['', [Validators.required, Validators.minLength(3)]]),
      description: this.fb.control(['', [Validators.required]]),
      section: this.fb.control(['', [Validators.required]]),
      path: this.fb.control(['', [Validators.required]]),
      tags: this.fb.control(['']),
      environment: this.fb.control(['', [Validators.required]]),
      icon: this.fb.control(['']),
    })
  }

  ngOnInit(): void {
  }

}
