import React from 'react';
import Map from './components/Map';
import styled from 'styled-components';
import { useStore } from './stores/RootStore';
import { observer } from 'mobx-react-lite';
import { Row } from 'antd';

const Info = styled.p`
  position: absolute;
  z-index: 100;
  top: 15px;
  left: 60px;
  background-color: black;
  color: white;
  padding: 10px;
  height: 100px;
  width: 200px;
`;

const App = () => {
  const { mapStore } = useStore();
  return (
    <>
      {/* HINT: you can bind to properties in the map store like this: */}
      <Info>
        <Row>{`Sketch State: ${mapStore.sketchState}`}</Row>
        <Row>{`Flight Denied: ${mapStore.flightStatus}`}</Row>
        {/* <Row>{`Area Within No-Fly Zone: ${mapStore.totalRestrictedArea} km^2`}</Row> */}
      </Info>
      <Map />
    </>
  );
};

// Component must be mobx observed to rerender
export default observer(App);
