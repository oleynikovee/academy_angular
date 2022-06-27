import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class isChecked {
    public idOfChecked$ = new Subject<number>();
    public allCheked$ = new Subject<boolean>();
    public deleteChecked$=new Subject<boolean>();
    public sortingType$=new Subject<string>();
    public findSmth$=new Subject<string|undefined|null>();
    //deleteCheckedInputs->service,that get and set state of deleting
    public deleteCheckedInputs(state:boolean){
        this.deleteChecked$.next(state);
    }
    //changeAllStates->service,that get and set state of "All selected"
    public changeAllStates(state:boolean){
        this.allCheked$.next(state);
    }
    //ChangeCount->service,that get and set state of every click on checkbox
	  public changeCount(num:number) {
   	    this.idOfChecked$.next(num); 
  	}
    //sortingType->service,that get and set type of sorting
    sortingType(type:string){
        this.sortingType$.next(type);
    }
    //searchin->service,that get and set string,that we should get and show
    searching(objOfSearch:string|undefined|null){
        this.findSmth$.next(objOfSearch);
    }
}
