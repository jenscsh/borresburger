import Router from 'next/dist/next-server/lib/router/router'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <>
      <a href='/bestill'>Bestilling</a>
      <a href='/kjokken'>Kjøkken</a>
      <a href='/ordre'>Oversikt</a>
    </>
  )
}
