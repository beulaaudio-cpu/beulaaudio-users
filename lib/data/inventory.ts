export interface CurrentInventory {
  vrxTop: number;
  bassSpeaker: number;
  topSpeaker: number;
  sharpy: number;
  parcan: number;
  honeyComb: number;
  blinder: number;
  moving: number;
  spyder: number;
  dandiya: number;
  monitor: number;
  mic: number;
  djMaskWhiteBlack: number;
  djLedMask: number;
  truss: {
    widthFeet: number;
    lengthFeet: number;
    count: number;
  };
  boxTruss: {
    widthFeet: number;
    lengthFeet: number;
    count: number;
  };
  effectLights: {
    dandiya: number;
    lazer: number;
    movingLight: number;
    discoBall: number;
    spyderLight: number;
  };
  updatedAt?: string;
}

export const INITIAL_INVENTORY: CurrentInventory = {
  vrxTop: 8,
  bassSpeaker: 12, // 18" + normal
  topSpeaker: 8,
  sharpy: 8,
  parcan: 50,
  honeyComb: 2,
  blinder: 10,
  moving: 1,
  spyder: 4,
  dandiya: 2,
  monitor: 8,
  mic: 30,
  djMaskWhiteBlack: 2,
  djLedMask: 2,
  truss: {
    widthFeet: 20,
    lengthFeet: 60,
    count: 1,
  },
  boxTruss: {
    widthFeet: 40,
    lengthFeet: 60,
    count: 1,
  },
  effectLights: {
    dandiya: 2,
    lazer: 2,
    movingLight: 1,
    discoBall: 2,
    spyderLight: 4,
  },
};

export const INVENTORY_ITEM_NAMES: Record<
  keyof Omit<CurrentInventory, "truss" | "boxTruss" | "effectLights" | "updatedAt">,
  string
> = {
  vrxTop: "VRX Top Speaker",
  bassSpeaker: "Bass Speaker (18\" / Normal)",
  topSpeaker: "Top Speaker",
  sharpy: "Sharpy Moving Light",
  parcan: "Parcan Light",
  honeyComb: "Honey Comb Light Rig",
  blinder: "Blinder Light",
  moving: "Moving Light / Head",
  spyder: "Spyder Beam Light",
  dandiya: "Dandiya Light",
  monitor: "Stage Monitor (QSC K12)",
  mic: "Vocal Microphone & Stand",
  djMaskWhiteBlack: "DJ Mask (White + Black)",
  djLedMask: "DJ LED Mask",
};
