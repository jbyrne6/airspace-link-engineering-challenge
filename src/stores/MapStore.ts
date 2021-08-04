//import { makeAutoObservable } from 'mobx';
import RootStore from './RootStore';
import ArcGISMap from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Sketch from '@arcgis/core/widgets/Sketch';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';

export default class MapStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    //makeAutoObservable(this, { rootStore: false });
    this.rootStore = rootStore;
  }

  constructMap(container: string) {
    const sketchLayer = new GraphicsLayer();

    // Create the map and add the graphics layer
    const map = new ArcGISMap({
      basemap: 'streets-vector',
      layers: [sketchLayer],
    });

    // Set the map view, including location and zoom level
    const view = new MapView({
      map,
      container,
      center: [-83.221564, 42.446424], // Longitude, latitude
      zoom: 9,
    });

    // When the view finishes loading, add the sketch widget
    view.when(() => {
      const sketch = new Sketch({
        layer: sketchLayer,
        view,
        // graphic will be selected as soon as it is created
        creationMode: 'update',
      });

      view.ui.add(sketch, 'top-right');
    });
  }

  cleanup() {
    // Todo, remove any listeners
  }
}
