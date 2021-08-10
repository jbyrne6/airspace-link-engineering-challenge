declare module '@esri/arcgis-to-geojson-utils' {
  import * as ArcGIS from 'arcgis-rest-api';
  export function arcgisToGeoJSON<T extends ArcGIS.Geometry>(arcgis: T): GeoJSON.GeometryObject;
  export function geojsonToArcGIS(geojson: any): ArcGIS.Geometry;
}
