import * as THREE from 'three'

import Experience from '../Experience.js'
import vertexShader from '../shaders/portalEventHorizon/vertex.glsl'
import fragmentShader from '../shaders/portalEventHorizon/fragment.glsl'

export default class EventHorizon
{
    constructor()
    {
        this.experience = new Experience()
        this.debug = this.experience.debug
        this.resources = this.experience.resources
        this.scene = this.experience.scene
        this.time = this.experience.time

        if(this.debug)
        {
            this.debugFolder = this.debug.addFolder({
                title: 'eventHorizon'
            })
        }

        this.setColors()
        this.setGeometry()
        this.setMaterial()
        this.setMesh()
    }

    setColors()
    {
        this.colors = {}
        
        this.colors.start = {}
        this.colors.start.value = '#ff3300'
        this.colors.start.instance = new THREE.Color(this.colors.start.value)
        
        this.colors.end = {}
        this.colors.end.value = '#ffda79'
        this.colors.end.instance = new THREE.Color(this.colors.end.value)
        
        if(this.debug)
        {
            for(const _colorName in this.colors)
            {
                const color = this.colors[_colorName]

                this.debugFolder
                    .addInput(
                        color,
                        'value',
                        {
                            label: _colorName, view: 'color'
                        }
                    )
                    .on('change', () =>
                    {
                        color.instance.set(color.value)
                    })
            }
        }
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
            // depthWrite: false,
            uniforms:
            {
                uTime: { value: 0 },
                uColorStart: { value: this.colors.start.instance },
                uColorEnd: { value: this.colors.end.instance }
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