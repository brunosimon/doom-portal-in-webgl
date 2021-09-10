import * as THREE from 'three'

import Experience from '../Experience.js'
import FlowField from './FlowField.js'
import vertexShader from '../shaders/portalParticles/vertex.glsl'
import fragmentShader from '../shaders/portalParticles/fragment.glsl'

export default class Particles
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene

        this.count = 10000

        this.setFlowfield()
        this.setGeometry()
        this.setMaterial()
        this.setPoints()
    }

    setFlowfield()
    {
        this.flowField = new FlowField(this.count)
    }

    setGeometry()
    {
        const position = new Float32Array(this.count * 3)

        for(let i = 0; i < this.count; i++)
        {
            position[i * 3 + 0] = (Math.random() - 0.5) * 2
            position[i * 3 + 1] = (Math.random() - 0.5) * 2
            position[i * 3 + 2] = (Math.random() - 0.5) * 2
        }

        this.geometry = new THREE.BufferGeometry()
        this.geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))
        this.geometry.setAttribute('aFboUv', this.flowField.fboUv.attribute)
    }

    setMaterial()
    {
        this.material = new THREE.ShaderMaterial({
            uniforms:
            {
                uFBOTexture: { value: this.flowField.texture }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        })
    }

    setPoints()
    {
        this.points = new THREE.Points(this.geometry, this.material)
        this.scene.add(this.points)
    }

    update()
    {
        this.flowField.update()
        this.material.uniforms.uFBOTexture.value = this.flowField.texture
    }
}