import { Injectable } from "@angular/core";
import { Task } from "../model/task.model";

@Injectable({
    providedIn: 'root'
})

export class TaskService {

    TaskList: Task[] = []

    constructor() {}

    getTaskList() {
        let list = localStorage.getItem('list')
        list ? this.TaskList = JSON.parse(list) : this.TaskList = []
        return this.TaskList;
    }


    addTask(Task: Task) {
        this.TaskList.push({...Task ,id : this.TaskList.length+ 1})
        localStorage.setItem('list', JSON.stringify(this.TaskList))
    }


    updateTaskStatus(id : number){
        let index = this.TaskList.findIndex((t)=> t.id == id)
        this.TaskList[index].isComblete = true;
        localStorage.setItem('list', JSON.stringify(this.TaskList))
    }
   
    deleteTask(id : number){
        let index = this.TaskList.findIndex((t)=> t.id == id)
        this.TaskList = this.TaskList.splice(index, 1)
        localStorage.setItem('list', JSON.stringify(this.TaskList))
    }

}