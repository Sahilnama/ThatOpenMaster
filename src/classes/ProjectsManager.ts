import { IProject, Project } from "./Project"
let errorCode = 0;

export class ProjectsManager {

    list: Project[] = []
    ui: HTMLElement

    constructor(container: HTMLElement) {
        this.ui = container
    }

    newProject(data: IProject) {
        const projectNames = this.list.map((project) => {
            return project.Name
        })

        const nameInUse = projectNames.includes(data.Name)

        if (nameInUse) {
            console.log(nameInUse)
            errorCode = 1
            throw new Error(`A project with name "${data.Name}" already exists`)
            // return "nameInUse"

        }
        const project = new Project(data)
        project.ui.addEventListener("click", () => {
            const projectsPage = document.getElementById("projects-page")
            const detailsPage = document.getElementById("project-details")
            if (!(projectsPage && detailsPage)) { return }
            projectsPage.style.display = "none"
            detailsPage.style.display = "flex"
            this.setDetailsPage(project)
        })

        this.ui.append(project.ui)
        this.list.push(project)
        return project


    }

    getInitials(name:string): string {
        const nameArray = name.split(" ")
        const firstNameIn = nameArray[0].charAt(0).toUpperCase()
        const lastNameIn = nameArray[nameArray.length - 1].charAt(0).toUpperCase()
        return firstNameIn + lastNameIn
      }

    setDetailsPage(project: Project) {
        const detailsPage = document.getElementById("project-details")
        if (!detailsPage) { return }
        const name = detailsPage.querySelector("[data-project-info='name']")
        const desc = detailsPage.querySelector("[data-project-info='desc']")
        const initials = detailsPage.querySelector("[data-project-info='initials']")
        const Cname = detailsPage.querySelector("[data-project-info='Cname']")
        const Cdesc = detailsPage.querySelector("[data-project-info='Cdesc']")
        const status = detailsPage.querySelector("[data-project-info='status']")
        const type = detailsPage.querySelector("[data-project-info='type']")
        const cost = detailsPage.querySelector("[data-project-info='cost']")
        const finishDate = detailsPage.querySelector("[data-project-info='finish-date']")
        const progress = detailsPage.querySelector("[data-project-info='progress']") //to be modified later

        if (name) { name.textContent = project.Name }
        if (desc) { desc.textContent = project.Description }
        if (initials) { initials.textContent = this.getInitials(project.Name) }
        if (Cname) { Cname.textContent = project.Name }
        if (Cdesc) { Cdesc.textContent = project.Description }
        if (status) { status.textContent = project.Status }
        if (type) { type.textContent = project.Type }
        if (cost) { cost.textContent = `${project.cost}`  }
        if (finishDate) { finishDate.textContent = new Date(project.FinishDate).toDateString()}
        if (progress) { progress.textContent = `${project.progress}` } //to be modified later
    }

    getProject(id: string) {
        const project = this.list.find((project) => {
            return project.id === id
        })
        return project
    }
    getProjectByName(name: string) {
        const project = this.list.find((project) => {
            return project.Name === name
        })
        return project
    }

    deletProject(id: string) {
        const project = this.getProject(id)
        if (!project) { return }
        project.ui.remove()
        const remaining = this.list.filter((project) => {
            return project.id !== id
        })

        this.list = remaining
    }

    totalProjectCost() {
        const totalCost: number = this.list.reduce(
            (sumOfCost, currentProject) => sumOfCost + currentProject.cost,
            0,
        )
        return totalCost
    }

    exportToJSON(fileName: string = "projects") {

        function replacer(key, value) {
            // Filtering out properties
            if (key === "ui") {
                return undefined;
            }
            return value;
        }

        const json = JSON.stringify(this.list, replacer, 2)
        const blob = new Blob([json], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        a.click()
        URL.revokeObjectURL(url)
    }
    importFromJSON() {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'application/json'
        const reader = new FileReader()
        reader.addEventListener("load", () => {
            const json = reader.result
            if (!json) { return }
            const projects: IProject[] = JSON.parse(json as string)
            for (const project of projects) {
                try {
                    this.newProject(project)
                } catch (error) {

                }
            }

        })
        input.addEventListener('change', () => {
            const filesList = input.files
            if (!filesList) { return }
            reader.readAsText(filesList[0])
        })
        input.click()
    }
}   