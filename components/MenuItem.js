import { createGlobalStyle, styled } from 'styled-components';

export default function MenuItem(props) {
    return (<div className="menuItem">
        <GlobalStyle />
        <h4 className="navn">{props.navn}</h4>
        <h4 className="pris">{props.pris} kr</h4>
        <button onClick={() => props.addCart(props.item)}>Legg til</button>
    </div>)
}

const GlobalStyle = createGlobalStyle`
    .menuItem {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr;
        justify-items: end;
        align-items: center;
        border: 1px solid black;
        padding: 5px;
    }
    .navn {
        justify-self: start
    }
`