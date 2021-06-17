import { useEffect, useState } from 'react';
import firebase from '../config/firebase';
import { createGlobalStyle } from 'styled-components';

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
            <GlobalStyle />
            <div className="display" style={{background: 'rgb(220, 255, 220)'}}>
                <h1>Klare til henting!</h1>
                {readyOrders.map((order, index) => {
                    return <div key={index} className="item" style={{background: 'lightgreen'}}>
                    <h2>{order.leveranseId}: </h2>
                    <ul>
                        {order.items.map(item => {
                            return <li key={item.id}>{item.type} x {item.amount}</li>
                        })}
                    </ul>
                </div>
                })}
            </div>
            <div className="display" style={{background: 'rgb(255, 255, 220)'}}>
                <h1>Vi jobber med...</h1>
                {workingOrders.map((order, index) => {
                    return <div key={index} className="item" style={{background: 'rgb(255, 255, 153)'}}>
                        <h2>{order.leveranseId}: </h2>
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

const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        font-size: 1.3rem;
    }
    main {
        display: grid;
        grid-template-columns: 50% 50%;
    }
    h1 {
        padding: 5px;
        font-size: 1.5rem;
    }
    h2 {
        font-size: 1.4rem;
    }
    .item {
        display: grid;
        grid-template-columns: 1fr 1fr;
        border: 1px solid black;
        border-width: 2px 0;
        padding: 5px;
        align-items: center;
    }
    .item > ul {
        justify-self: end;
    }
    .display {
        border: 1px solid black;
        border-width: 0 2px 0 0;
        height: 100vh
    }
`