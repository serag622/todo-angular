import { Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
  FormControl,
} from "@angular/forms";
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Subscription, takeUntil, timer } from 'rxjs';
import { SharedModule } from '../shared/shared.module';
import { Task, TaskFilters, priorities } from '../shared/model/task.model';
import { TaskService } from '../shared/service/task.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SharedModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [NgbModalConfig]
})
export class HomeComponent implements OnInit {

  Form !: UntypedFormGroup;
  private modalService = inject(NgbModal);
  @ViewChild('AddTask') AddTaskDialog !: TemplateRef<any>;

  TaskList : Task[] = []
  isToggled : boolean = false;

  
  isDisabled : boolean = false;
  isSubmit : boolean = false;

  priorities : string[] = priorities

  filters : TaskFilters = {name : null , priority : null , isComblete : null}

  constructor(private fb: UntypedFormBuilder, config: NgbModalConfig,private taskServise : TaskService) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.getTaskList()
  }

  getTaskList(){
    this.TaskList = this.taskServise.getTaskList()
  }


  Search(){
    this.TaskList = this.taskServise.getTaskList()
     this.TaskList = this.TaskList.filter((t)=> 
       t.name == this.filters.name || t.isComblete == this.filters.isComblete || t.priority == this.filters.priority
     )
  }

  reset(){
    this.filters = {name : null , priority : null , isComblete : null};
    this.getTaskList()
  }


  Sort($event : any){
    let val =  $event.target.value
    if(val == 0){
      this.getTaskList()
    }
    else if(val == 1){
      this.TaskList = this.TaskList.sort((a , b)=> a.priorityId - b.priorityId)
    }else if(val == 2){
      this.TaskList = this.TaskList.sort((a , b)=> b.priorityId - a.priorityId)
    }
  }

  createForm(): UntypedFormGroup {
    return this.fb.group({
      name : ['', Validators.required] ,
      description : ['',Validators.required] ,
      date : ['' ,Validators.required] ,
      priority : ['' ,Validators.required] ,
      priorityId : [] ,
      isComblete : [false]
    });
  }


  OpenAddTaskDialog(){
    this.Form = this.createForm()
    const modalRef = this.modalService.open(this.AddTaskDialog);
  }

  close() {
    this.isSubmit = false
    this.isDisabled = false
    this.modalService.dismissAll()
    this.getTaskList()
  }


  submit(){
    if(!this.isDisabled) this.isDisabled = true
    else return ;

    this.isSubmit = true

    if (this.Form.invalid) {

      Object.values(this.Form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
          this.isDisabled = false;
        }
      });
    } else {

      let p : string = this.Form.controls['priority'].value;
      let pId : number = p == 'Low' ? 1 : p == 'medium' ? 2: 3

      this.Form.controls['priorityId'].setValue(pId)

      this.taskServise.addTask(this.Form.getRawValue())
      this.close()
    }
  }


  openDeleteConfirmMsg(id : number){
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this task!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.taskServise.deleteTask(id)
        this.getTaskList()
        Swal.fire(
          'Deleted!',
          'Your task has been deleted.',
          'success'
        )
      }
    })
  }


  openCompleteConfirmMsg(id : number){
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to change this task status!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        this.taskServise.updateTaskStatus(id)
        this.getTaskList()
        Swal.fire(
          'Done!',
          'Your task status is done.',
          'success'
        )
      }
    })
  }


}
