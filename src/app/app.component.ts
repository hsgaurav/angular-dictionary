import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {DialogBoxComponent} from "./dialog-box/dialog-box.component";
import {WordService} from "./word.service";
import {Observable} from "rxjs";
import {Dictionary} from "./dictionary";

interface PeriodicElement {
  position: number;
  word: string;
  action?: any;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  word: Observable<PeriodicElement[]> = new Observable<PeriodicElement[]>();
  title = 'dictionary';
  dataSource = new MatTableDataSource<PeriodicElement>([]);
  displayedColumns: string[] = ['position', 'word', 'action'];
  inputWord: Dictionary = new Dictionary();
  @ViewChild(MatTable, {static: true}) table: MatTable<any> | undefined;

  constructor(public dialog: MatDialog, private wordService: WordService) {
  }

  refresh() {
    this.word = this.wordService.getDictionary();
  }

  ngOnInit(): void {
    this.refresh();
  }

  onsave() {
    this.wordService
      .saveWord(this.inputWord).subscribe(data => {
        console.log(data)
        this.inputWord = new Dictionary();
      },
      error => console.log(error));
    this.dataSource.data.push({position: this.dataSource.data.length + 1, word: this.inputWord});
    // this.refresh();
  }

  openDialog({action, obj}: { action: any, obj: any }) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '250px',
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Update') {
        this.updateRowData({data: result.data});
      } else if (result.event == 'Delete') {
        this.deleteRowData({data: result.data});
      }
    });
  }

  private updateRowData({data}: { data: any }) {
    console.log(data);
    this.dataSource.data = this.dataSource.data.filter((value, key) => {
      if (value.position == data.position) {
        value.word = data.name;
      }
      return true;
    });
  }

  private deleteRowData({data}: { data: any }) {
    this.wordService.deleteWord(data)
      .subscribe(
        data => {
          console.log(data);
          this.refresh();
        },
        error => console.log(error));
    // this.dataSource.data = this.dataSource.data.filter((value, key) => {
    //   return value.position != data.position;
    // });
  }
}

