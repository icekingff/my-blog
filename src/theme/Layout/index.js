import React from 'react';
import Layout from '@theme-original/Layout';
import WaterTrail from '@site/src/components/WaterTrail';
import ClickEffect from '@site/src/components/ClickEffect';

function LayoutWrapper(props) {
  return (
    <>
      <WaterTrail />
      <ClickEffect />
      <Layout {...props} />
    </>
  );
}

export default LayoutWrapper;