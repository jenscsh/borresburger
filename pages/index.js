import Router from 'next/dist/next-server/lib/router/router'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <>
      <a style={{margin: 10, fontSize: 20}} href='/bestill'>Bestilling</a>
      <a style={{margin: 10, fontSize: 20}} href='/kjokken'>Kjøkken</a>
      <a style={{margin: 10, fontSize: 20}} href='/ordre'>Oversikt</a>
    </>
  )
}
