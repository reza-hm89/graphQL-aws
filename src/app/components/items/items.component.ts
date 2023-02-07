import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { APIService, CreateTodoInput, DeleteTodoInput, Todo, UpdateTodoInput } from 'src/app/API.service';
import { Amplify } from 'aws-amplify';
import awsmobile from 'src/aws-exports';
import { AddTodoComponent } from 'src/app/dialogs/add-todo/add-todo.component';
import { EditTodoComponent } from 'src/app/dialogs/edit-todo/edit-todo.component';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html'
})
export class ItemsComponent implements OnInit {

  todos = Array<Todo | null>();

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
      this.todos = event.items;
    });
  }

  createTodo() {
    const dialogRef = this.dialog.open(AddTodoComponent, {
    });
    dialogRef.afterClosed().subscribe((result: CreateTodoInput) => {
      if (result) {
        /* create todo */
        this.api.CreateTodo(result).then(res => {
          this.todos.unshift(res)
        });
      }
    });
  }

  editTodo(index: number) {
    const dialogRef = this.dialog.open(EditTodoComponent, {
      data: this.todos[index],
    });
    dialogRef.afterClosed().subscribe((result: UpdateTodoInput) => {
      if (result) {
        /* update todo */
        this.api.UpdateTodo(result).then(res => {
          this.todos[index] = res;
        });
      }
    });
  }

  /* delete todo */
  deleteTodo(index: number) {
    const deleteId: DeleteTodoInput = {
      id: this.todos[index].id
    };
    this.api.DeleteTodo(deleteId);
    this.todos.splice(index, 1);
  }
}
