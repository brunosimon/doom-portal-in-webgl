import * as THREE from 'three'

import Experience from '../Experience.js'
import vertexShader from '../shaders/portalEventHorizon/vertex.glsl'
import fragmentShader from '../shaders/portalEventHorizon/fragment.glsl'

export default class EventHorizon
{
    constructor(_options)
    {
        this.experience = new Experience()
        this.debug = this.experience.debug
        this.resources = this.experience.resources
        this.scene = this.experience.scene
        this.time = this.experience.time
        
        this.debug = _options.debugFolder
        this.colors = _options.colors

        // if(this.debug)
        // {
        //     this.debugFolder = this.debug.addFolder({
        //         title: 'eventHorizon'
        //     })
        // }

        this.setGeometry()
        this.setMaterial()
        this.setMesh()
    }

    setGeometry()
    {
        this.geometry = new THREE.PlaneGeometry(3, 3, 1, 1)
    }

    setMaterial()
    {
        this.material = new THREE.ShaderMaterial({
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
            // depthWrite: false,
            uniforms:
            {
                uTime: { value: 0 },
                uColorStart: { value: this.colors.b.instance },
                uColorEnd: { value: this.colors.c.instance }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        })
    }

    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.scene.add(this.mesh)
    }

    update()
    {
        this.material.uniforms.uTime.value = this.time.elapsed
    }
}