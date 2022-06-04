import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {DialogBoxComponent} from "./dialog-box/dialog-box.component";
import {WordService} from "./word.service";
import {Observable} from "rxjs";
import {Dictionary} from "./dictionary";

interface PeriodicElement {
  word: string;
  action?: any;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  dictWord: Observable<PeriodicElement[]> = new Observable<PeriodicElement[]>();
  title = 'dictionary';
  displayedColumns: string[] = ['word', 'action'];
  wordDict: Dictionary = new Dictionary();
  inputWord: string = this.wordDict.word;
  @ViewChild(MatTable, {static: true}) table: MatTable<any> | undefined;

  constructor(public dialog: MatDialog, private wordService: WordService) {
  }

  refresh() {
    this.dictWord = this.wordService.getDictionary();
  }

  ngOnInit(): void {
    this.refresh();
  }

  private validateWord(word: string) {
    return !(word && word.trim())
  }

  onSave() {
    if (this.validateWord(this.inputWord)) {
      alert("Empty Word!");
    } else {
      this.wordDict.word = this.inputWord;
      this.wordService
        .saveWord(this.wordDict)
        .subscribe(data => {
            this.refresh();
          },
          error => alert("Duplicate Word!"));
    }
    this.inputWord = "";
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
    if (this.validateWord(data.name)) {
      alert("Empty Word!");
    } else {
      this.wordDict.word = data.name
      this.wordService.updateWord(data.word, this.wordDict)
        .subscribe(
          data => {
            this.refresh();
          },
          error => console.log(error));
    }
  }

  private deleteRowData({data}: { data: any }) {
    this.wordService.deleteWord(data.word)
      .subscribe(
        data => {
          this.refresh();
        },
        error => console.log(error));
  }
}

