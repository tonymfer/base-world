"use client";
import { useMapStore } from "@/app/stores/map";
import { api } from "@/app/utils/api";
import isMobile from "@/app/utils/device";
import { zoomInCity, zoomOutCity } from "@/app/utils/globe";
import React from "react";
import ListItem from "./ListItem";

const TYPE_NEXT = "next";
const TYPE_PREV = "prev";

type ArrowButtonType = "next" | "prev";

export default function List({ data }: { data: any }) {
  const mobile = isMobile();
  const setActiveCityResponse = useMapStore(
    (state) => state.setActiveCityResponse
  );
  const activeCityResponse = useMapStore((state) => state.activeCityResponse);
  const setActiveCity = useMapStore((state) => state.setActiveCity);
  const activeCity = useMapStore((state) => state.activeCity);
  const [fetching, setFetching] = React.useState(false);

  async function handleArrowButton(type: ArrowButtonType) {
    if (!activeCityResponse) return;
    const currentIndex = data.findIndex(
      (place: any) => place.id === activeCityResponse.id
    );
    let nextCity;
    if (type === TYPE_NEXT) {
      nextCity = data[currentIndex + 1] ? data[currentIndex + 1] : data[0];
    } else {
      nextCity =
        currentIndex === 0 ? data[data.length - 1] : data[currentIndex - 1];
    }
    setActiveCity(nextCity);
    zoomInCity(nextCity);
    setFetching(true);

    const response = await api(`country/${nextCity.id}`, {
      method: "GET",
    });
    setFetching(false);
    setActiveCityResponse(await response.json());
  }

  if (mobile) return null;

  return (
    <div
      className={`absolute bottom-0 right-[5%] z-[1000] hidden overscroll-none rounded-t-2xl border-[1px] border-b-0 border-gray-900 p-5 pb-0 text-black bg-white transition-opacity duration-700 tablet:top-[100px] tablet:h-[calc(100%-100px)] tablet:w-[500px] tablet:-translate-x-5 tablet:p-5 tablet:pb-0 detail:block laptop:right-[5%] maxscreen:left-[65%] 
  ${activeCity ? "opacity-100" : "pointer-events-none opacity-0"}
  `}
    >
      <div className="relative flex h-full w-full flex-col justify-start overscroll-none">
        <button
          onClick={() => handleArrowButton(TYPE_PREV)}
          className="absolute -left-16 top-1/2 flex aspect-square h-12 -translate-y-1/2 items-center justify-center rounded-full"
        >
          <div className="aspect-square h-8 rotate-45 border-l-2 border-b-2 border-[#fff] hover:scale-[1.1] active:scale-[1.1]" />
        </button>
        <button
          onClick={() => handleArrowButton(TYPE_NEXT)}
          className="absolute -right-16 top-1/2 flex aspect-square h-12 -translate-y-1/2 items-center justify-center rounded-full"
        >
          <div className="aspect-square h-8 rotate-45 border-t-2 border-r-2 border-[#fff] hover:scale-[1.1] active:scale-[1.1]" />
        </button>
        <div className="mb-5 flex w-full justify-end">
          <button
            onClick={() => {
              setActiveCity(null);
              setActiveCityResponse(null);
              zoomOutCity(activeCity as NonNullable<typeof activeCity>);
            }}
            className="cancel aspect-square h-7 w-fit cursor-pointer hover:scale-[1.1] active:scale-[1.1]"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7"
            >
              <path
                d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z"
                fill="#000"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
        <h1 className="text-5xl font-bold uppercase">
          {activeCity?.countryName}
        </h1>
        <h2 className="mt-5 flex w-full justify-end text-xl text-black">
          <span className="mr-1 text-lg">total :</span>
          <span className="text-xl text-primary">
            {activeCity?.casts || 0}{" "}
            {activeCity?.casts === 1 ? "cast" : "casts"}
          </span>
        </h2>
        {fetching ? (
          <div className="mt-5 flex items-center justify-center">
            <svg
              fill="#000"
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              className="animate-spin"
            >
              <path d="m460.116 373.846-20.823-12.022c-5.541-3.199-7.54-10.159-4.663-15.874 30.137-59.886 28.343-131.652-5.386-189.946-33.641-58.394-94.896-95.833-161.827-99.676-6.389-.367-11.417-5.577-11.417-11.976v-24.043c0-6.904 5.808-12.337 12.703-11.982 83.556 4.306 160.163 50.864 202.11 123.677 42.063 72.696 44.079 162.316 6.031 236.832-3.14 6.148-10.75 8.461-16.728 5.01z" />
            </svg>
          </div>
        ) : (
          <div
            className={`cancel mt-5 flex grow flex-col overflow-hidden overflow-y-scroll overscroll-none scrollbar-hide`}
          >
            {activeCityResponse?.casts
              .sort((a, b) => {
                return Number(a.timestamp) - Number(b.timestamp);
              })
              .map((data, i) => (
                <ListItem
                  data={data}
                  className={"overscroll-none"}
                  index={i}
                  key={activeCityResponse.id + "-" + i}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
