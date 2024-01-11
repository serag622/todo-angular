export interface Task {
    id : number
    name : string 
    description : string;
    date : string;
    priority : string;
    isComblete : boolean
}

export interface TaskFilters {
    name : string | null;
    priority : string | null
    isComblete : boolean | null
}

export const priorities = [
    'Low' , 'medium' , 'High'
]