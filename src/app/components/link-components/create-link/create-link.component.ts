import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {urlPattern} from '../link-modification.module';

@Component({
  selector: 'app-create-link',
  templateUrl: './create-link.component.html',
  styleUrls: ['./create-link.component.scss'],
})
export class CreateLinkComponent implements OnInit {
  public form: FormGroup = this.fb.group({
    url: this.fb.control(['', [Validators.required, Validators.pattern(urlPattern)]]),
    name: this.fb.control(['', [Validators.required, Validators.minLength(3)]]),
    description: this.fb.control(['', [Validators.required]]),
    section: this.fb.control(['', [Validators.required]]),
    path: this.fb.control(['', [Validators.required]]),
    tags: this.fb.control(['']),
    environment: this.fb.control(['', [Validators.required]]),
    icon: this.fb.control(['']),
  })

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
  }

}
