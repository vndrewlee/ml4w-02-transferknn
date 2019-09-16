import React, { useState, useEffect, useRef } from 'react';

import * as mobilenet from '@tensorflow-models/mobilenet';
import * as knnClassifier from '@tensorflow-models/knn-classifier';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';

import Trainer from './Trainer'
import MobileNetDisplay from './MobileNetDisplay'
import Button from 'react-bootstrap/Button';

function App() {

  const videoEl = useRef(null);
  const [videoReady, setVideoReady] = useState(0);

  const [model, setModel] = useState(null);
  const classifier = useRef(knnClassifier.create());
  const [classifierReady, setClassifierReady] = useState(0);
  const [embedding, setEmbedding] = useState(null);
  const [knnPrediction, setKnnPrediction] = useState(null);

  const requestAnimationRef = useRef();



  useEffect(() => {
    // set up video stream
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: 'environment' } })
        .then(stream => {
          videoEl.current.srcObject = stream;
          videoEl.current.play();
          window.stream = stream; // unclear if i need this
        });
    };

    // setup mobilenet
    mobilenet.load({ version: 1, alpha: .25 }).then(loaded => setModel(loaded));

  }, []);

  useEffect(() => {
    if (videoReady&&model&&videoEl) {

    const mobileNetLoop = time => {
      const newEmbedding = model.infer(videoEl.current, 'conv_preds');
      setEmbedding(newEmbedding);
      requestAnimationRef.current = window.requestAnimationFrame(mobileNetLoop);
    }

    requestAnimationRef.current = window.requestAnimationFrame(mobileNetLoop);
    return () => cancelAnimationFrame(requestAnimationRef.current);
    
    };
    
  }, [videoReady, model]);

  useEffect(() => {
    if (classifierReady) {
      classifier.current.predictClass(embedding).then(prediction => setKnnPrediction(prediction['label']));
    }
  },[classifierReady, embedding])

  return (
    <div className="App">
      <Container>

        <hr />
        <h1>Transfer Learning</h1>
        <p>MobileNet to kNN Classifier</p>
        {/* <p>No data is leaving your device.</p> */}
        <hr />

        <Row>
          <Col style={{ textAlign: "right" }}>
            <h3>Input</h3>
          </Col>
          <Col>
            <video id="videoPlayer" autoPlay muted playsInline ref={videoEl} width={350} onLoadedData={() => setVideoReady(1)} />
          </Col>
          <Col style={{ textAlign: "left" }}>
            <p>The inputs into the pipeline is an image. An image is grabbed from the video feed multiple times a second and fed to MobileNet.</p>
          </Col>
        </Row>
        <h3>▼</h3>
        <Row>
          <Col style={{ textAlign: "right" }}><h3>MobileNet</h3></Col>
          <Col>
            {/* <Strip data={currentEmbeddingArray} height={50} width={350}/> */}
            <MobileNetDisplay embedding={embedding} />
          </Col>
          <Col style={{ textAlign: "left" }}><p><a href="https://github.com/tensorflow/tfjs-models/tree/master/mobilenet">A pretrained model</a> that takes an image and returns the same 256 labels each time, each with a probability. All 256 activations are visualized here in the color strip.</p></Col>
        </Row>
        <h3>▼</h3>
        <Row>
          <Col style={{ textAlign: "right" }}><h3>kNN Classifier</h3></Col>
          <Col>
            <Row>

              <Trainer key={1} class={1} currentEmbedding={embedding} classifier={classifier} setClassifierReady={setClassifierReady} />
              <Trainer key={2} class={2} currentEmbedding={embedding} classifier={classifier} setClassifierReady={setClassifierReady} />
              <Trainer key={3} class={3} currentEmbedding={embedding} classifier={classifier} setClassifierReady={setClassifierReady} />

            </Row>
          </Col>
          <Col style={{ textAlign: "left" }}><p>Add MobileNet activations to convert the MobileNet output to one of three categories. A <a href="https://github.com/tensorflow/tfjs-models/tree/master/knn-classifier">kNN classifier</a> is used to match future inputs against the categories.</p></Col>
        </Row>
        <h3>▼</h3>
        <Row>
          <Col style={{ textAlign: "right" }}><h3>Output</h3></Col>
          <Col>
          <Row>
            <Col><Button variant={(parseInt(knnPrediction)===1 ? "success" : "secondary")}>Class 1</Button></Col>
            <Col><Button variant={(parseInt(knnPrediction)===2 ? "success" : "secondary")}>Class 2</Button></Col>
            <Col><Button variant={(parseInt(knnPrediction)===3 ? "success" : "secondary")}>Class 3</Button></Col>
          </Row>
          {/* <div width={350}><p style={{fontSize:48}}>{knnPrediction}</p></div> */}
          </Col>
          <Col style={{ textAlign: "left" }}><p>The kNN classififer predicts which category the latest image from the video feed belongs to.</p></Col>
        </Row>
        <hr />
        <a href="https://vndrewlee.com/posts/itp/03_semester/ml4w/02_transfer_learning/">vndrewlee.com</a>

      </Container>
    </div>
  );
}

export default App;