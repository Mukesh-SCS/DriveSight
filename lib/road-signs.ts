export type RoadSignSheet = {
  id: string;
  index: number;
  label: string;
  src: string;
  width: number;
  height: number;
};

export const ROAD_SIGN_SHEETS: RoadSignSheet[] = [
  { id: "sign-01", index: 1, label: "Sheet 1", src: "/assets/us-road-signs/sign-01.png", width: 576, height: 1152 },
  { id: "sign-02", index: 2, label: "Sheet 2", src: "/assets/us-road-signs/sign-02.png", width: 548, height: 2290 },
  { id: "sign-03", index: 3, label: "Sheet 3", src: "/assets/us-road-signs/sign-03.png", width: 2277, height: 1484 },
  { id: "sign-04", index: 4, label: "Sheet 4", src: "/assets/us-road-signs/sign-04.png", width: 1246, height: 980 },
  { id: "sign-05", index: 5, label: "Sheet 5", src: "/assets/us-road-signs/sign-05.png", width: 1066, height: 800 },
  { id: "sign-06", index: 6, label: "Sheet 6", src: "/assets/us-road-signs/sign-06.png", width: 1120, height: 1376 },
  { id: "sign-07", index: 7, label: "Sheet 7", src: "/assets/us-road-signs/sign-07.png", width: 882, height: 720 },
  { id: "sign-08", index: 8, label: "Sheet 8", src: "/assets/us-road-signs/sign-08.png", width: 1124, height: 1030 },
  { id: "sign-09", index: 9, label: "Sheet 9", src: "/assets/us-road-signs/sign-09.png", width: 2272, height: 908 },
];

export const ROAD_SIGN_COUNT = ROAD_SIGN_SHEETS.length;
