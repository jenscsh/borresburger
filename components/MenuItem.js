export default function MenuItem(props) {
    return (<div>
        <p>{props.navn} - {props.pris} kr</p>
        <button onClick={()=>props.addCart(props.item)}>Legg til</button>
    </div>)
}