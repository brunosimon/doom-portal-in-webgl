import Particles from './Particles.js'
import Halo from './Halo.js'

export default class Portal
{
    constructor()
    {
        this.setParticles()
        this.setHalo()
    }

    setParticles()
    {
        this.particles = new Particles()
    }

    setHalo()
    {
        this.halo = new Halo()
    }

    update()
    {
        this.particles.update()
        this.halo.update()
    }
}