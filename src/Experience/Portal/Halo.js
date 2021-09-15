import * as THREE from 'three'

import Experience from '../Experience.js'
import vertexShader from '../shaders/portalHalo/vertex.glsl'
import fragmentShader from '../shaders/portalHalo/fragment.glsl'

export default class Halo
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
                title: 'halo'
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
        
        this.colors.a = {}
        this.colors.a.value = '#130000'
        this.colors.a.instance = new THREE.Color(this.colors.a.value)
        
        this.colors.b = {}
        this.colors.b.value = '#ff000a'
        this.colors.b.instance = new THREE.Color(this.colors.b.value)
        
        this.colors.c = {}
        this.colors.c.value = '#ff661e'
        this.colors.c.instance = new THREE.Color(this.colors.c.value)
        
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
                uColorA: { value: this.colors.a.instance },
                uColorB: { value: this.colors.b.instance },
                uColorC: { value: this.colors.c.instance }
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