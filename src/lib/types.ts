export type TipoRecurso = 'camera' | 'location' | 'photos' | 'notifications';

export type EstadoPermiso = 'cargando' | 'concedido' | 'preguntable' | 'bloqueado';

export interface PermisoEstado {
  recurso: TipoRecurso;
  estado: EstadoPermiso;
  parcial: boolean; // true si es ubicación aproximada o fotos limitadas
  detalle?: string;
}

export type CategoriaReporte = 'electricidad' | 'agua' | 'mobiliario' | 'equipos';

export type EstadoReporte = 'pendiente' | 'en_curso' | 'resuelto';

export interface ReporteUbicacion {
  latitud?: number;
  longitud?: number;
  esAproximada?: boolean;
  sectorManual?: string;
}

export interface Reporte {
  id: string;
  titulo: string;
  descripcion: string;
  aula: string;
  categoria: CategoriaReporte;
  fotoUri?: string;
  ubicacion?: ReporteUbicacion;
  estado: EstadoReporte;
  creadoEn: string;
  resueltoEn?: string;
}

export type NuevoReporteInput = Omit<Reporte, 'id' | 'estado' | 'creadoEn' | 'resueltoEn'>;

export interface Aviso {
  id: string;
  reporteId?: string;
  titulo: string;
  mensaje: string;
  fecha: string;
  leido: boolean;
}

export type NuevoAvisoInput = Omit<Aviso, 'id' | 'fecha' | 'leido'>;

export interface InfoRecurso {
  recurso: TipoRecurso;
  nombre: string;
  descripcionUso: string;
  momentoPedido: string;
  alternativa: string;
}
