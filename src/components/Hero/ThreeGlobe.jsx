'use client';
import { useLandingStore } from '@/stores/landing';
import { useMapStore } from '@/stores/map';
import { usePassport } from '@/stores/passport';
import { api } from '@/utils/api';
import {
  activateGlobe,
  handleMouseDown,
  handleMouseUp,
  init,
  zoomInCity,
} from '@/utils/globe';
import React, { useCallback, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import {
  baseAroundTheWorld,
  baseAroundTheWorldArcs,
} from './baseAroundTheWorld';
import HEX_DATA from './countries.json';
import htmlElement from './htmlElement';

export default function ThreeGlobe({ data }) {
  const setOpenPassport = usePassport((state) => state.setOpen);
  const openPassport = usePassport((state) => state.open);
  const setChosenCoordinates = usePassport(
    (state) => state.setChosenCoordinates,
  );

  let Globe = () => null;
  if (typeof window !== 'undefined') {
    Globe = require('react-globe.gl').default;
  }
  const globeRef = useMapStore((state) => state.globeRef);
  const setReady = useMapStore((state) => state.setReady);
  const setActiveCityResponse = useMapStore(
    (state) => state.setActiveCityResponse,
  );
  const activeCity = useMapStore((state) => state.activeCity);
  const mobile = useLandingStore((state) => state.mobile);

  const [screenSize, setScreenSize] = React.useState({
    width: typeof window !== 'undefined' && window.innerWidth,
    height: typeof window !== 'undefined' && window.innerHeight,
  });

  const globeMaterial = new THREE.MeshLambertMaterial({
    color: '#035CF6',
    emissive: '#035CF6',
    emissiveIntensity: 1,
    opacity: 0.7,
    transparent: true,
  });

  const polygonsMaterial = new THREE.MeshLambertMaterial({
    color: '#fff',
    side: THREE.DoubleSide,
  });

  useEffect(() => {
    function handleResize() {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      const camera = globeRef.current.camera();
      camera.aspect = window.innerWidth / window.innerHeight;
    }

    if (globeRef.current) {
      const scene = globeRef.current.scene();
      console.log({ scene });

      // if (scene.children.length > 1) {
      //   scene.children[1].intensity = 1.5;
      //   scene.children[2].intensity = 0;
      // }
    }

    const controls = globeRef.current.controls();
    let dirty = false;
    function onPointerMove(e) {
      if (e.pressure === 0 && dirty) {
        controls.saveState();
        controls.reset();
        dirty = false;
      } else if (e.pressure > 0) {
        dirty = true;
      }
    }

    function onMouseUp(e) {
      handleMouseUp(e, globeRef, data, handleLabelClick);
    }

    window.addEventListener('pointerdown', handleMouseDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onMouseUp);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('pointerdown', handleMouseDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      setReady(false);
      if (globeRef.current) {
        globeRef.current.renderer().dispose();
        globeRef.current.scene().remove(globeRef.current);
        globeRef.current.controls().dispose();
      }
    };
  }, []);

  const handleLabelClick = async (city) => {
    if (activeCity && city.id === activeCity.id) return;
    const {
      activeCityResponse,
      globeActive: active,
      setActiveCity,
    } = useMapStore.getState();

    async function handleLogic() {
      setActiveCity(city);

      zoomInCity(city);
      if (activeCityResponse?.id === city.id) return;
      // Open passport
      setOpenPassport(!openPassport);
      // Get city data

      const response = await api(`country/${city.id}`, {
        method: 'GET',
      }).json();
      const { latitude: lat, longitude: lng, countryName: name } = response;

      setChosenCoordinates({ lat, lng, name });
      setActiveCityResponse(response);
    }

    if (!active) {
      activateGlobe(handleLogic);
    } else {
      handleLogic();
    }
  };

  const pointLat = useCallback((d) => {
    return d.latitude;
  }, []);

  const pointLng = useCallback((d) => {
    return d.longitude;
  }, []);

  const pointRadius = useCallback((d) => {
    // const length = Math.min(Math.sqrt(d._count.users) / 5, 1);
    // return length;
    return d.color ? 1 : 1;
  }, []);

  const pointColor = useCallback((d) => {
    return d.color2 ?? '#fff';
  }, []);

  const pointAltitude = useCallback((d) => {
    const result = mobile ? 0.007 : 0.0001;
    const multiplier = d.color ? 2 : 1;
    return result * multiplier;
  }, []);

  const hexPolygonColor = useCallback(() => {
    // return "#0059D2";
    return '#fff';
  }, []);

  const hexPolygonResolution = useCallback(() => {
    return 3;
  }, []);

  const landProps = !mobile
    ? {
        hexPolygonsData: HEX_DATA.features,
        hexPolygonAltitude: 0.0009,
        hexPolygonResolution,
        hexPolygonCurvatureResolution: 0,
        hexPolygonMargin: 0.65,
        hexPolygonColor,
      }
    : {
        polygonsData: HEX_DATA.features,
        polygonCapMaterial: polygonsMaterial,
        polygonSideMaterial: polygonsMaterial,
        polygonAltitude: 0.006,
        polygonCapCurvatureResolution: 0,
        polygonStrokeColor: '#000000',
      };

  const pointProps = {
    pointsData: useMemo(() => [...data, ...baseAroundTheWorld], []),
    pointLat,
    pointLng,
    pointLabel: useCallback((d) => d.city, []),
    pointAltitude,
    pointRadius,
    pointColor,
    pointResolution: 3,
    pointsMerge: true,
  };

  const htmlProps = {
    htmlElementsData: useMemo(() => [...data, ...baseAroundTheWorld], []),
    htmlLat: useCallback((d) => d.latitude, []),
    htmlLng: useCallback((d) => d.longitude, []),
    htmlElement: useCallback((d) => htmlElement({ d, mobile }), []),
    htmlAltitude: useCallback((d) => (d.color ? 0.01 : 0.0001), []),
  };

  const labelsProps = {
    labelsData: useMemo(() => [...baseAroundTheWorld], []),
    labelLat: useCallback((d) => d.latitude, []),
    labelSize: 1,
    labelLabel: useCallback((d) => labelElement({ d, mobile }), []),
    labelLng: useCallback((d) => d.longitude, []),
    labelColor: useCallback((d) => d.color, []),
  };

  const arcsProps = {
    arcsData: baseAroundTheWorldArcs,
    arcStartLat: useCallback((d) => d.startLat, []),
    arcStartLng: useCallback((d) => d.startLng, []),
    arcEndLat: useCallback((d) => d.endLat, []),
    arcEndLng: useCallback((d) => d.endLng, []),
    arcColor: useCallback((d) => d.color, []),
    arcDashAnimateTime: 1500,
    arcDashAnimate: true,
    arcAltitude: 0.05,
    arcDashGap: 2,
    arcDashScale: 4,
    arcStroke: 1,
    arcDashInitialGap: useCallback((d) => d.gap, []),
  };

  return (
    <Globe
      ref={globeRef}
      rendererConfig={{
        antialias: false,
        alpha: true,
        devicePixelRatio: window.devicePixelRatio || 1,
      }}
      enablePointerInteraction={false}
      onGlobeReady={() => {
        setReady(true);
        init();
      }}
      width={typeof window !== 'undefined' && screenSize.width}
      height={typeof window !== 'undefined' && screenSize.height}
      globeMaterial={globeMaterial}
      onZoom={() => {
        if (!globeRef.current) return;
        globeRef.current.controls().zoomSpeed = mobile ? 1 : 0.7;
      }}
      showAtmosphere={true}
      atmosphereColor="#0059D2"
      atmosphereAltitude={0.7}
      {...landProps}
      {...labelsProps}
      {...pointProps}
      {...htmlProps}
      {...arcsProps}
    ></Globe>
  );
}

function labelElement({ d, mobile }) {
  return <div>{d.countryName}</div>;
}
