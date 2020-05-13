package substrate.sonar

import io.grpc.ManagedChannel
import io.grpc.ManagedChannelBuilder

class Bloop {
    companion object {
        fun getBlockingStub(host: String): BloopGrpc.BloopBlockingStub {
            val channel: ManagedChannel = ManagedChannelBuilder.forTarget("$host:50052")
                    .usePlaintext()
                    .build()

            return BloopGrpc.newBlockingStub(channel)
        }
    }
}