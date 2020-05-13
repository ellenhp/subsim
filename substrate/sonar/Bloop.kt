package substrate.sonar

import io.grpc.ManagedChannel
import io.grpc.ManagedChannelBuilder

class Bloop {
    companion object {
        fun getStub(host: String): BloopGrpc.BloopStub {
            val channel: ManagedChannel = ManagedChannelBuilder.forTarget("$host:50052")
                    .usePlaintext()
                    .build()

            return BloopGrpc.newStub(channel)
        }
    }
}