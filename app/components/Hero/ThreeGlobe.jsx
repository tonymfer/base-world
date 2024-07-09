"use client";
import React, { useCallback, useMemo, useEffect, use } from "react";
import { useMapStore } from "@/app/stores/map";
import * as THREE from "three";
import { api } from "@/app/utils/api";
import {
  activateGlobe,
  init,
  zoomInCity,
  handleMouseDown,
  handleMouseUp,
} from "@/app/utils/globe";
import HEX_DATA from "./countries.json";
import htmlElement from "./htmlElement";
import { useLandingStore } from "@/app/stores/landing";

export default function ThreeGlobe({ data }) {
  let Globe = () => null;
  if (typeof window !== "undefined") {
    Globe = require("react-globe.gl").default;
  }
  const globeRef = useMapStore((state) => state.globeRef);
  const setReady = useMapStore((state) => state.setReady);
  const setActiveCityResponse = useMapStore(
    (state) => state.setActiveCityResponse
  );
  const activeCity = useMapStore((state) => state.activeCity);
  const mobile = useLandingStore((state) => state.mobile);

  const [screenSize, setScreenSize] = React.useState({
    width: typeof window !== "undefined" && window.innerWidth,
    height: typeof window !== "undefined" && window.innerHeight,
  });

  const globeMaterial = new THREE.MeshBasicMaterial({
    color: "#035CF6",
    opacity: 0.7,
    transparent: mobile ? false : true,
  });

  const polygonsMaterial = new THREE.MeshLambertMaterial({
    color: "#000",
    side: THREE.DoubleSide,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
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

      if (scene.children.length > 1) {
        scene.children[1].intensity = 1.5;
        scene.children[2].intensity = 0;
      }
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

    window.addEventListener("pointerdown", handleMouseDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onMouseUp);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("pointerdown", handleMouseDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onMouseUp);
      window.removeEventListener("resize", handleResize);
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

      const response = await api(`country/${city.id}`, {
        method: "GET",
      }).json();
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
    return 2;
  }, []);

  const pointColor = useCallback(() => {
    return "#fff";
  }, []);

  const pointAltitude = useCallback(() => {
    const result = mobile ? 0.007 : 0.0001;
    return result;
  }, []);

  const hexPolygonColor = useCallback(() => {
    // return "#0059D2";
    return "#fff";
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
        polygonStrokeColor: "#000000",
      };

  const pointProps = {
    pointsData: useMemo(() => data, []),
    pointLat,
    pointLng,
    pointAltitude,
    pointRadius: 1,
    pointColor,
    pointResolution: 3,
    pointsMerge: true,
  };

  const htmlProps = {
    htmlElementsData: useMemo(() => data, []),
    htmlLat: useCallback((d) => d.latitude, []),
    htmlLng: useCallback((d) => d.longitude, []),
    htmlElement: useCallback((d) => htmlElement({ d, mobile }), []),
    htmlAltitude: 0.003,
  };

  return (
    <Globe
      ref={globeRef}
      waitForGlobeReady={true}
      rendererConfig={{
        antialias: false,
        alpha: true,
        devicePixelRatio: window.devicePixelRatio || 1,
      }}
      enablePointerInteraction={false}
      onGlobeReady={() => {
        init();
        setReady(true);
      }}
      width={typeof window !== "undefined" && screenSize.width}
      height={typeof window !== "undefined" && screenSize.height}
      globeMaterial={globeMaterial}
      onZoom={() => {
        if (!globeRef.current) return;
        globeRef.current.controls().zoomSpeed = mobile ? 1 : 0.7;
      }}
      atmosphereColor="#0059D2"
      atmosphereAltitude={0.3}
      {...landProps}
      {...pointProps}
      {...htmlProps}
    ></Globe>
  );
}
