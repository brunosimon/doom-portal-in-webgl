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
        this.setDoomGuy()
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

        this.floor.clean = false

        // Geometry
        this.floor.geometry = new THREE.PlaneGeometry(10, 10, 500, 500)
        this.floor.geometry.rotateX(- Math.PI * 0.5)
        this.floor.geometry.attributes.uv2 = this.floor.geometry.attributes.uv

        this.floor.normalScale = 1

        // Material
        this.floor.material = new THREE.MeshStandardMaterial({
            map: this.textures.color,
            normalMap: this.textures.normal,
            normalScale: new THREE.Vector2(this.floor.normalScale, this.floor.normalScale),
            displacementMap: this.textures.displacement,
            displacementScale: 0.1,
            roughnessMap: this.textures.roughness,
            roughness: 1
        })

        this.floor.material.onBeforeCompile = (_shader) =>
        {
            _shader.fragmentShader = _shader.fragmentShader.replace(
                'gl_FragColor = vec4(',
                `
                    float fadeOut = length(vUv - ${(0.5 * this.textures.repeatCount).toFixed(2)});
                    fadeOut -= 0.6;
                    fadeOut *= 3.0;
                    fadeOut = smoothstep(0.0, 1.0, fadeOut);
                    outgoingLight = mix(outgoingLight, vec3(0.0), fadeOut);
                    // outgoingLight = vec3(fadeOut);
                    gl_FragColor = vec4(
                `
            )
        }

        // Mesh
        this.floor.mesh = new THREE.Mesh(this.floor.geometry, this.floor.material)
        this.floor.mesh.position.y = - 0.95
        this.scene.add(this.floor.mesh)

        if(this.debug)
        {
            this.floor.debugFolder = this.debugFolder.addFolder({
                title: 'floor'
            })

            this.floor.debugFolder
                .addInput(
                    this.floor.material,
                    'displacementScale',
                    {
                        min: 0, max: 1, step: 0.001
                    }
                )

            this.floor.debugFolder
                .addInput(
                    this.floor.material,
                    'wireframe'
                )

            this.floor.debugFolder
                .addInput(
                    this.floor,
                    'normalScale',
                    {
                        min: 0, max: 2, step: 0.001
                    }
                )
                .on('change', () =>
                {
                    this.floor.material.normalScale.set(this.floor.normalScale, this.floor.normalScale)
                })

            this.floor.debugFolder
                .addInput(
                    this.floor.material,
                    'roughness',
                    {
                        min: 0, max: 5, step: 0.001
                    }
                )

            this.floor.debugFolder
                .addInput(
                    this.floor.mesh.position,
                    'y',
                    {
                        min: - 2, max: 0, step: 0.001
                    }
                )

            this.floor.debugFolder
                .addInput(
                    this.floor,
                    'clean'
                )
                .on('change', () =>
                {
                    if(this.floor.clean)
                    {
                        this.floor.material.map = null
                        this.floor.material.normalMap = null
                        this.floor.material.displacementMap = null
                    }
                    else
                    {
                        this.floor.material.map = this.textures.color
                        this.floor.material.normalMap = this.textures.normal
                        this.floor.material.displacementMap = this.textures.displacement
                    }

                    this.floor.material.needsUpdate = true
                })
        }
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

        this.lights.items.a.instance = new THREE.PointLight(this.lights.items.a.color, 6)
        this.lights.items.a.instance.rotation.y = Math.PI
        this.lights.items.a.instance.position.y = - 0.5
        this.lights.items.a.instance.position.z = - 2.001
        this.scene.add(this.lights.items.a.instance)

        // this.lights.items.a.helper = new RectAreaLightHelper(this.lights.items.a.instance)
        // this.lights.items.a.helper.visible = false
        // this.scene.add(this.lights.items.a.helper)
        
        // B light
        this.lights.items.b = {}

        this.lights.items.b.color = '#0059ff'

        this.lights.items.b.instance = new THREE.PointLight(this.lights.items.b.color, 6)
        this.lights.items.b.instance.position.y = - 0.5
        this.lights.items.b.instance.position.z = 2.001
        this.scene.add(this.lights.items.b.instance)

        // this.lights.items.b.helper = new RectAreaLightHelper(this.lights.items.b.instance)
        // this.lights.items.b.helper.visible = false
        // this.scene.add(this.lights.items.b.helper)
        
        if(this.debug)
        {
            for(const _lightName in this.lights.items)
            {
                const light = this.lights.items[_lightName]

                this.lights.debugFolder
                    .addInput(
                        light.instance.position,
                        'y',
                        {
                            label: `${_lightName}Y`, min: - 2, max: 2, step: 0.001
                        }
                    )

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

                // this.lights.debugFolder
                //     .addInput(
                //         light.instance,
                //         'width',
                //         {
                //             label: `${_lightName}Width`, min: 0, max: 5, step: 0.01
                //         }
                //     )

                // this.lights.debugFolder
                //     .addInput(
                //         light.instance,
                //         'height',
                //         {
                //             label: `${_lightName}height`, min: 0, max: 5, step: 0.01
                //         }
                //     )

                // this.lights.debugFolder
                //     .addInput(
                //         light.helper,
                //         'visible',
                //         {
                //             label: `${_lightName}HelperVisible`
                //         }
                //     )
            }
        }
    }

    setDoomGuy()
    {
        this.doomGuy = {}

        this.doomGuy.model = this.resources.items.doomGuyModel.scene
        this.doomGuy.model.scale.set(0.017, 0.017, 0.017)

        this.doomGuy.model.position.y = - 0.93
        this.doomGuy.model.rotation.y = 1.981

        this.scene.add(this.doomGuy.model)
        
        if(this.debug)
        {
            this.doomGuy.debugFolder = this.debugFolder.addFolder({
                title: 'doomGuy'
            })

            this.doomGuy.debugFolder
                .addInput(
                    this.doomGuy.model.position,
                    'y',
                    {
                        min: - 2, max: 0, step: 0.001
                    }
                )

            this.doomGuy.debugFolder
                .addInput(
                    this.doomGuy.model.rotation,
                    'y',
                    {
                        min: - Math.PI, max: Math.PI, step: 0.001
                    }
                )
        }
    }
}