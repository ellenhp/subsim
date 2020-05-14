import { GameId } from "../commonTypes";

export const setGameHash = ({ scenarioId, vesselId }: GameId) => {
  location.hash = `${scenarioId}:${vesselId}`;
};

export const getGameHash = (): GameId | undefined => {
  const [scenarioId, vesselId] = location.hash.split(":");
  if (typeof scenarioId !== "string" || typeof vesselId !== "string") {
    return undefined;
  }
  return { scenarioId: scenarioId.slice(1), vesselId };
};
