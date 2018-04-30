import aframe from '../../aframe/aframe.js';
import 'three.ar.js'
import 'aframe-ar'
import '../../public/temp/polygon.js'
import {Entity, Scene} from 'aframe-react';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';


class ArView extends React.Component {
  constructor () {
    super()
    this.state = {
      clicked: false
    }
    this.showHUD = this.showHUD.bind(this);
    this.raycasterIntersection = this.raycasterIntersection.bind(this);
    this.onSceneLoaded = this.onSceneLoaded.bind(this);
    this.callback = this.callback.bind(this);
  }

  showHUD (msg) {
    this.sc.querySelector('#hud').setAttribute('value', msg);
  }

  raycasterIntersection (evt) {
    //var raycaster = this.sc.querySelector('[ar-raycaster]');
    console.log(evt)
    // Note, -intersection is what the raycaster gets; the hit object gets -intersected.
    var placering = document.getElementById('placering')
    // Use first hit (which should be nearest).
    var point = evt.detail.intersections[0].point;
    if (this.state.clicked) {
      this.showHUD('Touch to move item')
    } else {
      this.showHUD('Touch to place item');
    }
    placering.setAttribute('position', point);
    placering.setAttribute('visible', true);
    
  }

  // addARRaycasterListeners() {
  //   var raycaster = this.sc.querySelector('[ar-raycaster]');
  //   console.log(raycaster)
  //   // Note, -intersection is what the raycaster gets; the hit object gets -intersected.
  //   var placering = document.getElementById('placering')
  //   raycaster.addEventListener('raycaster-intersection', function (evt) {
  //     // Use first hit (which should be nearest).
  //     var point = evt.detail.intersections[0].point;
  //     if (this.state.clicked) {
  //       this.showHUD('Touch to move item')
  //     } else {
  //       this.showHUD('Touch to place item');
  //     }
  //     placering.setAttribute('position', point);
  //     placering.setAttribute('visible', true);
  //   });

  //   raycaster.addEventListener('raycaster-intersection-cleared', function (evt) {
  //     this.showHUD('Please point device at a flat surface');
  //     placering.setAttribute('visible', false);
  //   });
  // }

  onSceneLoaded() {
    this.sc.querySelector('[ar-raycaster]').emit('raycaster-intersection')
    console.log('LOADED FROM CALLBACK')
    var tempPos = new THREE.Vector3();
    var tempQuat = new THREE.Quaternion();
    var tempScale = new THREE.Vector3();
    var tempEuler = new THREE.Euler(0, 0, 0, 'YXZ');
    var tempMat4 = new THREE.Matrix4();

    
    window.addEventListener('click', function() {
      // If the cursor has an intersection, place a marker.
      this.clicked = true;
      var cursor = this.sc.querySelector('[ar-raycaster]').components.cursor;
      if (cursor.intersection) {
        var obj = document.getElementById('f4uModel')
        if (obj) {
          obj.setAttribute('position', {
          x: cursor.intersection.point.x, 
          y: cursor.intersection.point.y + .09,  //+ 0.5, 
          z: cursor.intersection.point.z});
        } else {
          var newObj = document.createElement('a-entity');
          newObj.setAttribute('gltf-model', 'url(../../public/models/f4u/scene.gltf)')
          newObj.setAttribute('scale', '0.05 0.05 0.05')
          newObj.setAttribute('id', 'f4uModel')
          newObj.setAttribute('position', {
          x: cursor.intersection.point.x, 
          y: cursor.intersection.point.y + .09,  //+ 0.5, 
          z: cursor.intersection.point.z});
          this.sc.appendChild(newObj);         
        }
      }
    });

    //this.addARRaycasterListeners();
  }

  callback (scene) {
    this.sc = scene;
    console.log(this.sc)
    if (this.sc.hasLoaded) {
      this.onSceneLoaded()
    } else {
      this.sc.addEventListener('loaded', this.onSceneLoaded)
    }
  }

  render () {
    return (
      <Scene ar _ref={this.callback}>
        {/* <Entity >
          <a-asset-item id="f4u" src="models/f4u/scene.gltf"></a-asset-item>
        </Entity> */}
        <Entity
          id="placering"
          material="color: #00FF00; shader: flat"
          geometry="primitive: ring; radiusInner: 0.04; radiusOuter: .05; segments-phi: 10; segments-theta: 60"
          rotation="-90 0 0"
          visible="false"
        />
        <Entity primitive="a-camera" >
          <Entity id="ar-world" />
          <Entity
            cursor="fuse:false"
            raycaster="objects:.plane;recursive:false"
            ar-raycaster="el:#ar-world"
            events={{
              'raycaster-intersection': this.raycasterIntersection
            }}
          />
          <Entity
            primitive="a-text"
            id="hud"
            scale="0.015 0.015 0.015"
            position="0 -0.05 -0.1"
            color="white"
            align="center"
            value="Looking for plane"
          />
        </Entity>
      </Scene>
    )
  }
} 

//ReactDOM.render(<ArView />, document.querySelector('#app'))
//export default ArView