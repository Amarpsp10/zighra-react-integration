import React, { useState, useContext } from 'react';
import { Navbar,Container, Card, Button, Form, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { useHistory } from 'react-router-dom';
import config from '../config/config'
export default function Root() {
  const {kineticTracker, setData, data} = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState('')
  const [profile, setProfile] = useState(null);
  const [tracking, setTracking] = useState(false)
  const [msg, setMsg] = useState('')
  const history = useHistory();

  const startTracking = () =>{
    kineticTracker.trackStart()
    setTracking(true)
    console.log('tracking started !')
  }

  const stopTracking = async() =>{
      if(profile!==null){
        return makeTransaction()
      }
      else{
        await kineticTracker.trackStop(function(trackingData){
          setData(trackingData)
          console.log(trackingData)
          console.log('tracker is stopped')
          localStorage.setItem('records',JSON.stringify(trackingData))
          setTracking(false)
        });
      }
  }

  const makeTransaction = () =>{
    if(profile.profileCode===null && profile.userName===null){
      return
    }
    kineticTracker.trackStop((trackData)=>{
      setData(trackData)
      setTracking(false)
      console.log(trackData)
      const transferId = makeTransferId()
      const body = {
        gestureInfo: trackData,
        profileCode: profile.profileCode,
        transRefId: transferId
      }

      console.log('trackData ' + trackData)

      kineticTracker.checkGesture(body,(error,gestureData)=>{
        const score = gestureData.data.score
        console.log(gestureData)
        if(score>=config.scoreThreshold){
          reportAction('allow',gestureData,true)
          return alert('Your mouse is good : '+score)
        }

        const getPin = prompt('Your mouse score is not good :'+score+'\n Please enter your PIN ',"")
        if (getPin == null || getPin == "") {
            // PIN cancelled
            reportAction('deny', gestureData, false);
        } else {
            // PIN entered
            if (getPin == config.defaultPin) {
                // PIN is correct
                reportAction('allow', gestureData, true);
            } else {
                // PIN is wrong
                reportAction('deny', gestureData, false);
            }
        }
        })
    })
  }

  const reportAction = (action, checkResp, allowTransaction) => {
    const inputData = {
      profileCode: profile.profileCode,
      action: action,
      refId: checkResp.refId,
      type: checkResp.data.type ? checkResp.data.type : 'gesture'
    };

    kineticTracker.reportAction(inputData,(error,outputData)=>{
      if(error){
        return console.log(JSON.stringify(error));
      }
      console.log('reportAction output :',JSON.stringify(outputData))

      if(allowTransaction){

      }
    })
  }

  const makeTransferId = () =>{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-";

    for (var i = 0; i < 37; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

  const saveProfile = async(e) =>{
    e.preventDefault();
    if(user==='') return;
    const userData = {
        name:user,
        uCode:user
    }
    kineticTracker.getProfile(userData,function(error,data){
        console.log(data)
        if(error){
            alert("Error !")
            return console.log(JSON.stringify(error))
        }
        console.log("successfully saved profile")
        setProfile(data.data)
    })
  }

  return(
    <div>
      <Navbar bg="primary" variant="dark">
        <Container>
        <Navbar.Brand>SensifyID JS SDK- React App</Navbar.Brand>
        </Container>
      </Navbar>
      <div className='p-2'>
      <Card>
        <Card.Header>
          {tracking?
            <Button onClick={()=>stopTracking()} variant='warning' size='sm'>Stop tracking</Button>
            :
            <Button onClick={()=>startTracking()} onClick={()=>startTracking()} variant="secondary" size='sm'>Start Tracking</Button>
          }
          {data==''?
            null:
            <Button onClick={()=>history.push('/result')} variant='info' size='sm' className='mx-3'>Show Result</Button>
          }
        </Card.Header>
        <Card.Body id='trackarea' style={{border:tracking?'solid 3px green':'none'}} >
          <Card.Title className='text-center'>Test Form</Card.Title>
          <Card.Text className='text-center'>
            <Form onSubmit={(e)=>saveProfile(e)}>
              <Form.Text>
                You can interact with this form
              </Form.Text>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Control value={user} onChange={(e)=>setUser(e.target.value)} size='sm' type="name" placeholder="enter your name" />
              </Form.Group>
              <Button type='submit' disabled={user===''? true : false} variant="primary" size='sm' >Save Profile</Button>
              <Form.Group size='sm' className="mb-3" controlId="exampleForm.ControlTextarea1">
              </Form.Group>
            </Form>
            {msg===''? null:
              <Alert style={{fontSize:12}} variant='primary'>
                {msg}
              </Alert>
            }
          </Card.Text>
        </Card.Body>
      </Card>
      </div>
    </div>
  )
}
