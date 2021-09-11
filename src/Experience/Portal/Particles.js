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
        this.debug = this.experience.debug
        this.resources = this.experience.resources
        this.scene = this.experience.scene

        this.count = 2000

        if(this.debug)
        {
            this.debugFolder = this.debug.addFolder({
                title: 'particles'
            })
        }

        this.setFlowfield()
        this.setGeometry()
        this.setColor()
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

    setColor()
    {
        this.color = {}
        this.color.value = '#ff576c'
        this.color.instance = new THREE.Color(this.color.value)
        
        if(this.debug)
        {
            this.debugFolder
                .addInput(
                    this.color,
                    'value',
                    {
                        view: 'color'
                    }
                )
                .on('change', () =>
                {
                    this.color.instance.set(this.color.value)
                })
        }
    }

    setMaterial()
    {
        this.material = new THREE.ShaderMaterial({
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            uniforms:
            {
                uColor: { value: this.color.instance },
                uSize: { value: 70 },
                uMaskTexture: { value: this.resources.items.particleMaskTexture },
                uFBOTexture: { value: this.flowField.texture }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        })
        
        
        if(this.debug)
        {
            this.debugFolder
                .addInput(
                    this.material.uniforms.uSize,
                    'value',
                    { label: 'uSize', min: 1, max: 100, step: 1 }
                )
                .on('change', () =>
                {
                    this.color.instance.set(this.color.value)
                })
        }
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