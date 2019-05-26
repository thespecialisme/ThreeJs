import * as THREE from 'three'
import {scene} from './initScene.js'

class Car{
    constructor(pos,rot,camera = undefined){
        this.body = this.buildBody();
        this.R = 80;
        this.omega = 0;
        this.theta = 0;

        if(camera !== undefined)
            this.body.add(camera);

        this.body.position.set(pos.x,pos.y,pos.z);
        this.body.rotation.y = rot;
        console.log(rot);

        scene.add(this.body);
    }

    buildBody(){
        var geometry = new THREE.Geometry();
        geometry.vertices.push(
            new THREE.Vector3(30, 0, 0),
            new THREE.Vector3(0, 0, 10),
            new THREE.Vector3(0, 0, -10),
            new THREE.Vector3(0, 10, 0)
        );

        var face;
        face = new THREE.Face3(0, 3, 1);
        geometry.faces.push(face);
        face = new THREE.Face3(0, 2, 3);
        geometry.faces.push(face);
        face = new THREE.Face3(0, 1, 2);
        geometry.faces.push(face);
        face = new THREE.Face3(1, 3, 2);
        geometry.faces.push(face);

        var body = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: 0x0000ff}));
        
        return body;
    }

    update(dt,step){
        this.theta += this.omega * dt;
        this.body.position.set(this.R * Math.cos(this.theta), 0, -this.R * Math.sin(this.theta))
        this.body.rotation.y += this.omega * dt;
        //console.log(omega);

        if (step) {
            this.omega += 0.1;
            if (this.omega > 4) this.omega = 4;
        } else {
            this.omega -= 0.02;
            if (this.omega < 0) this.omega = 0;
        }
    }
}

export {Car}