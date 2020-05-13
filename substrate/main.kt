package substrate

import io.grpc.ServerBuilder
import okhttp3.*
import org.gdal.gdal.gdal
import substrate.sonar.Bathymetry
import java.io.FileOutputStream
import java.io.IOException
import java.io.OutputStream
import java.time.Duration
import java.time.Instant
import java.util.logging.Logger


private val logger = Logger.getLogger("Main")

fun main() {
    gdal.AllRegister();
    val bathyFile = "/tmp/puget_sound.tiff"
    downloadBathymetry(bathyFile)
    val worldManager = WorldManager(getBloopHost(), bathyFile, bloopCallFrequencySeconds = 5)

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

fun downloadBathymetry(bathyFile: String) {
    val output: OutputStream = FileOutputStream(bathyFile)
    val okHttpClient = OkHttpClient()

    val request = Request.Builder().get().url(
            "https://storage.googleapis.com/artifacts.mass-276203.appspot.com/puget_sound.tiff").build()
    val geoTiff = okHttpClient.newCall(request).execute().body?.byteStream()?.readAllBytes()!!
    output.write(geoTiff)
    output.close()
}

fun getBloopHost(): String {
    val env = System.getenv("BLOOP_HOST")
    return if (env === null || env.isEmpty()) {
        "localhost"
    } else {
        env
    }
}