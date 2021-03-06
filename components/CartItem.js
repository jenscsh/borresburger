import { createGlobalStyle, styled } from 'styled-components';

export default function CartItem(props) {
    return (<div className="cartItem">
        <GlobalStyle />
        <h4 className="navn">{props.navn}</h4>
        <h4 className="pris">{props.pris} kr</h4>
        <h4 aria-label={"Antall " + props.navn + " i handle kurven"}>x{props.mengde}</h4>
        <button onClick={() => { props.item.amount = 1; props.removeItem(props.item) }}>Fjern</button>
    </div>)
}

const GlobalStyle = createGlobalStyle`
    .cartItem {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1fr;
        justify-items: end;
        align-items: center;
        padding: 5px;
        background: lightgrey;
    }
    .cartItem > * {
        margin: 5px 0 5px 0;
    }
    .navn {
        justify-self: start
    }
`