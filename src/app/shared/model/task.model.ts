export interface Task {
    id : number
    name : string 
    description : string;
    date : string;
    priority : string;
    isComblete : boolean
}


export const priorities = [
    'Low' , 'medium' , 'High'
]