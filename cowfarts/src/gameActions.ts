import {
  DoActionRequest,
  PropulsionSystemRequest,
  SystemRequest,
  SteeringSystemRequest,
  HullSystemRequest,
  DivingSystemRequest,
  TmaSystemRequest,
} from "./__protogen__/mass/api/actions_pb";
import { GameConnection } from "./game";

export function requestSpeed(game, speed: number) {
  const speedSystemsRequest = new PropulsionSystemRequest();
  speedSystemsRequest.setSpeedKnots(speed);
  const systemsRequest = new SystemRequest();
  systemsRequest.setPropulsionRequest(speedSystemsRequest);

  const doActionRequest = new DoActionRequest();
  doActionRequest.setScenarioId(game.scenarioId);
  doActionRequest.setVesselId(game.vesselId);
  doActionRequest.setSystemRequestsList([systemsRequest]);

  game.performAction(doActionRequest);
}

export function requestHeading(game: GameConnection, heading: number) {
  if (heading < 0 || heading >= 360) {
    throw `${heading} IS NOT A VALID HEADING`;
  }

  const steeringSystemRequest = new SteeringSystemRequest();
  steeringSystemRequest.setHeadingDegrees(heading);
  const systemsRequest = new SystemRequest();
  systemsRequest.setSteeringRequest(steeringSystemRequest);

  const doActionRequest = new DoActionRequest();
  doActionRequest.setScenarioId(game.scenarioId);
  doActionRequest.setVesselId(game.vesselId);
  doActionRequest.setSystemRequestsList([systemsRequest]);

  game.performAction(doActionRequest);
}

export function requestDepth(game: GameConnection, depth: number) {
  if (depth < 0) {
    throw `${depth} IS NOT A VALID DEPTH`;
  }

  const divingSystemRequest = new DivingSystemRequest();
  divingSystemRequest.setDepthFeet(depth);
  const systemsRequest = new SystemRequest();
  systemsRequest.setDivingRequest(divingSystemRequest);

  const doActionRequest = new DoActionRequest();
  doActionRequest.setScenarioId(game.scenarioId);
  doActionRequest.setVesselId(game.vesselId);
  doActionRequest.setSystemRequestsList([systemsRequest]);

  game.performAction(doActionRequest);
}

export function createContact(game: GameConnection) {
  const addContactRequest = new TmaSystemRequest.TmaAddContactSubrequest();

  const tmaSystemRequest = new TmaSystemRequest();
  tmaSystemRequest.setAddContactRequest(addContactRequest);
  const systemsRequest = new SystemRequest();
  systemsRequest.setTmaRequest(tmaSystemRequest);

  const doActionRequest = new DoActionRequest();
  doActionRequest.setScenarioId(game.scenarioId);
  doActionRequest.setVesselId(game.vesselId);
  doActionRequest.setSystemRequestsList([systemsRequest]);

  game.performAction(doActionRequest);
}

export function deleteContact(game: GameConnection, contactName: string) {
  const addContactRequest = new TmaSystemRequest.TmaAddContactSubrequest();

  const tmaSystemRequest = new TmaSystemRequest();
  tmaSystemRequest.setAddContactRequest(addContactRequest);
  const systemsRequest = new SystemRequest();
  systemsRequest.setTmaRequest(tmaSystemRequest);

  const doActionRequest = new DoActionRequest();
  doActionRequest.setScenarioId(game.scenarioId);
  doActionRequest.setVesselId(game.vesselId);
  doActionRequest.setSystemRequestsList([systemsRequest]);

  game.performAction(doActionRequest);
}
