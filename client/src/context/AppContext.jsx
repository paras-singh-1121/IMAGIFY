import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

export const AppContext = createContext()

const AppContextProvider = ( props ) => {
    const [ user, setUser ] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [ token, setToken ] = useState(localStorage.getItem('token'))


    const [credit, setCredit] = useState(false)
    // const backendUrl = import.meta.env.VITE_BACKEND_URL

    const razorpayKeyId = 'rzp_test_S2Cl4m5SgYrXVA'

    const navigate = useNavigate()

    const loadCreditsData = async () =>{
        try {
            const {data} = await axiosInstance.get('/user/credits', { headers: {token}})

            if(data.success){
                setCredit(data.credits)
                setUser(data.user)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const generateImage = async (prompt) => {
        try {
           const {data} = await axiosInstance.post('/image/generate-image', { prompt }, {headers: {token}})

           if(data.success){
            loadCreditsData()
            return data.resultImage
        }else{
            toast.error(data.message)
            loadCreditsData()
            if(data.creditBalance === 0) {
                navigate('/buy')
            }
        }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const logout = ()=>{
        localStorage.removeItem('token')
        setToken('')
        setUser(null)
    }

    useEffect(()=>{
        if(token){
            loadCreditsData()
        }
    },[token])

    const value = {
        user, setUser, showLogin, setShowLogin, token, setToken, credit, setCredit, loadCreditsData, logout, generateImage, razorpayKeyId
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
export default AppContextProvider;