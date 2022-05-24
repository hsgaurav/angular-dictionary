import {Component, ViewChild} from '@angular/core';
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {DialogBoxComponent} from "./dialog-box/dialog-box.component";

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

export class AppComponent {
  title = 'dictionary';
  dataSource = new MatTableDataSource<PeriodicElement>([]);
  displayedColumns: string[] = ['position', 'word', 'action'];
  inputWord: string;
  @ViewChild(MatTable, {static: true}) table: MatTable<any> | undefined;

  constructor(public dialog: MatDialog) {
    this.inputWord = "";
  }

  refresh(): void {
    this.dataSource.data = this.dataSource.data;
  }

  ngOnInit(): void {
  }

  onsave() {
    this.dataSource.data.push({position: this.dataSource.data.length + 1, word: this.inputWord});
    this.refresh();
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
    this.dataSource.data = this.dataSource.data.filter((value, key) => {
      return value.position != data.position;
    });
  }
}

