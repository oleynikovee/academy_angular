import { Component, OnInit,OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { isChecked } from 'src/app/services/check.service';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit {
  private subs!:Subscription;
  private arrayOfChekedId!:Array<number>;
  constructor(
    private readonly isChecked: isChecked
  ) {}
  
  ngOnInit(): void {
    this.subs = this.isChecked.idOfChecked$.subscribe((count) =>this.arrayOfChekedId.push(count) );
  }

  ngOnDestroy():void{
    this.subs.unsubscribe();
  }
  //select all checkboxes
  public selectAll(){
    this.isChecked.changeAllStates(true);
  }
  //delete all selected checkboxes
  public deleteChecked(){
    this.isChecked.deleteCheckedInputs(true);
  }
  //get type of sorting
  public chooseSorting(event:any){
    this.isChecked.sortingType(event.target.value);
  }
  //find user by string from input field
  public findUser(event:any){
    if (event.which <= 90 && event.which >= 48 || event.which == 8 || event.which == 46){
      this.isChecked.searching(event.target.value);
    }
  }
}
