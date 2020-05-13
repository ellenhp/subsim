package substrate.sonar

import org.gdal.gdal.Band
import org.gdal.gdal.Dataset
import org.gdal.osr.CoordinateTransformation
import org.gdal.osr.SpatialReference
import kotlin.math.roundToInt


class Bathymetry(bathyFile: String) {
    var dataSet: Dataset = org.gdal.gdal.gdal.Open(bathyFile)
    val band: Band = dataSet.GetRasterBand(1)
    val projection: String = dataSet.GetProjection()
    val transform: DoubleArray = dataSet.GetGeoTransform()

    private val sourceSpatialReference = SpatialReference()
    private val destSpatialReference = SpatialReference(projection)

    init {
        sourceSpatialReference.SetWellKnownGeogCS("WGS84")
    }

    fun getDepthMeters(lat: Double, lng: Double): Int {
        band.GetDataset().GetLayer(1)
        val transformation = CoordinateTransformation(sourceSpatialReference, destSpatialReference)
        val xy =  transformation.TransformPoint(lng, lat)

        val x = ((xy[0] - transform[0]) / transform[1]).roundToInt()
        val y = ((xy[1] - transform[3]) / transform[5]).roundToInt()

        val output = IntArray(1)
        band.ReadRaster(x, y, 1, 1, output)

        // The GeoTIFF we use is in meters.
        return -output[0]
    }

    fun getDepthFeet(lat: Double, lng: Double): Int {
        return (getDepthMeters(lat, lng) * 3.28084).roundToInt()
    }
}