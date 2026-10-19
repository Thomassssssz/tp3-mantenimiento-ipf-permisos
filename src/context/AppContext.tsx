import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  Reporte,
  Aviso,
  NuevoReporteInput,
  NuevoAvisoInput,
  EstadoReporte,
} from '@/lib/types';

interface AppContextType {
  reportes: Reporte[];
  avisos: Aviso[];
  notificacionesHabilitadas: boolean;
  setNotificacionesHabilitadas: (habilitadas: boolean) => void;
  crearReporte: (datos: NuevoReporteInput) => Reporte;
  resolverReporte: (id: string) => void;
  cambiarEstadoReporte: (id: string, nuevoEstado: EstadoReporte) => void;
  agregarAviso: (datos: NuevoAvisoInput) => Aviso;
  marcarAvisoLeido: (id: string) => void;
  obtenerReportePorId: (id: string) => Reporte | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [notificacionesHabilitadas, setNotificacionesHabilitadas] = useState<boolean>(false);

  const crearReporte = (datos: NuevoReporteInput): Reporte => {
    const nuevoReporte: Reporte = {
      ...datos,
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      estado: 'pendiente',
      creadoEn: new Date().toISOString(),
    };
    setReportes((prev) => [nuevoReporte, ...prev]);
    return nuevoReporte;
  };

  const resolverReporte = (id: string) => {
    setReportes((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, estado: 'resuelto', resueltoEn: new Date().toISOString() }
          : r
      )
    );
  };

  const cambiarEstadoReporte = (id: string, nuevoEstado: EstadoReporte) => {
    setReportes((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              estado: nuevoEstado,
              resueltoEn: nuevoEstado === 'resuelto' ? new Date().toISOString() : r.resueltoEn,
            }
          : r
      )
    );
  };

  const agregarAviso = (datos: NuevoAvisoInput): Aviso => {
    const nuevoAviso: Aviso = {
      ...datos,
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      fecha: new Date().toISOString(),
      leido: false,
    };
    setAvisos((prev) => [nuevoAviso, ...prev]);
    return nuevoAviso;
  };

  const marcarAvisoLeido = (id: string) => {
    setAvisos((prev) =>
      prev.map((a) => (a.id === id ? { ...a, leido: true } : a))
    );
  };

  const obtenerReportePorId = (id: string): Reporte | undefined => {
    return reportes.find((r) => r.id === id);
  };

  return (
    <AppContext.Provider
      value={{
        reportes,
        avisos,
        notificacionesHabilitadas,
        setNotificacionesHabilitadas,
        crearReporte,
        resolverReporte,
        cambiarEstadoReporte,
        agregarAviso,
        marcarAvisoLeido,
        obtenerReportePorId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe ser utilizado dentro de un AppProvider');
  }
  return context;
}
