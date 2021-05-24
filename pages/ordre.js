import { useEffect, useState } from 'react';
import firebase from '../config/firebase';

export default function Overview() {
    const [orders, setOrders] = useState([]);
    const [workingOrders, setWorkingOrders] = useState([]);
    const [readyOrders, setReadyOrders] = useState([]);

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

    useEffect(() => {
        let ready = orders.filter(o => o.klar);
        setReadyOrders(ready);
        let working = orders.filter(o => !o.klar);
        setWorkingOrders(working);
    }, [orders]);

    return (
        <main>
            <div>
                <h1>Klare til henting</h1>
                {readyOrders.map(order => {
                    return <p>{order.leveranseId}:
                    <ul>
                            {order.items.map(item => {
                                return <li>{item.title}</li>
                            })}
                        </ul>
                    </p>
                })}
            </div>
            <div>
                <h1>Vi jobber med...</h1>
                {workingOrders.map(order => {
                    return <div key={order.leveranseId}>
                        <p>{order.leveranseId}: </p>
                        <ul>
                            {order.items.map(item => {
                                return <li key={item.id}>{item.type} x {item.amount}</li>
                            })}
                        </ul>
                    </div>
                })}
            </div>
        </main>
    )
}