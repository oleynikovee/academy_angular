import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { isChecked } from 'src/app/services/check.service';

@Component({
  selector: 'app-newuser',
  templateUrl: './newuser.component.html',
  styleUrls: ['./newuser.component.css']
})
export class NewuserComponent implements OnInit {
  myForm : FormGroup = new FormGroup({
    "firstName": new FormControl("",[Validators.pattern("[A-Za-z]{2,}"),
    Validators.required]),
    "lastName": new FormControl("",[Validators.pattern("[A-Za-z]{2,60}"),
    Validators.required]),
    "userEmail": new FormControl("", [
      Validators.required, 
      Validators.email
    ]),
    "userPhone": new FormControl("", Validators.pattern("[0-9]{10}")) 
});
  constructor(private readonly isChecked: isChecked) { }

  ngOnInit(): void {
  }
  //postNewUser->create new user and use POST fetch
  public postNewUser(){
    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify({
        "id": 1,
        "name": this.myForm.controls['firstName'].value,
        "username": this.myForm.controls['lastName'].value,
        "email": this.myForm.controls['userEmail'].value,
        "phone":this.myForm.controls['userPhone'].value ,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
  })
    .then((response) => response.json())
    .then((json) => this.isChecked.giveNewUser(JSON.stringify(json)))
  }
  //------------------------------------------------------------------
}
