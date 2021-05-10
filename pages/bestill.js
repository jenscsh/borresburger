import { useEffect, useState } from 'react';
import firebase from '../config/firebase';

import MenuItem from '../components/MenuItem'

export default function Order() {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [items, setItems] = useState([]);
    const [cart, setCart] = useState([]);
    let login = false;

    async function HandleSubmit(evt) {
        evt.preventDefault();
        if (login) {
            try {
                await firebase.auth().signInWithEmailAndPassword(email, password);
                console.log("Logget inn")
            } catch (error) {
                console.error(error);
            }
        }
        else {
            try {
                await firebase.auth().createUserWithEmailAndPassword(email, password);
                console.log("Ny bruker!");
            } catch (error) {
                console.error(error);
            }
        }
    }

    function AddToCart(item) {
        setCart([...cart, item]);
        // console.log(cart);
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
        <>
            <form onSubmit={HandleSubmit}>
                <label htmlFor='email'>E-post</label>
                <input type='text' name='email' placeholder='Epost' onChange={e => setEmail(e.target.value)} />
                <label htmlFor='password'>Passord</label>
                <input type='password' name='password' placeholder='Passord' onChange={e => setPassword(e.target.value)} />
                <button type='submit' onClick={() => login = false}>Registrer bruker</button>
                <button type='submit' onClick={() => login = true}>Logg inn</button>
            </form>
            {(items == []) ? (<p>Henter innhold</p>) :
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
        </>
    )

    function ShoppingCart() {
        console.log(cart);
        return (
            (cart == []) ? (<p>Ingenting her</p>) :
                cart.map(cartItem => {
                    return (
                        <div>{cartItem.type} - {cartItem.pris} kr</div>
                    )
                })
        )
    }
}