import { useEffect, useState } from 'react';
import firebase from '../config/firebase';

import { styled, createGlobalStyle } from 'styled-components';

import MenuItem from '../components/MenuItem';
import CartItem from '../components/CartItem';

export default function Order() {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [items, setItems] = useState([]);
    const [cart, setCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [login, setLogin] = useState(true);
    const [user, setUser] = useState(null);
    const [orderId, setOrderId] = useState(null);
    const [error, setError] = useState("");

    useEffect(async () => {
        try {
            const col = await firebase.firestore().collection('meny');
            const data = await col.get();
            let f = [];
            data.forEach(item => {
                let x = { ...item.data(), id: item.id };
                f.push(x);
            })
            setItems(f);
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        let amount = 0;
        cart.forEach(item => {
            amount += item.pris * item.amount;
        });
        setTotalPrice(amount);
    }, [cart]);

    useEffect(() => {
        if (orderId === null) return;
        firebase.firestore().collection('bestillinger').add({
            items: cart,
            pris: totalPrice,
            klar: false,
            levert: false,
            leveranseId: orderId
        })
            .catch(e => {
                console.error(e);
                setError(e.message);
            });
    }, [orderId]);

    async function HandleSubmit(evt) {
        setError("");
        evt.preventDefault();
        if (login) {
            try {
                let userCred = await firebase.auth().signInWithEmailAndPassword(email, password);
                setUser(userCred.user);
                console.log("Logget inn")
            } catch (error) {
                console.error(error);
                setError(error.message);
            }
        }
        else {
            try {
                let userCred = await firebase.auth().createUserWithEmailAndPassword(email, password);
                setUser(userCred.user);
                console.log("Ny bruker!");
            } catch (error) {
                console.error(error);
                if (error.code === "auth/email-already-in-use") setError(("Feil: denne eposten er allerede i bruk."))
                else setError("Feil: ", error.message);
            }
        }
    }

    function AddToCart(item) {
        if (!item.amount) item.amount = 1;
        let existing = cart.findIndex(thing => thing.id === item.id);
        if (existing === -1) setCart([...cart, item]);
        else {
            let a = cart;
            a[existing].amount++;
            setCart([...a]);
        }
    }

    function RemoveItem(item) {
        let newCart = cart.filter(x => x.type !== item.type);
        setCart(newCart);
    }

    function Order() {
        setOrderId(Math.floor(Math.random() * 1000));
    }

    function ToOrder() {
        setError("");
        setOrderId(null);
    }

    return (
        <main>
            <GlobalStyle />
            {!user ?
                <form onSubmit={HandleSubmit}>
                    <h3>Logg inn for å bestille</h3>
                    <label htmlFor='email'>E-post</label>
                    <input type='text' name='email' placeholder='Epost' onChange={e => setEmail(e.target.value)} />
                    <label htmlFor='password'>Passord</label>
                    <input type='password' name='password' placeholder='Passord' onChange={e => setPassword(e.target.value)} />
                    {login ?
                        <>
                            <button type='submit'>Logg inn</button>
                            <button type="button" className="swap" onClick={() => setLogin(false)} aria-label="Klikk her for å registrere deg" >Ny bruker?</button>
                        </> :
                        <>
                            <button type='submit'>Registrer bruker</button>
                            <button type="button" className="swap" onClick={() => setLogin(true)} aria-label="Klikk her for å logge inn">Har du bruker?</button>
                        </>}
                    {error !== "" ? <p className="error">{error}</p> : null}
                </form>
                : !orderId ? <>
                    <section className="items">
                        {(items.length === 0) ? (<p>Henter innhold, vennligst vent...</p>) :
                            items.map(item => {
                                return (
                                    <MenuItem navn={item.type} pris={item.pris} addCart={AddToCart} item={item} key={item.id} />
                                )
                            })}
                    </section>
                    <div className="cart">
                        <h3>Handlekurv</h3>
                        <ShoppingCart />
                    </div>
                </> : error === "" ?
                    <div className="final">
                        <h1>Ordre mottatt!</h1>
                        <h2>Ordrekoden din er:</h2>
                        <h1>{orderId}</h1>
                        <p>Vi jobber nå med bestillingen din.</p>
                        <button className="swap" onClick={ToOrder}>Tilbake til bestilling</button>
                    </div> :
                    <div className="final error">
                        <h1>Oi, det oppstod en feil</h1>
                        <h2>Ordren din er ikke mottatt.</h2>
                        <button className="swap" onClick={ToOrder}>Tilbake til bestilling</button>
                    </div>}
        </main>
    )

    function ShoppingCart() {
        return (
            cart.length === 0 ? <p>Ingenting her, legg noe til!</p> : <>
                {cart.map(cartItem => {
                    return (
                        <CartItem navn={cartItem.type} pris={cartItem.pris} removeItem={RemoveItem} mengde={cartItem.amount} item={cartItem} key={cartItem.id} />
                    )
                }
                )}
                <h3 style={{ textDecoration: "underline" }}>Totalt beløp: {totalPrice} kr</h3>
                <button onClick={Order}>Bestill</button>
            </>
        )
    }
}

const GlobalStyle = createGlobalStyle`
    * {
        margin: 5px 0;
        padding: 0;
    }
    form {
        display: grid;
        width: 90vw;
        max-width: 500px;
        margin: auto;
        margin-top: 50px;
        border: 1px solid black;
        font-size: 1rem;
        padding: 10px;
    }
    form > input {
        margin-bottom: 10px;
        margin-top: 0;
        padding: 5px;
    }
    form > button {
        margin: auto;
    }
    .swap {
        color: blue;
        cursor: pointer;
        text-decoration: underline;
        margin-top: 5px;
        border: 0;
        margin: 5px 0;
    }
    .error {
        background: pink;
        color: darkred;
        padding: 2px;
        text-align: center;
    }
    .items {
        max-width: 500px;
        margin: auto;
        margin-top: 10px;
    }
    button {
        background: white;
        border-radius: 10%;
        padding: 5px;
        font-size: 1rem;
    }
    .cart {
        max-width: 500px;
        margin: auto;
        border: 1px dashed black;
        margin-top: 10px;
        padding: 10px;
    }
    .final {
        max-width: 500px;
        margin: auto;
        margin-top: 50px;
        padding: 10px;
        border: 1px solid black;
    }
`