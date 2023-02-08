import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
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
    const dialogRef = this.dialog.open(DeleteItemDialog, {
      width: '31rem',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        /* delete todo */
        const deleteId: DeleteTodoInput = {
          id: this.todos[index].id
        };
        this.api.DeleteTodo(deleteId);
        this.todos.splice(index, 1);
      }
    });
  }

  mouseEnter(index: number) {
    console.log("mouse enter : " + index);
    const editDiv = document.getElementById('edit-' + index);
    const deleteDiv = document.getElementById('delete-' + index);

    editDiv.classList.remove("hide");
    deleteDiv.classList.remove("hide");
  }

  mouseLeave(index: number) {
    console.log('mouse leave :' + index);
    const editDiv = document.getElementById('edit-' + index);
    const deleteDiv = document.getElementById('delete-' + index);

    editDiv.classList.add("hide");
    deleteDiv.classList.add("hide");
  }
}

@Component({
  selector: 'delete-item',
  templateUrl: './delete-item.html',
  styleUrls: ['../../dialogs/add-todo/add-todo.component.scss']
})
export class DeleteItemDialog {
  constructor(public dialogRef: MatDialogRef<DeleteItemDialog>) { }
}