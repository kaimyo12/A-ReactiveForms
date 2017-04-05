import { Component, OnInit, Directive } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Hero } from './hero';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  heroForm: FormGroup;

  forAlter = Validators.compose([Validators.required, Validators.maxLength(10), this.startsWithLetter]);

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
      'email': ['', [Validators.required, this.mailFormat, CustomValidators.rangeLength([4,10])]]
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
    for (const field in this.formErrors)  // getting the objects inside the formErrors
    {                                     // looping them all
      // clear previous error message (if any)
      this.formErrors[field] = '';        // making them null while there's no error passed yet

      const control = this.heroForm.get(field); // control holds if who's field is used

      if (control && control.dirty && !control.valid) 
       {
        const messages = this.validationMessages[field];
        
        for (const key in control.errors) 
        {
          this.formErrors[field] += messages[key];
        } 

      }

    }

  } 

  mailFormat(control: FormControl): ValidationResult 
     {
        var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]+.[a-z0-9]+$/;
      
        if (control.value != "" && (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))) {
            return { "incorrectMailFormat": true }; // the one that is triggered on our validationMessages
        }

        return null;  //returns no message error when no conflicts fired
    }


    startsWithLetter(control: FormControl): ValidationResult 
    { 
    
      if ( control.value !="" && !isNaN(control.value.charAt(0) ))
      {
        return {"startsWithLetter": true}; // also the one triggered on the validationMessages
      }
    
      return null;
    }

  formErrors = {         // the object for the errors
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
      'startsWithLetter': 'This must not start with number'
    },
    'email': 
    {
      'required': 'Email is required',
      'incorrectMailFormat': 'Email not met, Example: kaimyo12@yahoo.com/kaimyo24@gmail.com.',
      'rangeLength': 'Character range is 4 to 10.'
    }
  };
}


interface ValidationResult{
   [key:string]:boolean;
}
