import {v4} from 'uuid';

import {DoActionRequest, DoActionResponse, PropulsionSystemRequest, SteeringSystemRequest, SystemRequest,} from './__protogen__/mass/api/actions_pb';
import {ConnectRequest} from './__protogen__/mass/api/mass_pb';
import {MassBackendClient} from './__protogen__/mass/api/MassServiceClientPb';
import {Scenario} from './__protogen__/mass/api/scenario_pb';
import {VesselUpdate} from './__protogen__/mass/api/updates_pb';
import buildNewFeasibleScenario from './builders/feasibleScenario';
import {GameId} from './commonTypes';
import {Pipe} from './util/pipe';
import {setGameHash} from './util/url';

const client = new MassBackendClient(process.env.BACKEND || location.origin);

export interface GameConnection {
  scenarioId: string;
  vesselId: string;
  worldEvents: Pipe<VesselUpdate.AsObject>;
  performAction:
      (action: DoActionRequest) => Promise<DoActionResponse.AsObject>;
}

export function joinGame(id: GameId): GameConnection {
  return connectToGame(id);
}

export function createNewGame(): GameConnection {
  const gameId = {
    scenarioId: v4(),
    vesselId: 'rebels',  // TODO change me once we have pvp
  };
  return connectToGame(gameId);
}

function connectToGame(id: GameId): GameConnection {
  const {scenarioId, vesselId} = id;
  const connectionReq = new ConnectRequest();
  connectionReq.setVesselUniqueId(vesselId);
  connectionReq.setScenarioId(scenarioId);
  connectionReq.setScenario(buildNewFeasibleScenario());

  const worldEvents = new Pipe<VesselUpdate.AsObject>();

  var deadline = new Date();
  deadline.setSeconds(deadline.getSeconds() + 600);

  let stream;

  const createStream = () => {
    stream = client.connect(connectionReq, {
      deadline: `${deadline.getTime()}`,
    });

    stream.on('data', (response) => {
      worldEvents.fire(response.toObject());
    });
  };

  createStream();

  function performAction(arg: DoActionRequest) {
    return new Promise((resolve) => {
      return client.doAction(arg, {}, (result) => resolve(result));
    });
  }

  return {
    scenarioId,
    vesselId,
    worldEvents,
    performAction,
  };
}
