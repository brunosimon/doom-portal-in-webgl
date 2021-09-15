import * as THREE from 'three'

import Experience from '../Experience.js'
import Particles from './Particles.js'
import Halo from './Halo.js'
import EventHorizon from './EventHorizon.js'
import Smoke from './Smoke.js'

export default class Portal
{
    constructor()
    {
        this.experience = new Experience()
        this.debug = this.experience.debug
        this.scene = this.experience.scene

        if(this.debug)
        {
            this.debugFolder = this.debug.addFolder({
                title: 'portal'
            })
        }

        this.group = new THREE.Group()
        this.scene.add(this.group)

        this.setParticles()
        this.setHalo()
        this.setEventHorizon()
        this.setSmoke()
    }

    setParticles()
    {
        this.particles = new Particles({ debugFolder: this.debugFolder })
        this.group.add(this.particles.points)
    }

    setHalo()
    {
        this.halo = new Halo({ debugFolder: this.debugFolder })
        this.group.add(this.halo.mesh)
    }

    setEventHorizon()
    {
        this.eventHorizon = new EventHorizon({ debugFolder: this.debugFolder })
        this.group.add(this.eventHorizon.mesh)
    }

    setSmoke()
    {
        this.smoke = new Smoke({ debugFolder: this.debugFolder })
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