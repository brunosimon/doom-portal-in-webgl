import Particles from './Particles.js'
import Halo from './Halo.js'
import EventHorizon from './EventHorizon.js'
import Smoke from './Smoke.js'

export default class Portal
{
    constructor()
    {
        this.setParticles()
        this.setHalo()
        this.setEventHorizon()
        this.setSmoke()
    }

    setParticles()
    {
        this.particles = new Particles()
    }

    setHalo()
    {
        this.halo = new Halo()
    }

    setEventHorizon()
    {
        this.eventHorizon = new EventHorizon()
    }

    setSmoke()
    {
        this.smoke = new Smoke()
    }

    update()
    {
        this.particles.update()
        this.halo.update()
        this.eventHorizon.update()
        this.smoke.update()
    }
}