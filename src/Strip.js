import React from 'react';

import {interpolateWarm} from "d3-scale-chromatic";
import {scaleLinear} from "d3-scale";

function Strip(params) {
    const dataLength = params['data'].length;
    const scale = scaleLinear().domain([0, 8]).range([0,1]);
    const maxRectWidth = params.width/10;
  
    return (
        <svg width={params.width} height={params.height} style={{lineHeight:"10px"}}>
          <rect width="100%" height="100%" fill="black"/>
          {params['data'].map((val, index) => (
            <rect 
              key={index} 
              height={50} 
              width={scale(val)*maxRectWidth} 
              x={params.width*(index/dataLength)} 
              y={0} 
              style={{
                fill:interpolateWarm((index/255)), 
                opacity:scale(val)
              }}
            />
          ))}
        </svg>
    );
  };

export default Strip;