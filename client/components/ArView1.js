import aframe from '../../aframe/aframe.js';
import 'three.ar.js'
import 'aframe-ar'
import '../../public/temp/polygon.js'
import {Entity, Scene} from 'aframe-react';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class ArView extends React.Component {
  render () {
    var sc = document.querySelector('a-scene');
    var clicked = false

    function showHUD (msg) {
      sc.querySelector('#hud').setAttribute('value', msg);
    }

    function addARRaycasterListeners() {
      var raycaster = sc.querySelector('[ar-raycaster]');
      // Note, -intersection is what the raycaster gets; the hit object gets -intersected.
      var placering = document.getElementById('placering')
      raycaster.addEventListener('raycaster-intersection', function (evt) {
        // Use first hit (which should be nearest).
        var point = evt.detail.intersections[0].point;
        if (clicked) {
          showHUD('Touch to move item')
        } else {
          showHUD('Touch to place item');
        }
        placering.setAttribute('position', point);
        placering.setAttribute('visible', true);
      });

      raycaster.addEventListener('raycaster-intersection-cleared', function (evt) {
        showHUD('Please point device at a flat surface');
        placering.setAttribute('visible', false);
      });
    }

    function onSceneLoaded() {
      console.log('HIT')
      var tempPos = new THREE.Vector3();
      var tempQuat = new THREE.Quaternion();
      var tempScale = new THREE.Vector3();
      var tempEuler = new THREE.Euler(0, 0, 0, 'YXZ');
      var tempMat4 = new THREE.Matrix4();

      
      window.addEventListener('click', function() {
        // If the cursor has an intersection, place a marker.
        clicked = true;
        var cursor = sc.querySelector('[ar-raycaster]').components.cursor;
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
            sc.appendChild(newObj);         
          }
        }
      });

      addARRaycasterListeners();
    }

    if (sc.hasLoaded) {
      onSceneLoaded()
    } else {
      sc.addEventListener('loaded', onSceneLoaded)
    }
    return (
      <a-scene ar>
        {/* <Entity >
          <a-asset-item id="f4u" src="models/f4u/scene.gltf"></a-asset-item>
        </Entity> */}
        <a-entity
          id="placering"
          material="color: #00FF00; shader: flat"
          geometry="primitive: ring; radiusInner: 0.04; radiusOuter: .05; segments-phi: 10; segments-theta: 60"
          rotation="-90 0 0"
          visible="false"
        />
        <a-entity primitive="a-camera" >
          <a-entity id="ar-world" />
          <a-entity
            cursor="fuse:false"
            raycaster="objects:.plane;recursive:false"
            ar-raycaster="el:#ar-world"
          />
          <a-entity
            primitive="a-text"
            id="hud"
            scale="0.015 0.015 0.015"
            position="0 -0.05 -0.1"
            color="white"
            align="center"
            value="Looking for plane"
          />
        </a-entity>
      </a-scene>
    )
  }
} 

ReactDOM.render(<ArView />, document.querySelector('#app'))
//export default ArViews