import { VesselUpdate } from "./__protogen__/mass/api/updates_pb";

export const getRequestedSpeed = (update: VesselUpdate.AsObject) => {
  return update.systemUpdatesList.filter((system) => system.propulsionUpdate)[0]
    .propulsionUpdate.requestedSpeedKnots;
};

export const getActualSpeed = (update: VesselUpdate.AsObject) => {
  return update.systemUpdatesList.filter((system) => system.propulsionUpdate)[0]
    .propulsionUpdate.actualSpeedKnots;
};

export const getRequestedHeading = (update: VesselUpdate.AsObject) => {
  return update.systemUpdatesList.filter((system) => system.steeringUpdate)[0]
    .steeringUpdate.requestedHeadingDegrees;
};

export const getCurrentHeading = (update: VesselUpdate.AsObject) => {
  return update.systemUpdatesList.filter((system) => system.steeringUpdate)[0]
    .steeringUpdate.actualHeadingDegrees;
};

export const getRequestedDepth = (update: VesselUpdate.AsObject) => {
  return update.systemUpdatesList.filter((system) => system.divingUpdate)[0]
    .divingUpdate.requestedDepthFeet;
};

export const getCurrentDepth = (update: VesselUpdate.AsObject) => {
  return update.systemUpdatesList.filter((system) => system.hullUpdate)[0]
    .hullUpdate.actualDepthFeet;
};

export const getMeasuredFeetBelowKeel = (update: VesselUpdate.AsObject) => {
  return update.systemUpdatesList.filter((system) => system.sonarUpdate)[0]
    .sonarUpdate.depthBelowKeelFeet;
};

export const getContacts = (update: VesselUpdate.AsObject) => {
  return update.systemUpdatesList.filter((system) => system.tmaUpdate)[0]
    .tmaUpdate.contactsList;
};
