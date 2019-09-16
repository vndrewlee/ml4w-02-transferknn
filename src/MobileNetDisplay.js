import React, { useState, useEffect } from 'react';
import Strip from './Strip'

function MobileNetDisplay(params) {

    const [data, setData] = useState([]);
  
    useEffect(()=>{
      if (params.embedding) {
        params.embedding.array().then(out => {
          setData(out[0]);
        })
      }
    },[params.embedding])
  
    return(<Strip data={data} height={50} width={350}/>)
}

export default MobileNetDisplay;