import axios from "axios"
const baseURL = process.env.REACT_APP_BASE_URL

const Api = axios.create({
    baseURL: baseURL,
    headers:{
        'Content-Type': 'application/json',
        'sid-key': process.env.REACT_APP_API_KEY,
        'sid-pkg-id': process.env.REACT_APP_API_SECRET,
        'sid-secret': process.env.REACT_APP_PACKAGE_NAME,
        'sid-version': '1.0'
    }
})

export const getProfile = async(name, userId) =>{
}