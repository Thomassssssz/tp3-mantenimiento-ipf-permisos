import { Linking, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { InfoRecurso, TipoRecurso, EstadoPermiso } from './types';

export const RECURSOS_INFO: Record<TipoRecurso, InfoRecurso> = {
  camera: {
    recurso: 'camera',
    nombre: 'Cámara',
    descripcionUso: 'Usamos tu cámara para escanear códigos QR de aulas y fotografiar desperfectos.',
    momentoPedido: 'Al presionar "Escanear QR" o "Sacar foto" dentro de un reporte.',
    alternativa: 'Escribir el aula manualmente o adjuntar imagen con el selector del sistema.',
  },
  location: {
    recurso: 'location',
    nombre: 'Ubicación',
    descripcionUso: 'Usamos tu ubicación para georreferenciar el desperfecto dentro del predio del instituto.',
    momentoPedido: 'Al presionar "Marcar ubicación" en el formulario del reporte.',
    alternativa: 'Seleccionar el sector del instituto manualmente de una lista.',
  },
  photos: {
    recurso: 'photos',
    nombre: 'Galería de fotos',
    descripcionUso: 'Para adjuntar imágenes existentes. Se utiliza el selector del sistema para no exigir permisos de almacenamiento.',
    momentoPedido: 'Al elegir fotos desde la galería o consultar el estado de la biblioteca multimedia.',
    alternativa: 'Tomar fotografía con cámara o continuar sin adjuntar imagen.',
  },
  notifications: {
    recurso: 'notifications',
    nombre: 'Notificaciones',
    descripcionUso: 'Usamos las notificaciones para avisarte inmediatamente cuando tu reporte cambie de estado o sea resuelto.',
    momentoPedido: 'Únicamente cuando activás el interruptor "Avisarme cuando se resuelva mi reporte" en Ajustes.',
    alternativa: 'Consultar las resoluciones y novedades dentro de la pestaña "Avisos".',
  },
};

export async function abrirAjustesDispositivo(): Promise<void> {
  try {
    await Linking.openSettings();
  } catch (error) {
    console.error('Error al abrir los ajustes del dispositivo:', error);
  }
}

//asegurar canal de notificaciones en android
export async function asegurarCanalReportesAndroid(): Promise<void> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('reportes', {
      name: 'Reportes de Mantenimiento',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#208AEF',
    });
  }
}

export function obtenerEtiquetaEstado(estado: EstadoPermiso, parcial = false): string {
  if (parcial) {
    return 'Concedido (Parcial)';
  }

  switch (estado) {
    case 'cargando':
      return 'Consultando...';
    case 'concedido':
      return 'Concedido';
    case 'preguntable':
      return 'Preguntable';
    case 'bloqueado':
      return 'Bloqueado';
    default:
      return 'Desconocido';
  }
}
