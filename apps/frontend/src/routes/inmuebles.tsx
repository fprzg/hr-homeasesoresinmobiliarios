import { createFileRoute } from '@tanstack/react-router'
import { client } from '@/api'
import { useState } from 'react';

export const Route = createFileRoute('/inmuebles')({
  component: RouteComponent,
})

function RouteComponent() {
  const [inmuebles, setInmuebles] = useState({});

  async function getInmuebles() {
    const query = { page: "1", limit: "10", categoria: "si", }
    const res = await client.api.inmuebles.$get({ query })
    const data = await res.json();

    console.log(data.total);
  }
  return (
    <>
      <div>Hello "/inmuebles"!</div>
      <button onClick={() => getInmuebles()}>Click me!</button>
    </>
  );
}
