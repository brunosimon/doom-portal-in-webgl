import * as THREE from 'three'

import Experience from '../Experience.js'
import Particles from './Particles.js'
import Halo from './Halo.js'
import EventHorizon from './EventHorizon.js'
import Smoke from './Smoke.js'

export default class Portal
{
    constructor(_options)
    {
        this.experience = new Experience()
        this.debug = this.experience.debug
        this.scene = this.experience.scene

        this.colorsSetting = _options.colors

        if(this.debug)
        {
            this.debugFolder = this.debug.addFolder({
                title: 'portal'
            })
        }

        this.group = new THREE.Group()
        this.scene.add(this.group)

        this.setColors()
        this.setParticles()
        this.setHalo()
        this.setEventHorizon()
        this.setSmoke()
    }

    setColors()
    {
        this.colors = {}

        for(let _colorName in this.colorsSetting)
        {
            const color = {}
            color.value = this.colorsSetting[_colorName]
            color.instance = new THREE.Color(color.value)
            
            this.colors[_colorName] = color
        }
        
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

    setParticles()
    {
        this.particles = new Particles({ debugFolder: this.debugFolder, colors: this.colors })
        this.group.add(this.particles.points)
    }

    setHalo()
    {
        this.halo = new Halo({ debugFolder: this.debugFolder, colors: this.colors })
        this.group.add(this.halo.mesh)
    }

    setEventHorizon()
    {
        this.eventHorizon = new EventHorizon({ debugFolder: this.debugFolder, colors: this.colors })
        this.group.add(this.eventHorizon.mesh)
    }

    setSmoke()
    {
        this.smoke = new Smoke({ debugFolder: this.debugFolder, colors: this.colors })
        this.group.add(this.smoke.group)
    }

    update()
    {
        this.particles.update()
        this.halo.update()
        this.eventHorizon.update()
        this.smoke.update()
    }
}