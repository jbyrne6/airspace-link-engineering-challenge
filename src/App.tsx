import React from 'react';
import Map from './components/Map';
import styled from 'styled-components';
import { useStore } from './stores/RootStore';
import { observer } from 'mobx-react-lite';

const StateWrapper = styled.div`
  position: absolute;
  z-index: 100;
  top: 15px;
  left: 60px;
  background-color: white;
  height: 100px;
  width: 200px;
`;

const App = () => {
  const { mapStore } = useStore();
  return (
    <>
      <StateWrapper>
        <p>
          Sketch State:{' '}
          {
            // HINT: you can bind to properties in the map store like this:
            mapStore.sketchState
          }
        </p>
      </StateWrapper>

      <Map />
    </>
  );
};

// Component must be mobx observed to rerender
export default observer(App);
