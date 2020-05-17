package substrate.sonar

import api.Spatial
import org.gdal.gdal.Band
import org.gdal.gdal.Dataset
import org.gdal.osr.CoordinateTransformation
import org.gdal.osr.SpatialReference
import substrate.utils.format
import kotlin.math.roundToInt


class Bathymetry(bathyFile: String) {
    private val dataSet: Dataset = org.gdal.gdal.gdal.Open(bathyFile)
    private val band: Band = dataSet.GetRasterBand(1)
    private val projection: String = dataSet.GetProjection()
    private val transform: DoubleArray = dataSet.GetGeoTransform()

    private val latLngSpatialReference = SpatialReference()
    private val pixelsSpatialReference = SpatialReference(projection)
    private val pixelsToLatLng: CoordinateTransformation
    private val latLngToPixels: CoordinateTransformation

    private val originLatLng: Spatial.Position
    private val extremeCornerLatLng: Spatial.Position

    private val shorts: ShortArray


    init {
        latLngSpatialReference.SetWellKnownGeogCS("WGS84")
        pixelsToLatLng = CoordinateTransformation(pixelsSpatialReference, latLngSpatialReference)
        latLngToPixels = CoordinateTransformation(latLngSpatialReference, pixelsSpatialReference)

        originLatLng = transformPixelPoint(0, 0)
        extremeCornerLatLng = transformPixelPoint(band.xSize, band.ySize)
        println("origin: ${originLatLng.format()}\nextreme corner: ${extremeCornerLatLng.format()}")

        // Hashtag yikes this could be a lot of memory... We're gonna need a bathymetry microservice for big games...
        shorts = ShortArray(band.xSize * band.ySize)

        band.ReadRaster(0, 0, band.xSize, band.ySize, shorts)
    }

    fun getDepthMeters(lat: Double, lng: Double): Int {
        val pixel = transformLatLng(lat, lng)
        if (pixel.x < 0 || pixel.x >= band.xSize) {
            return 0
        }
        if (pixel.y < 0 || pixel.y >= band.ySize) {
            return 0
        }
        val bufferLookup = shorts[pixel.x + band.xSize * pixel.y]
        return -bufferLookup
    }

    fun getDepthFeet(lat: Double, lng: Double): Int {
        return (getDepthMeters(lat, lng) * 3.28084).roundToInt()
    }

    private fun transformPixelPoint(x: Int, y: Int): Spatial.Position {
        val x = (x * transform[1]) + transform[0]
        val y = (y * transform[5]) + transform[3]

        return Spatial.Position.newBuilder()
                .setLat(y)
                .setLng(x)
                .build()
    }

    private fun transformLatLng(lat: Double, lng: Double): Pixel {
        val xy = pixelsToLatLng.TransformPoint(lng, lat)

        val x = ((xy[0] - transform[0]) / transform[1])
        val y = ((xy[1] - transform[3]) / transform[5])

        return Pixel(x.roundToInt(), y.roundToInt())
    }

    data class Pixel(val x: Int, val y: Int)
}
