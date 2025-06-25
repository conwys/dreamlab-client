import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ObjectSelectionPaneComponent } from './object-selection-pane/object-selection-pane.component';
import { RoomObject } from '../../models/room-object';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { RoomSizingComponent } from './room-sizing/room-sizing.component';
import { RoomTexturesComponent } from './room-textures/room-textures.component';
import { Texture } from '../../models/texture';

@Component({
  selector: 'app-edit-room',
  imports: [ObjectSelectionPaneComponent, RoomSizingComponent, RoomTexturesComponent],
  templateUrl: './edit-room.component.html',
  styleUrl: './edit-room.component.scss',
  standalone: true,
})
export class EditRoomComponent implements AfterViewInit, OnDestroy {
  private canvas?: HTMLElement | null;
  private renderer = new THREE.WebGLRenderer();
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera();

  protected readonly initialValue = 5;
  
  private roomLength = this.initialValue; // X -axis
  private roomHeight = this.initialValue; // Y-axis
  private roomWidth = this.initialValue; // Z-axis

  private xyPlane?: THREE.Mesh;
  private zyPlane?: THREE.Mesh;
  private xzPlane?: THREE.Mesh;

  private orbitControls?: OrbitControls;
  private transformControls?: TransformControls;

  private objectsWithinRoom: RoomObject[] = [];

  private floorTextureMaterial?: THREE.MeshPhongMaterial;
  private wallTextureMaterial?: THREE.MeshPhongMaterial;

  private floorTexture?: THREE.Texture;

  private wallThickness = 0.2;
  private whiteHexColor = '0xffffff';

  ngOnDestroy(): void {
    this.renderer?.setAnimationLoop(null);
  }

  ngAfterViewInit(): void {
    if (typeof document !== 'undefined') {
      this.canvas = document.getElementById('edit-room-canvas');
    }

    if (this.canvas) {
      const canvas = this.canvas;

      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas,
        alpha: true,
      });

      this.camera = new THREE.PerspectiveCamera(75, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 1000);
 
      const center = {
        x: this.roomLength / 2,
        y: 0,
        z: this.roomWidth / 2,
      };
      this.camera.position.set(center.x + 5, center.y + 4, center.z + 5);

      // Create a directional light
      const light = new THREE.DirectionalLight(this.whiteHexColor, 3);
      light.position.set(6, 10, 10);
      this.scene.add(light);

      // Add ambient light for more even illumination
      const ambient = new THREE.AmbientLight(this.whiteHexColor, 1.2);
      this.scene.add(ambient);
      this.setupTextures();
      this.setUpRoomDimensions();

      this.setUpOrbitControls();

      this.renderer.setAnimationLoop(() => {
        if (this.renderer && this.camera && this.scene) {
          // Maintain the aspect ratio of the view when canvas is resized
          if (this.resizeRendererToDisplaySize()) {
            const canvas = this.renderer.domElement;

            this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
            this.camera.updateProjectionMatrix();
          }

          this.renderer.render(this.scene, this.camera);
        }
      });
    }
  }

  addObjectToRoom(roomObject: RoomObject): void {
    const floorCentre = {
      x: this.roomLength / 2,
      z: this.roomWidth / 2,
    };

    if (roomObject.object instanceof THREE.Mesh) {
      const mesh = roomObject.object as THREE.Mesh;
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach(mat => {
          this.enhanceMaterial(mat);
        });
      } else {
        this.enhanceMaterial(mesh.material);
      }
    }

    roomObject.addToScene(floorCentre, this.scene);

    this.objectsWithinRoom.push(roomObject);
  }

  private enhanceMaterial(material: THREE.Material) {
    if ((material as any).isMeshPhongMaterial) {
      const phong = material as THREE.MeshPhongMaterial;
      phong.shininess = 80;
      phong.specular = new THREE.Color(0xffffff);
      phong.needsUpdate = true;
    }
    if ((material as any).isMeshStandardMaterial) {
      const standard = material as THREE.MeshStandardMaterial;
      standard.metalness = 0.3;
      standard.roughness = 0.3;
      standard.needsUpdate = true;
    }
  }

  removeObjectFromRoom(id: number): void {
    const object = this.scene.getObjectById(id);

    if (object) {
      this.scene.remove(object);
    }

    this.objectsWithinRoom.filter((obj) => {
      if (obj.object.id == id) {
        obj.displayedInScene = false;
        obj.object.visible = false;

        return false;
      }

      return true;
    });

    if (this.transformControls?.object?.id == id) {
      this.transformControls?.detach();
    }
  }

  private resizeRendererToDisplaySize() {
    if (this.renderer) {
      const canvas = this.renderer.domElement;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        this.renderer.setSize(width, height, false);
      }

      return needResize;
    }

    return false;
  }

  private setUpRoomDimensions(): void {
    if (this.xyPlane) {
      this.scene?.remove(this.xyPlane);
    }
    if (this.zyPlane) {
      this.scene?.remove(this.zyPlane);
    }
    if (this.xzPlane) {
      this.scene?.remove(this.xzPlane);
    }

    const x = this.roomLength;
    const y = this.roomHeight;
    const z = this.roomWidth;
    const t = this.wallThickness;

    // Update floor texture tiling based on room size
    if (this.floorTexture) {
      this.floorTexture.repeat.set(this.roomLength, this.roomWidth);
      this.floorTexture.needsUpdate = true;
    }

    // Update wall texture tiling based on wall size
    if (this.wallTextureMaterial?.map) {
      this.wallTextureMaterial.map.repeat.set(this.roomLength, this.roomHeight);
      this.wallTextureMaterial.map.needsUpdate = true;
    }

    this.xzPlane = new THREE.Mesh(new THREE.BoxGeometry(x, t, z), this.floorTextureMaterial);
    this.xzPlane.position.set(x / 2, t / 2, z / 2);
    this.scene?.add(this.xzPlane);

    this.xyPlane = new THREE.Mesh(new THREE.BoxGeometry(x, y, t), this.wallTextureMaterial);
    this.xyPlane.position.set(x / 2, t + y / 2, t / 2);
    this.scene?.add(this.xyPlane);

    if (this.wallTextureMaterial?.map) {
      this.wallTextureMaterial.map.repeat.set(this.roomWidth/4, this.roomHeight/4);
      this.wallTextureMaterial.map.needsUpdate = true;
    }
    this.zyPlane = new THREE.Mesh(new THREE.BoxGeometry(t, y, z), this.wallTextureMaterial);
    this.zyPlane.position.set(t / 2, t + y / 2, z / 2);
    this.scene?.add(this.zyPlane);
  }

  private setUpOrbitControls(): void {
    this.orbitControls = new OrbitControls(this.camera, this.canvas);
    this.orbitControls.target.set(this.roomLength / 2, 0, this.roomWidth / 2);
    this.orbitControls.enableDamping = true;
    this.orbitControls.dampingFactor = 0.5;
    this.orbitControls.rotateSpeed = 0.3;
    this.orbitControls.update();
  }

  private setUpTransformControls(): void {
    this.transformControls = new TransformControls(this.camera, this.renderer.domElement);

    this.scene.add(this.transformControls.getHelper());

    this.transformControls.addEventListener('mouseDown', () => {
      if (this.orbitControls) {
        this.orbitControls.enabled = false;
      }
    });

    this.transformControls.addEventListener('mouseUp', () => {
      if (this.orbitControls) {
        this.orbitControls.enabled = true;
      }
    });

    this.transformControls.showY = false;
    this.transformControls.setSize(0.5);
  }

    private setupTextures(): void {
    // Load the floor texture
    const textureLoader = new THREE.TextureLoader();
    const floorTexture = textureLoader.load('assets/img/wood.jpg');
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(4, 4);

    this.floorTexture = floorTexture;

    // Load the wall texture
    const wallTexture = textureLoader.load('assets/img/wallpaper.jpg');
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;

    this.wallTextureMaterial = new THREE.MeshPhongMaterial({
      map: wallTexture,
      color: 0xffffff,
      side: THREE.DoubleSide,
    });

    this.floorTextureMaterial = new THREE.MeshPhongMaterial({
      map: floorTexture,
      color: 0xffffff,
      side: THREE.DoubleSide,
    });
  }

  public attachObjectToTransformControls(roomObject: RoomObject, rotate = false): void {
    const isCurrentlyAttached = this.transformControls?.object?.id == roomObject.object.id;

    if (!isCurrentlyAttached && rotate) {
      return;
    }

    this.transformControls?.detach().dispose();

    if (isCurrentlyAttached && !rotate) {
      return;
    }

    this.setUpTransformControls();

    if (roomObject.displayedInScene && this.transformControls) {
      this.transformControls?.attach(roomObject.object);

      roomObject.setTransformationLimits(this.transformControls, this.roomLength, this.roomWidth);
    }
  }

  public rotateObjectInRoom(object: RoomObject): void {
    object.object.rotateY(this.degToRad(90));
    object.updateDimensionsOnYRotation();

    this.attachObjectToTransformControls(object, true);
  }

  protected updateRoomDimension(newDimension: number, dimension: Dimensions): void {
    switch (dimension) {
      case 'length':
        this.roomLength = newDimension;
        break;
      case 'width':
        this.roomWidth = newDimension;
        break;
      case 'height':
        this.roomHeight = newDimension;
        break;
    }

    this.setUpRoomDimensions();

    if (this.orbitControls) {
      this.orbitControls.target.set(
        this.roomLength / 2,
        0,
        this.roomWidth / 2
      );
      this.orbitControls.update();
    }

    if (this.transformControls?.object) {
      this.transformControls.detach();
    }
  }

  private degToRad(deg: number): number {
    return deg * (Math.PI / 180.0);
  }

  onTextureSelected(texture: Texture) {
    const textureLoader = new THREE.TextureLoader();
    let floorTexture: THREE.Texture | undefined;
    let wallTexture: THREE.Texture | undefined;

      floorTexture = textureLoader.load(texture.floor);
      wallTexture = textureLoader.load(texture.wall);

    if (floorTexture && this.floorTextureMaterial) {
      floorTexture.wrapS = THREE.RepeatWrapping;
      floorTexture.wrapT = THREE.RepeatWrapping;
      this.floorTexture = floorTexture;
      this.floorTextureMaterial.map = floorTexture;
      this.floorTextureMaterial.needsUpdate = true;
    }
    if (wallTexture && this.wallTextureMaterial) {
      wallTexture.wrapS = THREE.RepeatWrapping;
      wallTexture.wrapT = THREE.RepeatWrapping;
      this.wallTextureMaterial.map = wallTexture;
      this.wallTextureMaterial.needsUpdate = true;
    }
    this.setUpRoomDimensions();
  }
}

type Dimensions = 'length' | 'width' | 'height';
