import React, { useState } from 'react';
import Strip from './Strip'
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

function Trainer(params) {

    const [classArray, setClassArray] = useState([]);
  
    function addArraytoDisplay() {
        params.currentEmbedding.array().then(outArray => setClassArray([...classArray, outArray[0]]))
    }
    
    function addExampleToClassifier() {
      params.classifier.current.addExample(params.currentEmbedding, params.class);
      params.setClassifierReady(1);
    }
  
    function train() {
      addArraytoDisplay();
      addExampleToClassifier();
    }
  
    return(
      <Col>
        <Button onClick={train}>Train {params.class}</Button>
        <br/>
        {classArray.map((datum, index) => <Strip key={index} data={datum} height={10} width={75}/>)}
      </Col>
    )
  }

export default Trainer;