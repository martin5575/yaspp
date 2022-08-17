import { Output } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'yaspp-nx-drop-down-selector',
  templateUrl: './drop-down-selector.component.html',
  styleUrls: ['./drop-down-selector.component.scss'],
})
export class DropDownSelectorComponent implements OnInit {
  constructor() {}

  private selectedIndex = -1

  @Input() 
  options! : any[] 

  @Input()
  optionLabel! : string

  @Input()
  optionValue! : string

  
  @Output()
  public key: Subject<string> = new Subject<string>()



  ngOnInit(): void {
    if (this.options.length > 0) {
      this.selectedIndex = 0
      this.moveTo(0)
    }
  }

  moveTo(move:number) {
    const n = this.options.length
    this.selectedIndex = (this.selectedIndex + move + n) % n
    this.key.next(this.selectedLeagueKey)
  }

  set selectedLeagueKey(value:string) {
    this.selectedIndex = this.options.findIndex(x => x[this.optionValue] === value)
    this.moveTo(0)
  }

  get selectedLeagueKey() {
    const selectedOption = this.options[this.selectedIndex]
    console.log(selectedOption)
    return selectedOption && selectedOption[this.optionValue] || undefined
  }
}
