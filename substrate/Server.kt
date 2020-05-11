package substrate

import api.Actions
import api.Mass
import api.MassBackendGrpc.MassBackendImplBase
import api.Updates
import io.grpc.stub.StreamObserver


class Server(private val worldManager: WorldManager) : MassBackendImplBase() {
    override fun connect(request: Mass.ConnectRequest, responseObserver: StreamObserver<Updates.VesselUpdate>) {
        worldManager.maybeAdd(request.scenarioId, request.scenario)
        while (true) {
            responseObserver.onNext(worldManager.getUpdate(request.scenarioId, request.vesselUniqueId))
            Thread.sleep(100)
        }
    }

    override fun doAction(request: Actions.DoActionRequest, responseObserver: StreamObserver<Actions.DoActionResponse>) {
        worldManager.processAction(request)
        responseObserver.onNext(Actions.DoActionResponse.newBuilder().build())
        responseObserver.onCompleted()
    }
}
