import { ActiveCity, useMapStore } from '@/stores/map';
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import isMobile, { isTablet } from './device';
import { useLandingStore } from '../stores/landing';

const mobile = isMobile();
const tablet = isTablet();
let SQUASHDOWN = -350;
const longValue = mobile ? 0 : 20;
const latValue = mobile ? 8 : 0;
if (typeof window !== 'undefined') {
  SQUASHDOWN = mobile ? -350 : window?.innerHeight * -0.9;
}

const zoomedGlobeSize = mobile || tablet ? 1 : 0.65;
const globeSize = mobile || tablet ? 3 : 2;
const ZOOM = {
  INITIAL: mobile || tablet ? 300 : 165,
  ACTIVE: mobile || tablet ? 400 : 300,
  ABOUT: 0,
};

export function init() {
  const globeRef = useMapStore.getState().globeRef;
  if (!globeRef.current) return;
  const currentCamera = globeRef.current.camera();
  const currentCameraPosition = currentCamera.position.clone();
  const maxDistance = !mobile ? 300 : 600;
  globeRef.current.controls().maxDistance = maxDistance;
  globeRef.current.controls().minDistance = 130;
  globeRef.current.controls().autoRotate = true;
  useMapStore.setState({ about: false });

  currentCamera.position.set(
    currentCameraPosition.x,
    currentCameraPosition.y,
    ZOOM.INITIAL,
  );

  useLandingStore.setState({
    initialXY: [currentCameraPosition.x, currentCameraPosition.y],
  });

  currentCamera.setViewOffset(
    window.innerWidth,
    window.innerHeight,
    0,
    SQUASHDOWN,
    window.innerWidth,
    window.innerHeight,
  );

  globeRef.current.camera().updateProjectionMatrix();

  globeRef.current.controls().autoRotate = true;
  globeRef.current.controls().autoRotateSpeed = 0.1;

  document.body.classList.add('globe-inactive');
}

export function zoomInCity(
  city: ActiveCity,
  direction: 'left' | 'right' = 'left',
) {
  const globeRef = useMapStore.getState().globeRef;
  if (!globeRef.current) return;
  let animateId: number;
  const width = window.innerWidth;
  const extraZoomIn = Number(city.casts) < 5 ? 0.05 : 0;

  const currentCamera = globeRef.current.camera();
  globeRef.current.controls().autoRotateSpeed = 0.01;

  if (!currentCamera.view) return;
  const pointOfView = globeRef.current.pointOfView();
  const start = {
    xOffset: currentCamera.view.offsetX,
    pointOfView,
  };

  let xOffset = mobile ? 0 : Math.min(width * 0.4, 1000);
  if (direction === 'right') {
    xOffset = -xOffset;
  }
  const latLongVar = direction === 'right' ? -1 : 1;

  // Create an object for the ending state of the tween
  const end = {
    xOffset,
    pointOfView: {
      lat: city.latitude - latValue * latLongVar,
      lng: city.longitude - longValue * latLongVar,
      altitude: zoomedGlobeSize - extraZoomIn,
    },
  };

  document.body.classList.remove('city-inactive');
  document.body.classList.add('city-active');
  highlightLabel(city);

  const tween = new TWEEN.Tween(start)
    .to(end, 1300) // Adjust duration to your needs
    .easing(TWEEN.Easing.Cubic.Out)
    .onUpdate(() => {
      const currentGlobeRef = globeRef.current;
      if (!currentGlobeRef) return;
      currentCamera.setViewOffset(
        window.innerWidth,
        window.innerHeight,
        start.xOffset,
        currentCamera.view.offsetY,
        window.innerWidth,
        window.innerHeight,
      );
      globeRef.current.pointOfView(start.pointOfView);

      currentCamera.updateProjectionMatrix();
    })
    .start();

  const animate = (time: number | undefined) => {
    animateId = requestAnimationFrame(animate);
    TWEEN.update(time);
  };
  requestAnimationFrame(animate);

  return () => {
    if (tween) {
      tween.stop();
    }
    cancelAnimationFrame(animateId);
  };
}

export function zoomOutCity(city: ActiveCity) {
  const { setActiveCity, globeRef } = useMapStore.getState();
  // Define the target position for the camera.

  let animateId: number;
  const currentCamera = globeRef.current.camera();
  if (!currentCamera.view) return;
  const pointOfView = globeRef.current.pointOfView();
  const start = {
    xOffset: currentCamera.view.offsetX,
    pointOfView: {
      ...pointOfView,
      altitude: zoomedGlobeSize,
    },
  };

  const end = {
    xOffset: 0,
    pointOfView: {
      lat: city?.latitude - latValue,
      lng: city.longitude,
      altitude: globeSize,
    },
  };

  document.body.classList.remove('city-active');
  document.body.classList.add('city-inactive');

  // Create a new tween
  const tween = new TWEEN.Tween(start)
    .to(end, 1000)
    .easing(TWEEN.Easing.Cubic.Out)
    .onUpdate(() => {
      const currentGlobeRef = globeRef.current;
      if (!currentGlobeRef) return;
      currentCamera.setViewOffset(
        window.innerWidth,
        window.innerHeight,
        start.xOffset,
        currentCamera.view.offsetY,
        window.innerWidth,
        window.innerHeight,
      );
      globeRef.current.pointOfView(start.pointOfView);
      currentCamera.updateProjectionMatrix();
    })
    .onComplete(() => {
      globeRef.current.controls().autoRotateSpeed = 0.3;
      globeRef.current.controls().autoRotate = true;
      setActiveCity(null);
    })
    .start();

  // To animate your tween, add this line to your animation loop
  const animate = (time: number | undefined) => {
    animateId = requestAnimationFrame(animate);
    TWEEN.update(time);
  };
  requestAnimationFrame(animate);
  // globeRef.current.controls().enabled = false;
  return () => {
    // This will stop the tween when the component unmounts
    if (tween) {
      tween.stop();
    }

    cancelAnimationFrame(animateId);
  };
}

export function activateGlobe(cb?: () => void) {
  const { globeRef, setGlobeActive } = useMapStore.getState();
  if (!globeRef.current) return;
  setGlobeActive(true);
  let animateId: number;
  const currentCamera = globeRef.current.camera();
  const currentCameraPosition = globeRef.current.camera().position.clone();
  globeRef.current.controls.enableZoom = false;
  const timeout = setTimeout(() => {
    if (globeRef.current) {
      globeRef.current.controls().enabled = true;
    }
    globeRef.current.controls().autoRotateSpeed = 0.5;
  }, 2000);

  // Define the target position for the camera.
  const targetPosition = new THREE.Vector3(
    currentCameraPosition.x,
    currentCameraPosition.y,
    ZOOM.ACTIVE,
  );
  if (!currentCamera.view) return;
  const start = {
    yOffset: currentCamera.view.offsetY,
    zoom: currentCameraPosition,
  };

  // Create an object for the ending state of the tween
  const end = { yOffset: 0, zoom: targetPosition };

  // Create a new tween
  const tween = new TWEEN.Tween(start)
    .to(end, 800) // Adjust duration to your needs
    .easing(TWEEN.Easing.Cubic.InOut)
    .onUpdate(() => {
      const currentGlobeRef = globeRef.current;
      if (!currentGlobeRef) return;
      currentCamera.setViewOffset(
        window.innerWidth,
        window.innerHeight,
        0,
        start.yOffset,
        window.innerWidth,
        window.innerHeight,
      );
      currentCamera.position.set(start.zoom.x, start.zoom.y, start.zoom.z);
      currentCamera.updateProjectionMatrix();
    })
    .onComplete(() => {
      cb?.();
      if (globeRef.current) {
        globeRef.current.controls().autoRotateSpeed = 0.1;
        globeRef.current.controls().enabled = true;
      }
    })
    .start();
  // To animate your tween, add this line to your animation loop
  const animate = (time: number | undefined) => {
    animateId = requestAnimationFrame(animate);
    TWEEN.update(time);
  };
  requestAnimationFrame(animate);
  document.body.classList.remove('globe-inactive');
  document.body.classList.add('city-inactive');

  return () => {
    // This will stop the tween when the component unmounts
    if (tween) {
      tween.stop();
    }
    clearTimeout(timeout);

    // Cancel the animation frame request
    cancelAnimationFrame(animateId);
  };
}

export function deactivateGlobe(isAbout = false) {
  const { globeRef, setGlobeActive } = useMapStore.getState();
  setGlobeActive(false);
  globeRef.current.controls().autoRotate = false;

  if (!globeRef.current) {
    console.warn('globeRef.current is not initialized.');
    return;
  }

  let animateId: number;
  const currentCamera = globeRef.current.camera();

  if (!currentCamera) {
    console.warn('globeRef.current.camera() is not initialized.');
    return;
  }

  const currentCameraPosition = globeRef.current.camera().position.clone();
  //TODO
  globeRef.current.controls().minDistance = 0;

  // const targetPosition = new THREE.Vector3(
  //   currentCameraPosition.x,
  //   currentCameraPosition.y,

  //   isAbout ? ZOOM.ABOUT : ZOOM.INITIAL
  // );

  const targetPositionProps = isAbout
    ? [100, 0, ZOOM.ABOUT]
    : [currentCameraPosition.x, currentCameraPosition.y, ZOOM.INITIAL];

  const targetPosition = new THREE.Vector3(...targetPositionProps);

  if (!currentCamera.view) return;
  const start = {
    yOffset: currentCamera.view.offsetY,
    zoom: currentCameraPosition,
  };

  const yOffset = isAbout ? 0 : SQUASHDOWN;

  // Create an object for the ending state of the tween
  const end = { yOffset, zoom: targetPosition };
  // Create a new tween
  const tween = new TWEEN.Tween(start)
    .to(end, 1000) // Adjust duration to your needs
    .easing(TWEEN.Easing.Cubic.InOut)
    .onUpdate(() => {
      const currentGlobeRef = globeRef.current;
      if (!currentGlobeRef) return;
      currentCamera.setViewOffset(
        window.innerWidth,
        window.innerHeight,
        0,
        start.yOffset,
        window.innerWidth,
        window.innerHeight,
      );
      currentCamera.position.set(start.zoom.x, start.zoom.y, start.zoom.z);
      currentCamera.updateProjectionMatrix();
    })
    .start();

  // To animate your tween, add this line to your animation loop
  const animate = (time: number | undefined) => {
    animateId = requestAnimationFrame(animate);
    TWEEN.update(time);
  };
  requestAnimationFrame(animate);
  globeRef.current.controls().enabled = false;

  document.body.classList.add('globe-inactive');
  document.body.classList.remove('city-inactive');
  globeRef.current.controls().autoRotateSpeed = 0.1;
  return () => {
    if (tween) {
      tween.stop();
    }
    cancelAnimationFrame(animateId);
  };
}

interface Coords {
  x: number;
  y: number;
}

interface City {
  city: string;
  code: string;
  country: string;
  id: number;
  latitude: number;
  longitude: number;
  search: string;
  _threeObj?: {
    isObject3D: boolean;
    uuid: string;
    name: string;
  };
  _count: {
    users: number;
  };
}

interface ClosestCity {
  distance?: number | null;
  closestCity?: City | null;
}

type GlobeRef = {
  current: {
    toGlobeCoords: (
      x: number,
      y: number,
    ) => { lat: number; lng: number } | null;
  } | null;
};

let mouseDownCoords: Coords | null = null;

export function handleMouseDown(e: MouseEvent): void {
  mouseDownCoords = { x: e.clientX, y: e.clientY };
}

export function handleMouseUp(
  e: MouseEvent,
  globeRef: GlobeRef,
  data: City[],
  handleLabelClick: (city: City) => void,
): void {
  const mouseUpCoords = { x: e.clientX, y: e.clientY };
  if (!mouseDownCoords) return;

  const distance =
    Math.pow(mouseUpCoords.x - (mouseDownCoords.x || 0), 2) +
    Math.pow(mouseUpCoords.y - (mouseDownCoords.y || 0), 2);
  if (distance > 100) return;
  else {
    handleGlobeClick(e, globeRef, data, handleLabelClick);
  }
}

export function handleGlobeClick(
  e: MouseEvent,
  globeRef: GlobeRef,
  data: City[],
  handleLabelClick: (city: City) => void,
): void {
  if (!globeRef.current) return;
  const coords = globeRef.current.toGlobeCoords(e.clientX, e.clientY);
  if (!coords) return;
  const { lat, lng } = coords;

  const closestCity: ClosestCity = data.reduce((acc, city) => {
    const cityDistanceSquared =
      Math.pow(city.latitude - lat, 2) + Math.pow(city.longitude - lng, 2);
    if (cityDistanceSquared > 50) return acc;
    if (!acc.distance || cityDistanceSquared < acc.distance) {
      acc.distance = cityDistanceSquared;
      acc.closestCity = city;
    }
    return acc;
  }, {} as ClosestCity);

  if (closestCity.closestCity) {
    handleLabelClick(closestCity.closestCity);
  }
}

function highlightLabel(activeCity: ActiveCity) {
  document.querySelectorAll('.city-label').forEach((el) => {
    const e = el as HTMLDivElement;
    if (e) {
      e.classList.remove('active');
    }
  });

  const elem = document.getElementById(
    `${activeCity.countryName}-div`,
  ) as HTMLDivElement;

  if (elem) {
    elem.classList.add('active');
  }
}
