import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Debug
 */
const gui = new dat.GUI()

const parameters = {
    materialColor: '#ffeded'
}

gui
    .addColor(parameters, 'materialColor')
    .onChange(() => {
        material.color.set(parameters.materialColor)
    })

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Imported Models
 */
const gltfLoader = new GLTFLoader()
console.log(gltfLoader)

gltfLoader.load(
    '/models/TestModel.glb',
    (gltf)=>{
        scene.add(gltf.scene)
    }
)

/**
 * Texture
 */
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('textures/gradients/3.jpg')
gradientTexture.magFilter = THREE.NearestFilter

/**
 * Material
 */

const material = new THREE.MeshPhysicalMaterial({color: parameters.materialColor})
/**
 * Objects
 */
const objectDistance = 4
const mesh1 = new THREE.Mesh(
    new THREE.TorusBufferGeometry(1,0.4,16,60),
    material
)

const mesh2 = new THREE.Mesh(
    new THREE.ConeBufferGeometry(1,2,32),
    material
)

const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotBufferGeometry(0.8,0.35,100,16),
    material
)

mesh1.position.y = -objectDistance *0
mesh2.position.y = -objectDistance *1
mesh3.position.y = -objectDistance *2

mesh1.position.x = 2
mesh2.position.x = -2
mesh3.position.x = 2

scene.add(mesh1,mesh2,mesh3)

const sectionMeshes = [mesh1,mesh2,mesh3]

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(1,1,0)
scene.add(directionalLight)

const ambientLight = new THREE.AmbientLight(0xffffff,1)
scene.add(ambientLight)


/**
* Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */

//Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha : true
})
renderer.setClearColor(0xffff00,.0)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


/**
 * Scroll
 */

let scrollY = window.scrollY

window.addEventListener('scroll', () =>{
    scrollY = window.scrollY
})

/**
 * Cursor
 */
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) =>{
    cursor.x = event.clientX / sizes.width -0.5
    cursor.y = event.clientY / sizes.height - 0.5
    //console.log(cursor.y)
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0



const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    //Animate Camera
    camera.position.y = - scrollY / sizes.height * objectDistance

    const parallaxX = cursor.x *0.5
    const parallaxY = -cursor.y *0.5
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) *5 *deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) *5 *deltaTime
    //Animate meshes
    for (const mesh of sectionMeshes){
        mesh.rotation.x = elapsedTime *0.1
        mesh.rotation.y = elapsedTime *0.12
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()