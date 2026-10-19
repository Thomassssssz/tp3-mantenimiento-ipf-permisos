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
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Notifications from 'expo-notifications';
import { useApp } from '@/context/AppContext';
import { usePermiso } from '@/hooks/usePermiso';
import { asegurarCanalReportesAndroid } from '@/lib/permisos';
import { theme } from '@/lib/theme';
import { CategoriaReporte } from '@/lib/types';

function getCategoriaIcon(categoria: CategoriaReporte): {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  label: string;
} {
  switch (categoria) {
    case 'electricidad':
      return { icon: 'flash-outline', color: '#d97706', label: 'Electricidad' };
    case 'agua':
      return { icon: 'water-outline', color: '#0284c7', label: 'Agua' };
    case 'mobiliario':
      return { icon: 'construct-outline', color: '#7c3aed', label: 'Mobiliario' };
    case 'equipos':
      return { icon: 'desktop-outline', color: '#475569', label: 'Equipos' };
    default:
      return { icon: 'document-text-outline', color: '#64748b', label: categoria };
  }
}

//pantalla de detalle de un reporte individual
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
        <Ionicons name="alert-circle-outline" size={48} color="#dc2626" />
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
        <Ionicons name="search-outline" size={48} color="#94a3b8" />
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

  const estadoEstilo = theme.colors.status[reporte.estado];
  const catConfig = getCategoriaIcon(reporte.categoria);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/*encabezado visual con categoria, titulo y estado*/}
      <View style={styles.encabezadoVisual}>
        <View style={styles.filaCategoriaYEstado}>
          <View style={styles.badgeCategoria}>
            <Ionicons name={catConfig.icon} size={14} color={catConfig.color} />
            <Text style={[styles.textoBadgeCategoria, { color: catConfig.color }]}>
              {catConfig.label}
            </Text>
          </View>

          <View
            style={[
              styles.chipEstado,
              { backgroundColor: estadoEstilo.bg, borderColor: estadoEstilo.border },
            ]}
          >
            <Text style={[styles.textoChipEstado, { color: estadoEstilo.text }]}>
              {estadoEstilo.label}
            </Text>
          </View>
        </View>

        <Text style={styles.titulo}>{reporte.titulo}</Text>

        <View style={styles.filaTiempos}>
          <Text style={styles.fechaTexto}>
            Creado: {new Date(reporte.creadoEn).toLocaleString()}
          </Text>
          {reporte.resueltoEn && (
            <Text style={styles.fechaResueltoTexto}>
              ✓ Resuelto: {new Date(reporte.resueltoEn).toLocaleString()}
            </Text>
          )}
        </View>
      </View>

      {/*seccion 1: descripcion*/}
      <View style={styles.seccionCard}>
        <View style={styles.seccionHeader}>
          <Ionicons name="document-text-outline" size={17} color={theme.colors.primary} />
          <Text style={styles.seccionTitulo}>Descripción</Text>
        </View>
        <Text style={styles.descripcionTexto}>{reporte.descripcion}</Text>
      </View>

      {/*seccion 2: aula / sector*/}
      <View style={styles.seccionCard}>
        <View style={styles.seccionHeader}>
          <Ionicons name="business-outline" size={17} color={theme.colors.primary} />
          <Text style={styles.seccionTitulo}>Aula / Sector</Text>
        </View>
        <View style={styles.filasDatos}>
          <View style={styles.itemDato}>
            <Text style={styles.datoEtiqueta}>Aula asignada:</Text>
            <Text style={styles.datoValor}>{reporte.aula || 'Sin aula especificada'}</Text>
          </View>
          {reporte.ubicacion?.sectorManual && (
            <View style={styles.itemDato}>
              <Text style={styles.datoEtiqueta}>Sector institucional:</Text>
              <Text style={styles.datoValor}>{reporte.ubicacion.sectorManual}</Text>
            </View>
          )}
        </View>
      </View>

      {/*seccion 3: ubicacion georreferenciada*/}
      <View style={styles.seccionCard}>
        <View style={styles.seccionHeader}>
          <Ionicons name="location-outline" size={17} color={theme.colors.primary} />
          <Text style={styles.seccionTitulo}>Ubicación</Text>
        </View>
        {reporte.ubicacion ? (
          <View style={styles.ubicacionInfoContainer}>
            {reporte.ubicacion.sectorManual ? (
              <Text style={styles.ubicacionValor}>
                Registrado manualmente en el sector: <Text style={styles.textoResaltado}>{reporte.ubicacion.sectorManual}</Text>
              </Text>
            ) : reporte.ubicacion.esAproximada ? (
              <View style={styles.alertaAproximada}>
                <Ionicons name="information-circle-outline" size={16} color="#b45309" />
                <Text style={styles.textoAlertaAproximada}>
                  Ubicación aproximada registrada (Área general estimada del predio)
                </Text>
              </View>
            ) : reporte.ubicacion.latitud ? (
              <View style={styles.coordenadasFila}>
                <Text style={styles.coordenadaTexto}>
                  Lat: {reporte.ubicacion.latitud.toFixed(5)}
                </Text>
                <Text style={styles.coordenadaTexto}>
                  Long: {reporte.ubicacion.longitud?.toFixed(5)}
                </Text>
              </View>
            ) : (
              <Text style={styles.ubicacionValor}>Ubicación registrada</Text>
            )}
          </View>
        ) : (
          <Text style={styles.sinDatoTexto}>No se registró georreferenciación para este reporte.</Text>
        )}
      </View>

      {/*seccion 4: evidencia fotografica*/}
      <View style={styles.seccionCard}>
        <View style={styles.seccionHeader}>
          <Ionicons name="image-outline" size={17} color={theme.colors.primary} />
          <Text style={styles.seccionTitulo}>Evidencia fotográfica</Text>
        </View>
        {reporte.fotoUri ? (
          <View style={styles.contenedorFoto}>
            <Image
              source={{ uri: reporte.fotoUri }}
              style={styles.imagenAdjunta}
              resizeMode="cover"
            />
          </View>
        ) : (
          <Text style={styles.sinDatoTexto}>No se adjuntó fotografía en este reporte.</Text>
        )}
      </View>

      {/*seccion 5: estado actual*/}
      <View style={styles.seccionCard}>
        <View style={styles.seccionHeader}>
          <Ionicons name="time-outline" size={17} color={theme.colors.primary} />
          <Text style={styles.seccionTitulo}>Estado del reporte</Text>
        </View>
        <View style={styles.estadoDetalleFila}>
          <View
            style={[
              styles.chipEstado,
              { backgroundColor: estadoEstilo.bg, borderColor: estadoEstilo.border },
            ]}
          >
            <Text style={[styles.textoChipEstado, { color: estadoEstilo.text }]}>
              {estadoEstilo.label}
            </Text>
          </View>
          <Text style={styles.estadoDescripcionTexto}>
            {reporte.estado === 'resuelto'
              ? 'El desperfecto fue solucionado por el equipo de mantenimiento.'
              : reporte.estado === 'en_curso'
              ? 'Personal técnico asignado trabajando en el lugar.'
              : 'Reporte ingresado en espera de revisión inicial.'}
          </Text>
        </View>
      </View>

      {/*seccion de prueba demostrativa claramente secundaria*/}
      <View style={styles.tarjetaSimulacionDemo}>
        <View style={styles.demoHeader}>
          <Ionicons name="flask-outline" size={18} color="#0284c7" />
          <Text style={styles.demoTitulo}>Función de demostración</Text>
        </View>
        <Text style={styles.demoBajada}>
          Permite probar el flujo de resolución simulada, programando una notificación local a los 10 segundos y registrando el aviso correspondiente.
        </Text>

        {reporte.estado === 'resuelto' ? (
          <View style={styles.cajaYaResuelto}>
            <Ionicons name="checkmark-done-circle" size={18} color="#15803d" />
            <Text style={styles.textoYaResuelto}>Este reporte ya ha sido resuelto.</Text>
          </View>
        ) : (
          <Pressable
            style={[styles.botonSimularSecundario, procesando && styles.botonDeshabilitado]}
            onPress={handleSimularResolucion}
            disabled={procesando}
          >
            {procesando ? (
              <ActivityIndicator color="#0284c7" />
            ) : (
              <>
                <Ionicons name="play-outline" size={16} color="#0284c7" />
                <Text style={styles.textoBotonSimular}>Simular resolución</Text>
              </>
            )}
          </Pressable>
        )}
      </View>

      {/*boton volver*/}
      <Pressable style={styles.botonVolverSecundario} onPress={() => router.back()}>
        <Ionicons name="arrow-back-outline" size={16} color="#334155" />
        <Text style={styles.textoBotonVolverSecundario}>Volver al listado</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.xl,
    paddingBottom: 40,
  },
  contenedorError: {
    flex: 1,
    padding: theme.spacing.xxl,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  tituloError: {
    fontSize: 20,
    fontWeight: '700',
    color: '#dc2626',
    marginTop: 12,
    marginBottom: 6,
  },
  mensajeError: {
    fontSize: 14,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginBottom: 20,
  },
  botonVolver: {
    backgroundColor: theme.colors.primaryDark,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: theme.borderRadius.md,
  },
  textoBotonVolver: {
    color: '#ffffff',
    fontWeight: '700',
  },
  encabezadoVisual: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  filaCategoriaYEstado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeCategoria: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.borderLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  textoBadgeCategoria: {
    fontSize: 12,
    fontWeight: '700',
  },
  chipEstado: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  textoChipEstado: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  titulo: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    lineHeight: 28,
    marginBottom: 10,
  },
  filaTiempos: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
    gap: 4,
  },
  fechaTexto: {
    fontSize: 12,
    color: theme.colors.textLight,
  },
  fechaResueltoTexto: {
    fontSize: 12,
    color: '#15803d',
    fontWeight: '600',
  },
  seccionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  seccionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  seccionTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  descripcionTexto: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  filasDatos: {
    gap: 8,
  },
  itemDato: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  datoEtiqueta: {
    fontSize: 13,
    color: theme.colors.textMuted,
  },
  datoValor: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  ubicacionInfoContainer: {
    paddingVertical: 4,
  },
  ubicacionValor: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  textoResaltado: {
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  alertaAproximada: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fde68a',
    borderRadius: 8,
    padding: 10,
  },
  textoAlertaAproximada: {
    fontSize: 12,
    color: '#b45309',
    fontWeight: '600',
    flex: 1,
  },
  coordenadasFila: {
    flexDirection: 'row',
    gap: 16,
  },
  coordenadaTexto: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  sinDatoTexto: {
    fontSize: 13,
    color: theme.colors.textLight,
    fontStyle: 'italic',
  },
  contenedorFoto: {
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 4,
  },
  imagenAdjunta: {
    width: '100%',
    height: 220,
    borderRadius: 10,
  },
  estadoDetalleFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  estadoDescripcionTexto: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  tarjetaSimulacionDemo: {
    backgroundColor: '#f0f9ff',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#bae6fd',
    marginTop: 8,
    marginBottom: 16,
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  demoTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0369a1',
  },
  demoBajada: {
    fontSize: 12,
    color: '#0284c7',
    lineHeight: 17,
    marginBottom: 14,
  },
  cajaYaResuelto: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#dcfce7',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 8,
    padding: 12,
  },
  textoYaResuelto: {
    fontSize: 13,
    fontWeight: '700',
    color: '#15803d',
  },
  botonSimularSecundario: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#7dd3fc',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  botonDeshabilitado: {
    opacity: 0.6,
  },
  textoBotonSimular: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0284c7',
  },
  botonVolverSecundario: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 20,
  },
  textoBotonVolverSecundario: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
});
