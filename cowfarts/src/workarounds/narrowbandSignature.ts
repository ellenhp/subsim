const defaultNarrowbandSig = [20, 30, 80, 300];

type SignatureEntry = {
  signature: number[];
  description: string;
};

export type SignatureTypesType = {
  [key: string]: SignatureEntry;
};

export const signatureTypes: SignatureTypesType = {
  cargo: {
    signature: [20, 80, 300],
    description: "Cargo Ship",
  },
  submarine: {
    signature: [50, 100, 130, 300],
    description: "Submarine",
  },
  adcap_or_noisemaker: {
    description: "ADCAP or Noisemaker",
    signature: defaultNarrowbandSig,
  },
};

const registeredVesselIds: { [key: string]: SignatureEntry } = {
  rebels: signatureTypes.submarine,
  neutral1: signatureTypes.cargo,
  neutral2: signatureTypes.cargo,
  blockaders: signatureTypes.submarine,
};

export function getNarrowbandSignature(vesselId: string) {
  const sig = registeredVesselIds[vesselId];
  if (sig) {
    return sig.signature;
  }
  return defaultNarrowbandSig;
}
