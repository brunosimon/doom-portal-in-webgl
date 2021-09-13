import Particles from './Particles.js'
import Halo from './Halo.js'
import Smoke from './Smoke.js'

export default class Portal
{
    constructor()
    {
        this.setParticles()
        this.setHalo()
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

    setSmoke()
    {
        this.smoke = new Smoke()
    }

    update()
    {
        this.particles.update()
        this.halo.update()
        this.smoke.update()
    }
}