import { createContext, useContext } from 'react';
import MapStore from './MapStore';
import DataStore from './DataStore';

export default class RootStore {
  mapStore: MapStore;
  dataStore: DataStore;

  constructor() {
    this.mapStore = new MapStore(this);
    this.dataStore = new DataStore(this);
  }
}

// Create a new store context
const store = new RootStore();
const storeContext = createContext(store);

// Hook to use store in any functional component
export const useStore = () => useContext(storeContext);
