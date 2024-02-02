import * as THREE from "three"
import {GUI} from "three/examples/jsm/libs/lil-gui.module.min"
import{OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import { IProject, projectStatus, projectType } from "./classes/Project"
import { ProjectsManager } from "./classes/ProjectsManager"
import { transform } from "esbuild"
// import { ProjectdetailsManager } from "./classes/ProjectsManager"
/* const   showModal = () =>{
    const modal = document.getElementById("new-project-modal")
    modal.showModal()
}                       OR another example below
 */
function showModal(id: string) {
  const modal = document.getElementById(id)
  //if modal exists and is of type dialog then only showModal func will run to prevent app from breaking.
  if (modal && modal instanceof HTMLDialogElement) {
    modal.showModal()
    // console.log("showModal is called")
  } else {
    console.warn("modal not found. ID ", id)
  }
}
function closeModal(id: string) {
  const modal = document.getElementById(id)
  //if modal exists and is of type dialog then only showModal func will run to prevent app from breaking.
  if (modal && modal instanceof HTMLDialogElement) {
    modal.close()
    // console.log("closeModal is called")
  } else {
    console.warn("modal not found. ID ", id)
  }
}
const projectsListUI = document.getElementById("projects-list") as HTMLElement
const projectsManager = new ProjectsManager(projectsListUI)

// Function to open project creation form
const newProjectBtn = document.getElementById("new-project-btn")
if (newProjectBtn) {
  newProjectBtn.addEventListener("click", () => {
    showModal("new-project-modal")
    const defaultProject = document.getElementById("default-card") as HTMLElement // this is used to hide the default project card
  })
}
else {
  console.warn("New Project button not found")
}
/* let projectDetails = {
    Name: "",
    Description: "",
    Type: "",
    Status: "",
    FinishDate: "" 
};  part of code comment from line 41-51*/
const projectForm = document.getElementById("new-project-form")
if (projectForm && projectForm instanceof HTMLFormElement) {
  projectForm.addEventListener("submit", (e) => { // e is an argument which act as an object which can be used to call functions
    e.preventDefault()
    const formData = new FormData(projectForm)
    const nameInUse = document.getElementById("nameInUse") as HTMLElement
    const nameTip = document.getElementById("nameTip") as HTMLElement
    const nameIsShort = document.getElementById("nameIsShort") as HTMLElement
    /* console.log("Name : ",formData.get("projectName"))
    console.log("Description : ",formData.get("projectDesc"))
    console.log("Type : ",formData.get("projectType"))
    console.log("Status : ",formData.get("projectStatus"))
    console.log("Finish Date : ",formData.get("projectDate"))
    projectDetails.Name = formData.get("projectName")
    projectDetails.Description = formData.get("projectDesc")
    projectDetails.Type = formData.get("projectType")
    projectDetails.Status = formData.get("projectStatus")
    projectDetails.FinishDate = formData.get("projectDate")  this is what I did as challenge of last class*/
    const projectData: IProject = {
      Name: formData.get("projectName") as string,
      Description: formData.get("projectDesc") as string,
      Type: formData.get("projectType") as projectType,
      Status: formData.get("projectStatus") as projectStatus,
      FinishDate: new Date(formData.get("projectDate") as string)
    }

    try {
      const project = projectsManager.newProject(projectData)
      nameTip.style.display = "grid";
      nameInUse.style.display = "none";
      nameIsShort.style.display = "none";
      projectForm.reset()
      closeModal("new-project-modal")
    } catch (err) {
      if (err.message == "nameInUse") {
        nameInUse.innerHTML = `Name "${projectData.Name}" is alredy in use`
        nameTip.style.display = "none";
        nameInUse.style.display = "grid";
      } else if (err.message == "nameIsShort") {
        nameIsShort.innerHTML = `Name "${projectData.Name}" is very short. Should be at least 5 characters`
        nameTip.style.display = "none";
        nameIsShort.style.display = "grid";
      }
    }
  }
  )
  // When cancel button is pressed it is still working as submit for form. How to solve this?
} else {
  console.warn("No project form found.")
}
const exportProjectsBtn = document.getElementById("export-projects-btn")
if (exportProjectsBtn) {
  exportProjectsBtn.addEventListener("click", () => {
    projectsManager.exportToJSON()
  })
}
const importProjectsBtn = document.getElementById("import-projects-btn")
if (importProjectsBtn) {
  importProjectsBtn.addEventListener("click", () => {
    projectsManager.importFromJSON()
  })
}
const editProjectsBtn = document.getElementById("edit-projects-btn")
if (editProjectsBtn) {
  editProjectsBtn.addEventListener("click", () => {
    const form = document.getElementById("edit-project-form")
    showModal("edit-project-modal")
    projectsManager.setupEditProjectModal()
    // const currentProject = projectsManager.editProject()
    // console.log(form)
    // console.log(currentProject)


  })
}

const projectsBtn = document.getElementById("projects-btn")
projectsBtn?.addEventListener("click", () => {
  const projectsPage = document.getElementById("projects-page") as HTMLElement
  const detailsPage = document.getElementById("project-details") as HTMLElement
  if (!(projectsPage && detailsPage)) return
  projectsPage.style.display = "flex"
  detailsPage.style.display = "none"
})

/* //Three.JS viewer

const scene = new THREE.Scene()

const viewerContainer = document.getElementById("viewer-container") as HTMLElement
const containerDimensions = viewerContainer.getBoundingClientRect()
const aspectRatio = containerDimensions.width / containerDimensions.height
const camera = new THREE.PerspectiveCamera(75, aspectRatio)
camera.position.z = 5

const renderer = new THREE.WebGLRenderer()
viewerContainer.append(renderer.domElement)
renderer.setSize(containerDimensions.width, containerDimensions.height)
// renderer.setSize(containerDimensions.width/2, containerDimensions.height/2)


const boxGeometry = new THREE.BoxGeometry()
const material = new THREE.MeshStandardMaterial()
const cube = new THREE.Mesh(boxGeometry, material)

const directionalLight = new THREE.DirectionalLight()
const ambientLight = new THREE.AmbientLight()

scene.add(cube, directionalLight, ambientLight)

renderer.render(scene, camera) */

//ThreeJS viewer
const scene = new THREE.Scene()

const viewerContainer = document.getElementById("viewer-container") as HTMLElement

const camera = new THREE.PerspectiveCamera(75)
camera.position.z = 5

const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true})
viewerContainer.append(renderer.domElement)

function resizeViewer(){
  const containerDimensions = viewerContainer.getBoundingClientRect()
  renderer.setSize(containerDimensions.width, containerDimensions.height)
  const aspectRatio = containerDimensions.width / containerDimensions.height
  camera.aspect = aspectRatio
  camera.updateProjectionMatrix()
}

window.addEventListener("resize", resizeViewer)
resizeViewer()

const boxGeometry = new THREE.BoxGeometry()
const material = new THREE.MeshStandardMaterial()
const cube = new THREE.Mesh(boxGeometry, material)

const directionalLight = new THREE.DirectionalLight()
const ambientLight = new THREE.AmbientLight()
ambientLight.intensity = 0.5 // To create shadow effect

scene.add(cube, directionalLight, ambientLight)

const cameraControl = new OrbitControls(camera, viewerContainer)

function renderScene(){ 
  directionalLightHelper.update()
  renderer.render(scene, camera)
  requestAnimationFrame(renderScene) //this is a global function to take snap of frame
  // console.log(directionalLightHelper.position.x)
} //this is an infinite loop to keep taking snaps as per user intraction


const axes = new THREE.AxesHelper()
const grid = new THREE.GridHelper()
grid.material.transparent = true
grid.material.opacity = 0.4
grid.material.color = new THREE.Color("#808080")
scene.add(axes,grid)

const gui = new GUI()
const  cubePosition= gui.addFolder("Cube position")

cubePosition.add(cube.position, "x", -5, 5, .5)
cubePosition.add(cube.position, "y", -5, 5, .5)
cubePosition.add(cube.position, "z", -5, 5, .5)

const cubeScale = gui.addFolder("Cube Scale")
cubeScale.add(cube.scale, "x", 1, 5, .5)
cubeScale.add(cube.scale, "y", 1, 5, .5)
cubeScale.add(cube.scale, "z", 1, 5, .5)

const cubeVisibility = gui.addFolder("Cube visibility")
cubeVisibility.add(cube, "visible")
cubeVisibility.addColor(cube.material, "color")
// cube.matrixAutoUpdate = false

const directionalLightHelper = new THREE.DirectionalLightHelper( directionalLight, 5 );
scene.add( directionalLightHelper );
cubeVisibility.add(directionalLight.position, "x", -5, 5, .5).name("Light-X")
cubeVisibility.add(directionalLight.position, "y", -5, 5, .5).name("Light-Y")
cubeVisibility.add(directionalLight.position, "z", -5, 5, .5).name("Light-Z")
cubeVisibility.add(directionalLight, "intensity", -10, 10, .5)
cubeVisibility.addColor(directionalLight, "color")
renderScene()