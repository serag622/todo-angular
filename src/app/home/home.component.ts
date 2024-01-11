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
import { Task, priorities } from '../shared/model/task.model';
import { TaskService } from '../shared/service/task.service';



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

  createForm(): UntypedFormGroup {
    return this.fb.group({
      name : ['', Validators.required] ,
      description : ['',Validators.required] ,
      date : ['' ,Validators.required] ,
      priority : ['' ,Validators.required] ,
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
      this.taskServise.addTask(this.Form.getRawValue())
      this.close()
    }
  }



}
