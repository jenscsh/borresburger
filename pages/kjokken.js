import { useEffect, useState } from 'react';
import firebase from '../config/firebase';
import { createGlobalStyle } from 'styled-components';

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
            })
    }, []);

    function SetReady(id) {
        firebase.firestore().collection("bestillinger").doc(id).update({
            klar: true
        })
    }

    function SetDelivered(id) {
        firebase.firestore().collection("bestillinger").doc(id).update({
            levert: true
        })
    }

    return (
        <main>
            <GlobalStyle />
            <h1>Ordre:</h1>
            {orders.map((order, index) => {
                return (
                    <div className="order" key={index} style={order.klar ? { background: 'lightgreen' } : null}>
                        <h3>{order.leveranseId}</h3>
                        <div>
                            {order.items.map((item, index) => {
                                return <p key={index} >{item.type} x {item.amount}</p>
                            })}
                        </div>
                        {!order.klar ?
                            <button onClick={() => SetReady(order.storeId)}>Klar</button> :
                            <button onClick={() => SetDelivered(order.storeId)}>Sett som levert</button>
                        }
                    </div>)
            })}
        </main>
    )
}

const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        font-size: 1.1rem;
    }
    h1 {
        font-size: 2rem;
        max-width: 1000px;
        margin: auto;
    }
    .order {
        display: grid;
        max-width: 1000px;
        grid-template-columns: 1fr 1fr 1fr;
        margin: 5px auto;
        background: lightyellow;
        border: 1px solid black;
        align-items: center;
        padding: 5px
    }
    .order > h3 {
        font-size: 2rem;
    }
    button {
        background: white;
        border-radius: 10%;
        padding: 5px;
        font-size: 1rem;
        justify-self: end;
    }
`