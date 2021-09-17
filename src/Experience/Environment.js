import * as THREE from 'three'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'

import Experience from './Experience.js'

export default class Environment
{
    constructor(_options)
    {
        this.experience = new Experience()
        this.debug = this.experience.debug
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        if(this.debug)
        {
            this.debugFolder = this.debug.addFolder({
                title: 'environment'
            })
        }

        this.setTextures()
        this.setFloor()
        this.setLights()
    }
    
    setTextures()
    {
        this.textures = {}

        this.textures.repeatCount = 2

        this.textures.color = this.resources.items.floorColorTexture
        this.textures.color.encoding = THREE.sRGBEncoding
        this.textures.color.wrapS = THREE.RepeatWrapping
        this.textures.color.wrapT = THREE.RepeatWrapping
        this.textures.color.repeat.set(this.textures.repeatCount, this.textures.repeatCount)

        this.textures.ambientOcclusion = this.resources.items.floorAmbientOcclusionTexture
        this.textures.ambientOcclusion.wrapS = THREE.RepeatWrapping
        this.textures.ambientOcclusion.wrapT = THREE.RepeatWrapping
        this.textures.ambientOcclusion.repeat.set(this.textures.repeatCount, this.textures.repeatCount)

        this.textures.normal = this.resources.items.floorNormalTexture
        this.textures.normal.wrapS = THREE.RepeatWrapping
        this.textures.normal.wrapT = THREE.RepeatWrapping
        this.textures.normal.repeat.set(this.textures.repeatCount, this.textures.repeatCount)

        this.textures.displacement = this.resources.items.floorDisplacementTexture
        this.textures.displacement.wrapS = THREE.RepeatWrapping
        this.textures.displacement.wrapT = THREE.RepeatWrapping
        this.textures.displacement.repeat.set(this.textures.repeatCount, this.textures.repeatCount)

        this.textures.roughness = this.resources.items.floorRoughnessTexture
        this.textures.roughness.wrapS = THREE.RepeatWrapping
        this.textures.roughness.wrapT = THREE.RepeatWrapping
        this.textures.roughness.repeat.set(this.textures.repeatCount, this.textures.repeatCount)
    }

    setFloor()
    {
        this.floor = {}

        this.floor.geometry = new THREE.PlaneGeometry(10, 10, 500, 500)
        this.floor.geometry.rotateX(- Math.PI * 0.5)
        this.floor.geometry.setAttribute('uv2', new THREE.BufferAttribute(this.floor.geometry.attributes.uv.array, 2))

        this.floor.material = new THREE.MeshStandardMaterial({
            map: this.textures.color,
            normalMap: this.textures.normal,
            normalScale: new THREE.Vector2(0.2, 0.2),
            displacementMap: this.textures.displacement,
            displacementScale: 0.1,
            roughnessMap: this.textures.roughness,
            roughness: 10
            // aoMap: this.textures.ambientOcclusion,
            // aoMapIntensity: 1000
        })
        
        this.floor.mesh = new THREE.Mesh(this.floor.geometry, this.floor.material)
        this.floor.mesh.position.y = - 0.9
        this.scene.add(this.floor.mesh)
    }

    setLights()
    {
        this.lights = {}

        // Debug
        if(this.debug)
        {
            this.lights.debugFolder = this.debug.addFolder({
                title: 'lights'
            })
        }

        this.lights.items = {}
        
        // A light
        this.lights.items.a = {}

        this.lights.items.a.color = '#ff0a00'

        this.lights.items.a.instance = new THREE.RectAreaLight(this.lights.items.a.color, 10, 1.03, 2)
        this.lights.items.a.instance.rotation.y = Math.PI
        this.lights.items.a.instance.position.z = - 2.001
        this.scene.add(this.lights.items.a.instance)

        this.lights.items.a.helper = new RectAreaLightHelper(this.lights.items.a.instance)
        this.lights.items.a.helper.visible = false
        this.scene.add(this.lights.items.a.helper)
        
        // B light
        this.lights.items.b = {}

        this.lights.items.b.color = '#0059ff'

        this.lights.items.b.instance = new THREE.RectAreaLight(this.lights.items.b.color, 10, 1.03, 2)
        this.lights.items.b.instance.position.z = 2.001
        this.scene.add(this.lights.items.b.instance)

        this.lights.items.b.helper = new RectAreaLightHelper(this.lights.items.b.instance)
        this.lights.items.b.helper.visible = false
        this.scene.add(this.lights.items.b.helper)
        
        if(this.debug)
        {
            for(const _lightName in this.lights.items)
            {
                const light = this.lights.items[_lightName]

                this.lights.debugFolder
                    .addInput(
                        light,
                        'color',
                        {
                            label: `${_lightName}Color`, view: 'color'
                        }
                    )
                    .on('change', () =>
                    {
                        light.instance.color.set(light.color)
                    })

                this.lights.debugFolder
                    .addInput(
                        light.instance,
                        'intensity',
                        {
                            label: `${_lightName}Intensity`, min: 0, max: 20, step: 0.01
                        }
                    )

                this.lights.debugFolder
                    .addInput(
                        light.instance,
                        'width',
                        {
                            label: `${_lightName}Width`, min: 0, max: 5, step: 0.01
                        }
                    )

                this.lights.debugFolder
                    .addInput(
                        light.instance,
                        'height',
                        {
                            label: `${_lightName}height`, min: 0, max: 5, step: 0.01
                        }
                    )

                this.lights.debugFolder
                    .addInput(
                        light.helper,
                        'visible',
                        {
                            label: `${_lightName}HelperVisible`
                        }
                    )
            }
        }
    }
}