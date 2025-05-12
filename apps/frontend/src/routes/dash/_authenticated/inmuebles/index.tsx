import { createFileRoute } from '@tanstack/react-router';
import { InmueblesApi } from "@/api";
import { crearCasa, crearTerreno, estadosMexico, InmuebleBaseType, InmuebleType } from "@shared/zod/src";
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

import { InmuebleForm } from '@/components/inmueble-form';

export const Route = createFileRoute('/dash/_authenticated/inmuebles/')({
  component: NuevoDocumento,
});

function NuevoDocumento() {
  return (
    <>
      <InmuebleForm />
    </>
  )
}