import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { useApp } from '@/context/AppContext';
import { usePermiso } from '@/hooks/usePermiso';
import { asegurarCanalReportesAndroid } from '@/lib/permisos';

export default function DetalleReporteScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const idParam = params.id;

  const { obtenerReportePorId, resolverReporte, agregarAviso, notificacionesHabilitadas } = useApp();
  const { consultar: consultarNotificaciones } = usePermiso('notifications');

  const [procesando, setProcesando] = useState(false);

  //validar que el id sea valido
  if (!idParam) {
    return (
      <View style={styles.contenedorError}>
        <Text style={styles.tituloError}>Reporte no encontrado</Text>
        <Text style={styles.mensajeError}>No se proporcionó un identificador válido.</Text>
        <Pressable style={styles.botonVolver} onPress={() => router.back()}>
          <Text style={styles.textoBotonVolver}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  //buscar reporte mediante appcontext
  const reporte = obtenerReportePorId(idParam);

  if (!reporte) {
    return (
      <View style={styles.contenedorError}>
        <Text style={styles.tituloError}>Reporte no encontrado</Text>
        <Text style={styles.mensajeError}>El reporte solicitado no existe o fue eliminado.</Text>
        <Pressable style={styles.botonVolver} onPress={() => router.back()}>
          <Text style={styles.textoBotonVolver}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  //simular resolucion del reporte
  const handleSimularResolucion = async () => {
    setProcesando(true);

    try {
      //cambiar el reporte a estado resuelto
      resolverReporte(reporte.id);

      //crear siempre un aviso dentro de la app
      agregarAviso({
        reporteId: reporte.id,
        titulo: 'Reporte resuelto',
        mensaje: `Tu reporte ${reporte.titulo} fue marcado como resuelto.`,
      });

      //consultar permiso actual de notificaciones
      const estadoActual = await consultarNotificaciones();

      //programar notificacion local si esta concedido y habilitado
      if (notificacionesHabilitadas && estadoActual === 'concedido') {
        //asegurar existencia del canal en android
        await asegurarCanalReportesAndroid();

        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Reporte resuelto',
            body: `Tu reporte ${reporte.titulo} fue marcado como resuelto.`,
            data: { reporteId: reporte.id },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 10,
            channelId: 'reportes',
          },
        });

        Alert.alert(
          'Resolución simulada',
          'El reporte fue marcado como resuelto. Se programó una notificación para dentro de 10 segundos y se creó un aviso en la app.'
        );
      } else {
        //fallback cuando no hay permiso o preferencia desactivada
        Alert.alert(
          'Resolución simulada',
          'El reporte fue marcado como resuelto. La notificación se guardó en la pestaña Avisos debido a que las notificaciones están inactivas o denegadas.'
        );
      }
    } catch (error) {
      console.warn('Error al simular resolucion:', error);
      Alert.alert('Error', 'No se pudo completar la simulación de resolución.');
    } finally {
      setProcesando(false);
    }
  };

  const badgeColor = {
    pendiente: '#f59e0b',
    en_curso: '#0284c7',
    resuelto: '#16a34a',
  }[reporte.estado];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* encabezado y estado */}
      <View style={styles.filaHeader}>
        <Text style={styles.titulo}>{reporte.titulo}</Text>
        <View style={[styles.badgeEstado, { backgroundColor: badgeColor }]}>
          <Text style={styles.textoBadgeEstado}>{reporte.estado.toUpperCase()}</Text>
        </View>
      </View>

      <Text style={styles.fechaTexto}>
        Creado: {new Date(reporte.creadoEn).toLocaleString()}
      </Text>

      {reporte.resueltoEn && (
        <Text style={styles.fechaResueltoTexto}>
          Resuelto: {new Date(reporte.resueltoEn).toLocaleString()}
        </Text>
      )}

      {/* tarjeta de datos del reporte */}
      <View style={styles.tarjetaDetalles}>
        <Text style={styles.seccionLabel}>Descripción:</Text>
        <Text style={styles.descripcionTexto}>{reporte.descripcion}</Text>

        <View style={styles.separador} />

        <View style={styles.filaInfo}>
          <Text style={styles.infoLabel}>Categoría:</Text>
          <Text style={styles.infoValor}>{reporte.categoria.toUpperCase()}</Text>
        </View>

        {reporte.aula ? (
          <View style={styles.filaInfo}>
            <Text style={styles.infoLabel}>Aula / Espacio:</Text>
            <Text style={styles.infoValor}>{reporte.aula}</Text>
          </View>
        ) : null}

        {/* geolocalizacion o sector manual */}
        {reporte.ubicacion && (
          <View style={styles.filaInfoUbicacion}>
            <Text style={styles.infoLabel}>Ubicación:</Text>
            {reporte.ubicacion.sectorManual ? (
              <Text style={styles.infoValor}>Sector {reporte.ubicacion.sectorManual}</Text>
            ) : reporte.ubicacion.esAproximada ? (
              <Text style={styles.infoValorAproximada}>Ubicación aproximada registrada</Text>
            ) : reporte.ubicacion.latitud ? (
              <Text style={styles.infoValor}>
                Lat: {reporte.ubicacion.latitud.toFixed(5)}, Long: {reporte.ubicacion.longitud?.toFixed(5)}
              </Text>
            ) : (
              <Text style={styles.infoValor}>Registrada</Text>
            )}
          </View>
        )}
      </View>

      {/* fotografia adjunta si existe */}
      {reporte.fotoUri && (
        <View style={styles.seccionFoto}>
          <Text style={styles.seccionLabel}>Fotografía adjunta:</Text>
          <Image
            source={{ uri: reporte.fotoUri }}
            style={styles.imagenAdjunta}
            resizeMode="cover"
          />
        </View>
      )}

      {/* boton de simular resolucion */}
      <View style={styles.seccionAcciones}>
        {reporte.estado === 'resuelto' ? (
          <View style={styles.cajaYaResuelto}>
            <Text style={styles.textoYaResuelto}>Este reporte ya ha sido resuelto.</Text>
          </View>
        ) : (
          <Pressable
            style={[styles.botonSimular, procesando && styles.botonDeshabilitado]}
            onPress={handleSimularResolucion}
            disabled={procesando}
          >
            {procesando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.textoBotonSimular}>Simular resolución</Text>
            )}
          </Pressable>
        )}

        <Pressable style={styles.botonVolverSecundario} onPress={() => router.back()}>
          <Text style={styles.textoBotonVolverSecundario}>Volver al listado</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  contenedorError: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  tituloError: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 8,
  },
  mensajeError: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
  },
  filaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 4,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    flex: 1,
  },
  badgeEstado: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  textoBadgeEstado: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  fechaTexto: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
  },
  fechaResueltoTexto: {
    fontSize: 12,
    color: '#16a34a',
    fontWeight: '600',
    marginBottom: 16,
  },
  tarjetaDetalles: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginVertical: 14,
  },
  seccionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  descripcionTexto: {
    fontSize: 15,
    color: '#1e293b',
    lineHeight: 22,
  },
  separador: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 12,
  },
  filaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  filaInfoUbicacion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  infoValor: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '600',
  },
  infoValorAproximada: {
    fontSize: 13,
    color: '#b45309',
    fontWeight: '700',
  },
  seccionFoto: {
    marginVertical: 14,
  },
  imagenAdjunta: {
    width: '100%',
    height: 220,
    borderRadius: 10,
    backgroundColor: '#e2e8f0',
  },
  seccionAcciones: {
    marginTop: 20,
    gap: 12,
  },
  cajaYaResuelto: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoYaResuelto: {
    color: '#16a34a',
    fontSize: 14,
    fontWeight: '700',
  },
  botonSimular: {
    backgroundColor: '#208AEF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  botonDeshabilitado: {
    opacity: 0.6,
  },
  textoBotonSimular: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  botonVolverSecundario: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoBotonVolverSecundario: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '600',
  },
  botonVolver: {
    backgroundColor: '#0f172a',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  textoBotonVolver: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
