import { v4 as uuidv4 } from 'uuid'

export type projectType = "Architectural" | "Structural" | "MEP Services"
export type projectStatus = "Active" | "Pending" | "Finished"

export interface IProject {
    Name: string
    Description: string
    Status: projectStatus
    Type: projectType
    FinishDate: Date
}

export class Project implements IProject {
    //parameters for IProject
    Name: string
    Description: string
    Status: projectStatus
    Type: projectType
    FinishDate: Date

    //parameters for Class internal for UI manipulation

    Initials: string
    ui: HTMLDivElement
    cost: number = 0
    progress: number = 0
    id: string

    getInitial(name: string): string {
        const nameArray = name.split(" ")
        const firstNameIn = nameArray[0].charAt(0).toUpperCase()
        const lastNameIn = nameArray[nameArray.length - 1].charAt(0).toUpperCase()
        return firstNameIn + lastNameIn
    }

    constructor(data: IProject) {
        /* this.Name = data.Name
        this.Description = data.Description
        this.Status = data.Status
        this.Type = data.Type
        this.FinishDate = data.FinishDate */
        // OR a better way is to user for in loop like below
        for (const key in data) {
            this[key] = data[key]
        }

        //Choosing default date one year from today in case user do not provide any date.

        const defaultDate = new Date();
        defaultDate.setFullYear(defaultDate.getFullYear() + 1)
        const dateInput = data.FinishDate.toDateString()

        if (dateInput == "Invalid Date") {
            // If not, set the value to the default date
            this.FinishDate = defaultDate
            console.log(data.FinishDate)
        }

        this.id = uuidv4()
        this.Initials = this.getInitial(this.Name)
        this.setUI() // Fn to create a UI element when form is filled


    }

    pickColor() {

        // Array containing colors 
        const colors = [
            '#06C270', '#772CB3', '#6A35FF',
            '#EE4D37', '#F08D32', '#144CC7'
        ];

        // selecting random color 
        var random_color = colors[(Math.floor(
            Math.random() * colors.length))];

        return random_color;
    }

    setUI() {
        if (this.ui) { return }
        this.ui = document.createElement("div")
        this.ui.className = "project-card"
        const bgc = this.pickColor();

        this.ui.innerHTML = `
        
        <div class="card-header">
            <p class="project-icon" style =" background-color: ${bgc};">${this.Initials} </p>
            <div>
                <h5>${this.Name}</h5>
                <h6>${this.Description}</h6>
            </div>
        </div>
        <div class="card-content">
            <div class="card-property">
                <p style="color: gray;">Status</p>
                <p>${this.Status}</p>
            </div>
            <div class="card-property">
                <p style="color: gray;">Type</p>
                <p>${this.Type}</p>
            </div>
            <div class="card-property">
                <p style="color: gray;">Cost</p>
                <p>$${this.cost}</p>
            </div>
            <div class="card-property">
                <p style="color: gray;">Estimated Progress</p>
                <p>${this.progress}</p>
            </div>
            <div class="card-id" style="color: gray; display: none">
                 <p>${this.id}</p>
            </div>
        </div>
    `

    }
}