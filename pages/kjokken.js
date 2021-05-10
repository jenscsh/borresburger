import { useEffect } from 'react';
import firebase from '../config/firebase'

export default function Kitchen() {
    let orders = [];
    firebase.firestore().collection("bestillinger").where("klar","==",false)
        .onSnapshot((querySnapshot)=>{
            querySnapshot.forEach((d)=>{
                orders.push(d.data());
            })
            console.log(orders);
        })
    useEffect(async ()=>{
        
    },[]);
    return (
        <></>
    )
}