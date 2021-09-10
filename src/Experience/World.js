import * as THREE from 'three'
import Experience from './Experience.js'
import Portal from './Portal/Portal.js'

export default class World
{
    constructor(_options)
    {
        this.experience = new Experience()
        this.config = this.experience.config
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        
        this.resources.on('groupEnd', (_group) =>
        {
            if(_group.name === 'base')
            {
                this.setPortal()
            }
        })
    }

    setPortal()
    {
        this.portal = new Portal()
    }

    resize()
    {
    }

    update()
    {
        if(this.portal)
            this.portal.update()
    }

    destroy()
    {
    }
}