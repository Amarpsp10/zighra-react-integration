import React,{useEffect,useContext,createContext, useState} from 'react'
import options from '../config/trackingConfig';
import trackingConfig from '../config/trackingConfig'

export const AuthContext = createContext();

const AuthProvider = ({children}) =>{
    const[data, setData] = useState('');
    const[user, setUser] = useState('');
    const[kineticTracker, setKinaticTracker] = useState(null);
    const[tracking,setTracking] = useState(false)
    console.log(options)

    useEffect(()=>{
        const kinetic = new window.ZFS.KineticTracker(trackingConfig);
        kinetic.init();
        setKinaticTracker(kinetic);
        console.log(kinetic);
    },[])

    const startTracking = () =>{
        kineticTracker.trackStart()
        setTracking(true)
        console.log('tracking started !')
    }
    
    const stopTracking = async() =>{
        await kineticTracker.trackStop(function(trackingData){
            setData(trackingData)
            console.log(trackingData)
            console.log('tracker is stopped')
            localStorage.setItem('records',JSON.stringify(trackingData))
            setTracking(false)
            saveProfile()
        });
    }

    const saveProfile = async() =>{
        const userData = {
            name:user==''? 'No User':user,
            uCode:user==''? 'No User':user
        }
        kineticTracker.getProfile(userData,function(error,data){
            console.log(data)
            if(error){
                alert("Error !")
                console.log(JSON.stringify(error))
            }
            else{
                console.log("successfully saved profile")
            }
        })
    }

    const value ={
        kineticTracker,
        data,
        setData,
        tracking,
        user,
        startTracking,
        stopTracking,
        setUser
    }
    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider