export default function MenuItem(props) {
    return (<div>
        <h4>{props.navn} - {props.pris} kr</h4>
        <button onClick={() => props.addCart(props.item)}>Legg til</button>
    </div>)
}