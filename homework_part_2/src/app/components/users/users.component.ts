import { Component,OnInit,OnDestroy } from '@angular/core';
import { stringify } from 'querystring';
import { Subscription } from 'rxjs';
import { isChecked } from 'src/app/services/check.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  //services for control
  private subs!: Subscription;
  private del!: Subscription;
  private sort!: Subscription;
  private find!:Subscription;
  private getUser!:Subscription;
  //-----------------------------------
  //Array for manage data
  private dataSource!:any[];
  private sortingArray:Array<any>=[];
  private arrayForSearch:Array<any>=[];
  private count:number=0;
  //-----------------------------------
  constructor(private readonly isChecked: isChecked) { }

  ngOnInit(): void {
    this.initialArray();
    this.subs=this.isChecked.allCheked$.subscribe((count) => this.allChecked(count,document.querySelectorAll('.users input')));
    this.del=this.isChecked.deleteChecked$.subscribe((count) => this.deleteCheckedInputs(count,document.querySelectorAll('.users input')));
    this.sort=this.isChecked.sortingType$.subscribe((count)=>this.sortingChange(count));
    this.find=this.isChecked.findSmth$.subscribe((count)=>this.searching(count));
    this.getUser=this.isChecked.newUser$.subscribe((count)=>this.getNewUser(count));
  }

  ngOnDestroy():void{
    this.subs.unsubscribe();
    this.del.unsubscribe();
    this.sort.unsubscribe();
    this.find.unsubscribe();
  }
  //PrintAl->show data from arrays,that was given as argument
  public printAll(dataSource?:any[]){
    console.log(dataSource);
    const userSelector=document.querySelector(".users");
    userSelector!.innerHTML="";
    dataSource!.forEach((element:any) => {
      let outPut=document.createElement('div');
      outPut.style.position='relative'
      let checkbox=document.createElement('input');
      checkbox.type='checkbox';
      //Checkbox style;
      checkbox.classList.add(element.id);
      checkbox.setAttribute('id',`check${element.id}`);
      checkbox.onchange=(el=>this.checkValue(checkbox.className,checkbox));
      checkbox.style.position='absolute';
      checkbox.style.zIndex='999';
      checkbox.style.top='0';
      checkbox.style.left='0';
      //---------------------
      outPut.classList.add('user');
      //output div style;
      outPut.style.border='1px solid black';
      outPut.style.borderRadius='0.3em';
      outPut.style.textAlign='center';
      //---------------------------
      let pName=document.createElement('p');
      pName.style.marginBottom='0.2em';
      let pSName=document.createElement('p');
      pSName.style.marginBottom='0.2em';
      let pEmail=document.createElement('p');
      pEmail.style.marginBottom='0.2em';
      let pPhone=document.createElement('p');
      pPhone.style.marginBottom='0.2em';
      //print all objects
      pName.textContent=element.name;
      pSName.textContent=element.username;
      pEmail.textContent=element.email;
      pPhone.textContent=element.phone;
      //----------------------
      outPut?.appendChild(checkbox);
      outPut?.appendChild(pName);
      outPut?.appendChild(pSName);
      outPut?.appendChild(pEmail);
      outPut?.appendChild(pPhone);
      userSelector?.appendChild(outPut);
    });
  }
  //-----------------------------------
  //checkValue->find checked checkboxes
  checkValue(className:string,element:HTMLInputElement|null){
    element?.checked?element!.checked=true:element!.checked=false;
  }
  //-----------------------------------
  //AllChecked->service method,that controll press on @Select_ALL button
  private allChecked(state:boolean,selector:any){
    if(state){
      selector.forEach((el:HTMLInputElement|null)=>{
        el!.checked=true;
      });
    }
  }
  //-----------------------------------
  //DeleteCheckedInputs->method that delete checked users
  private deleteCheckedInputs(state:boolean,selector:any){
    let inpSelector=document.querySelector('.search') as HTMLInputElement | null;
    if(state){
      selector.forEach((el:HTMLInputElement|null)=>{
        if(el!.checked==true){
          inpSelector?.value===""?this.deleteFromJson(parseInt(el?.className as string),true):this.deleteFromJson(parseInt(el?.className as string),false);
        }
      });
    }
  }
  //-----------------------------------
  //InitialArray->create array from json,for printALL
  private async initialArray(){
    await fetch('https://jsonplaceholder.typicode.com/users')
    .then((response) => response.json())
    .then((json) => {
      this.dataSource=JSON.parse(JSON.stringify(json));
      for(let i=0;i<this.dataSource.length;i++){
        this.sortingArray.push(this.dataSource[i]);
      }
    });
    this.printAll(this.dataSource);
  }
  //-----------------------------------
  //deleteFromJson->delete data
  private deleteFromJson(id:number,state:boolean){
    if(state){
      this.dataSource=this.dataSource.filter(((el:any)=>el.id!==id));
      this.printAll(this.dataSource);
    }
    else{
      this.dataSource=this.dataSource.filter(((el:any)=>el.id!==id));
      this.arrayForSearch=this.arrayForSearch.filter(((el:any)=>el.id!==id));
      this.printAll(this.arrayForSearch);
    }
  }
  //-----------------------------------
  //SortingChange->Sort data by none,username,lastname
  private sortingChange(type:string){
    let inpSelector=document.querySelector('.search') as HTMLInputElement | null;
    switch(type){
      case "none":
        inpSelector?.value===""?this.printAll(this.dataSource):this.printAll(this.arrayForSearch);
        break;
      case "username":
        inpSelector?.value===""?this.printAll(this.dataSource.sort((a, b) => (a.name > b.name) ? 1 : -1)):this.arrayForSearch.sort((a, b) => (a.name > b.name) ? 1 : -1);
        break;
      case "lastname":
        inpSelector?.value===""?this.printAll(this.dataSource.sort((a, b) => (a.username > b.username) ? 1 : -1)):this.arrayForSearch.sort((a, b) => (a.username > b.username) ? 1 : -1);
        break;
    }
  }
  //-----------------------------------
  //Searching->search text from searching field
  private searching(type:string|undefined|null){
    const userSelector=document.querySelector(".users");
    userSelector!.innerHTML="";
    for(let i=0;i<this.dataSource.length;i++){
      this.arrayForSearch.push(this.dataSource[i]);
    }
    if(type!==""){
      this.arrayForSearch=this.dataSource.filter(((el:any)=>el.name===type||el.username===type));
      this.printAll(this.arrayForSearch);
    }
    else{
      this.printAll(this.dataSource);
    }
  }
  //-----------------------------------
  //
  private getNewUser(data:string){
    const newData=JSON.parse(data);
    let user={
      id:(newData.id+this.count),
      user:newData.user,
      username:newData.username,
      email:newData.email,
      phone:newData.phone
    }
    this.count+=1;
    this.dataSource.push(user);
    this.printAll(this.dataSource);
  }
  //
}

