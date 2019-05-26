import * as THREE from 'three'
import {scene,initScene} from './initScene.js'
import {Car} from './Car.js'
import OrbitControl from 'three-orbitcontrols'
import io from 'socket.io-client'
import $ from 'jquery'

var renderer, camera, controls, cameraHUD, car;
var socket = io(), ID;
var Cars = [], step, clock;

$(function(){
    socket.on('new_user',(data) => {
        Cars.push(new Car(data.pos,data.rot));
    })
})
$("#stepB").on('mousedown', function(e) {
    console.log('mouse down')
    step = true;
    $(this).css("background-color", "yellow");
  }).on('mouseup', function(e) {
    console.log('mouse up')
    step = false;
    $(this).css("background-color", "white");
  });

init();
animate();

function init(){
    initScene();
    
    clock = new THREE.Clock();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.setClearColor(0x888888);
    document.body.appendChild(renderer.domElement);
    renderer.autoClear = false;

    camera = new THREE.PerspectiveCamera(35,window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(-50,20,0);
    camera.lookAt(new THREE.Vector3());

    cameraHUD = new THREE.PerspectiveCamera(35,window.innerWidth / window.innerHeight, 1, 1000);
    cameraHUD.position.set(0,400,0);
    cameraHUD.lookAt(new THREE.Vector3());

    //controls = new OrbitControl(camera,renderer.domElement);

    scene.add(new THREE.GridHelper(500,50,'red','white'), new THREE.AmbientLight(0x888888));

    socket.emit('init',{},(data) => {
        ID = data.ID;
        data.CarData.forEach((e) => {
           if(e.ID === ID){
               Cars.push(new Car(e.pos,e.rot,camera));
           }
           else Cars.push(new Car(e.pos,e.rot));
        }) 
    });
}

function animate(){
    if(Cars[ID]){
        var dt = clock.getDelta();
        Cars[ID].update(dt,step);
        let now = Cars[ID].body;

        socket.emit('update',{
            ID: ID,
            pos: {x: now.position.x, y: now.position.y, z: now.position.z},
            rot: now.rotation.y
        },(data) => {
            data.forEach((e) => {
                if(e.ID !== ID){
                    Cars[e.ID].body.position.x = e.pos.x;
                    Cars[e.ID].body.position.y = e.pos.y;
                    Cars[e.ID].body.position.z = e.pos.z;
                    Cars[e.ID].body.rotation.y = e.rot;
                }
            })
        })
    }

    requestAnimationFrame(animate);
    render();
}

function render(){

    var ww = window.innerWidth;
    var hh = window.innerHeight

    renderer.setScissorTest(true);

    renderer.setViewport(0, 0, ww, hh);
    renderer.setScissor(0, 0, ww, hh);
    renderer.clear();
    renderer.render(scene,camera);


    renderer.setViewport(ww / 3 * 2, 0, ww / 3, hh / 3);
    renderer.setScissor(ww / 3 * 2, 0, ww / 3, hh / 3);
    renderer.clear();
    renderer.render(scene,cameraHUD);
    
    renderer.setScissorTest(false);
}