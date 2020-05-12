package substrate

import io.grpc.ServerBuilder
import java.time.Duration
import java.time.Instant
import java.util.logging.Logger;

private val logger = Logger.getLogger("Main")

fun main() {
    val worldManager = WorldManager()

    val port = 50051
    val server = ServerBuilder.forPort(port)
            .addService(Server(worldManager))
            .build()
            .start()
    logger.info("Server started, listening on $port")

    var start = Instant.now()
    while (true) {
        Thread.sleep(25)
        val newNow = Instant.now()
        val elapsed = Duration.between(start, newNow)
        worldManager.stepAll(elapsed)
        start = newNow
    }

}