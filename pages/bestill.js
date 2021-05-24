import { useEffect, useState } from 'react';
import firebase from '../config/firebase';

import MenuItem from '../components/MenuItem'

export default function Order() {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [items, setItems] = useState([]);
    const [cart, setCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [login, setLogin] = useState(false);
    const [user, setUser] = useState(null);
    const [orderId, setOrderId] = useState();

    useEffect(() => {
        let amount = 0;
        cart.forEach(item => {
            amount += item.pris * item.amount;
        });
        setTotalPrice(amount);
    }, [cart]);

    async function HandleSubmit(evt) {
        evt.preventDefault();
        if (login) {
            try {
                let userCred = await firebase.auth().signInWithEmailAndPassword(email, password);
                setUser(userCred.user);
                console.log("Logget inn")
            } catch (error) {
                console.error(error);
            }
        }
        else {
            try {
                let userCred = await firebase.auth().createUserWithEmailAndPassword(email, password);
                setUser(userCred.user);
                console.log("Ny bruker!");
            } catch (error) {
                console.error(error);
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

    function Order() {
        setOrderId(Math.floor(Math.random() * 1000));
        firebase.firestore().collection('bestillinger').add({
            items: cart,
            pris: totalPrice,
            klar: false,
            levert: false,
            leveranseId: orderId
        })
            .catch(e => console.error(e));
    }

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

    return (
        <main>
            {!user ?
                <form onSubmit={HandleSubmit}>
                    <label htmlFor='email'>E-post</label>
                    <input type='text' name='email' placeholder='Epost' onChange={e => setEmail(e.target.value)} />
                    <label htmlFor='password'>Passord</label>
                    <input type='password' name='password' placeholder='Passord' onChange={e => setPassword(e.target.value)} />
                    {login ?
                        <>
                            <button type='submit'>Logg inn</button>
                            <a onClick={() => setLogin(false)}>Ny bruker?</a>
                        </> :
                        <>
                            <button type='submit'>Registrer bruker</button>
                            <a onClick={() => setLogin(true)}>Logg inn</a>
                        </>}
                </form>
                : null}
            {(items.length === 0) ? (<p>Henter innhold</p>) :
                items.map(item => {
                    return (
                        <MenuItem navn={item.type} pris={item.pris} addCart={AddToCart} item={item} key={item.id} />
                    )
                })}
            <div>
                <h3>Handlekurv</h3>
                <ShoppingCart />
                {/* {(cart === []) ? (<p>Ingenting her</p>) :
                    cart.map(cartItem => {
                        return (
                            <div>{cartItem.type} - {cartItem.pris} kr</div>
                        )
                    })} */}
            </div>
        </main>
    )

    function ShoppingCart() {
        return (
            cart.length === 0 ? <p>Ingenting her</p> : <>
                {cart.map(cartItem => {
                    return (
                        <article key={cartItem.id} >{cartItem.type} - {cartItem.pris} kr x {cartItem.amount}</article>
                    )
                }
                )}
                <h3>Totalt beløp: {totalPrice} kr</h3>
                <button onClick={Order}>Bestill</button>
            </>
        )
    }
}