const defaultNarrowbandSig = [20, 30, 80, 300];

type SignatureEntry = {
  signature: number[];
  description: string;
};

export type SignatureTypesType = {
  [key: string]: SignatureEntry;
};

export const signatureTypes: SignatureTypesType = {
  submarine: {
    signature: [15, 28, 90, 340],
    description: "Submarine",
  },
  noisemaker: {
    description: "Noisemaker",
    signature: [15, 30, 90, 360],
  },
  adcap: {
    description: "ADCAP Torpedo",
    signature: [60, 140, 500, 1800],
  },
  cargo: {
    signature: [20, 50, 4000],
    description: "Cargo Ship",
  },
};

export function getNarrowbandSignature(vesselId: string) {
  if (vesselId.startsWith("submarine")) {
    return signatureTypes.submarine.signature;
  }
  if (vesselId.startsWith("noisemaker")) {
    return signatureTypes.noisemaker.signature;
  }
  if (vesselId.startsWith("adcap")) {
    return signatureTypes.adcap.signature;
  }
  return defaultNarrowbandSig;
}
