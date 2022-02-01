const options ={
    logging: false,
    trackingTimeSensitivity: 10,
    mouseTrackingElement: '#trackarea',
    debug: true,
    autoTracking: false,
    appKey: process.env.REACT_APP_API_KEY,
    appSecret: process.env.REACT_APP_API_SECRET,
    trackingInterval: 60,
    sensorPollingFrequency: 10,
    packageId: '',
}

export default options