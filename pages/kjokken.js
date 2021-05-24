import { useEffect, useState } from 'react';
import firebase from '../config/firebase'

export default function Kitchen() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        firebase.firestore().collection("bestillinger").where("levert", "==", false).orderBy("klar")
            .onSnapshot((querySnapshot) => {
                let o = [];
                querySnapshot.forEach((d) => {
                    let newD = d.data();
                    newD.storeId = d.id;
                    o.push(newD);
                });
                setOrders(o);
                console.log(orders);
            })
    }, []);

    function SetReady(id) {
        firebase.firestore().collection("bestillinger").doc(id).update({
            klar: true
        })
            .then(() => console.log("Set klar"))
    }
    function SetDelivered(id) {
        firebase.firestore().collection("bestillinger").doc(id).update({
            levert: true
        })
    }

    return (
        <main>
            <h1>Ordre:</h1>
            {orders.map(order => {
                return (
                    <div key={order.leveranseId}>
                        <h3>{order.leveranseId}</h3>
                        {order.items.map(item => {
                            return <p key={item.id} >{item.type} x {item.amount}</p>
                        })}
                        {!order.klar ?
                            <button onClick={() => SetReady(order.storeId)}>Klar</button> :
                            <button onClick={() => SetDelivered(order.storeId)}>Levert</button>
                        }
                    </div>)
            })}
        </main>
    )
}