import { Component, OnInit, Directive } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Hero } from './hero';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  heroForm: FormGroup;

  forAlter = Validators.compose([Validators.required, Validators.maxLength(10), this.startsWithNumber]);

  submitted = false;
  active = true;
  powers = ['Really Smart', 'Super Flexible', 'Weather Changer'];
  hero = new Hero(18, 'Dr. WhatIsHisName', this.powers[0], 10, 'Dr. What');

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.buildForm();
  }

  

  buildForm(): void {
    this.heroForm = this.fb.group({
      'name': [this.hero.name, [
          Validators.required,
          Validators.minLength(4),
        ]
      ],
      'numberOnly':[this.hero.numberOnly,[
        Validators.required,
        Validators.maxLength(10),
        Validators.minLength(2),
        Validators.pattern('[0-9]+')
      ]],
      'alterEgo': [this.hero.alterEgo, this.forAlter],
      'power':    [this.hero.power, Validators.required],
      'email': ['', [Validators.required, this.mailFormat]]
    });

    this.heroForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // (re)set validation messages now
  }

  onSubmit() {
  this.submitted = true;
  this.hero = this.heroForm.value;
}

addHero() {
  this.hero = new Hero(42, '', '', null , '');
  this.buildForm();
}

onValueChanged(data?: any) 
{
    for (const field in this.formErrors) 
    {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = this.heroForm.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + '\n';
        } 
      }

    }
  }

     mailFormat(control: FormControl): ValidationResult 
     {
        var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

        if (control.value != "" && (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))) {
            return { "incorrectMailFormat": true };
        }

        return null;
    }


    startsWithNumber(control: FormControl): ValidationResult 
    { 
    
      if ( control.value !="" && !isNaN(control.value.charAt(0)) )
      {
        return {"startsWithNumber": true};
      }
    
      return null;
    }

  formErrors = {
    'name': '',
    'power': '',
    'numberOnly': '',
    'alterEgo': '',
    'email': ''
  };

  validationMessages = {
    'name': {
      'required':      'Name is required.',
      'minlength':     'Name must be at least 4 characters long.',
    },
    'numberOnly':
    {
      'required': 'This field is required.',
      'maxlength' : 'This field has a maximum of 10 numbers.',
      'minlength': 'This field has a minimum of 2 numbers.',
      'pattern': 'This field only accepts number.'
    },
    'power': {
      'required': 'Power is required.'
    },
    'alterEgo':
    {
      'required':'AlterEgo is required.',
      'maxlength': 'AlterEgo only accepts a maximum of 10 characters.',
      'startsWithNumber': 'This must not start with number'
    },
    'email': 
    {
      'required': 'Email is required',
      'incorrectMailFormat': 'Email not met, Example: kaimyo12@yahoo.com/kaimyo24@gmail.com'
    }
  };
}


interface ValidationResult{
   [key:string]:boolean;
}
