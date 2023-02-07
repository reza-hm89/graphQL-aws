import { EditTodoComponent } from './dialogs/edit-todo/edit-todo.component';
import { APIService, DeleteTodoInput, Todo, UpdateTodoInput, CreateTodoInput } from './API.service';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Amplify } from 'aws-amplify';
import awsmobile from 'src/aws-exports';
import { MatDialog } from '@angular/material/dialog';
import { AddTodoComponent } from './dialogs/add-todo/add-todo.component';
import { MatTable, MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild(MatTable) table: MatTable<Todo>;
  title = 'amplify-aws';
  todos = new MatTableDataSource<Todo | null>();
  displayedColumns: string[] = ['name', 'desc', 'date', 'edit', 'delete'];

  constructor(private api: APIService, public dialog: MatDialog,
    private changeDetectorRefs: ChangeDetectorRef) {
    Amplify.configure(awsmobile);
  }

  ngOnInit(): void {
    /* fetch todo when app loads */
    this.get();
  }

  async get() {
    await this.api.ListTodos().then((event) => {
      this.todos.data = event.items;
    });
  }

  createTodo() {
    const dialogRef = this.dialog.open(AddTodoComponent, {
    });
    dialogRef.afterClosed().subscribe((result: CreateTodoInput) => {
      if (result) {
        /* create todo */
        this.api.CreateTodo(result).then(res => {
          this.todos.data.unshift(res)
          this.table.renderRows();
        });
      }
    });
  }

  editTodo(index: number) {
    const dialogRef = this.dialog.open(EditTodoComponent, {
      data: this.todos.data[index],
    });
    dialogRef.afterClosed().subscribe((result: UpdateTodoInput) => {
      if (result) {
        /* update todo */
        this.api.UpdateTodo(result).then(res => {
          this.todos.data[index] = res;
          this.table.renderRows();
        });
      }
    });
  }

  /* delete todo */
  deleteTodo(index: number) {
    const deleteId: DeleteTodoInput = {
      id: this.todos.data[index].id
    };
    this.api.DeleteTodo(deleteId);
    this.todos.data.splice(index, 1);
    this.table.renderRows();
  }

}
