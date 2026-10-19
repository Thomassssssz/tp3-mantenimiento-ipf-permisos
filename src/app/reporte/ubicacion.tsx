import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import { usePermiso } from '@/hooks/usePermiso';
import { useApp } from '@/context/AppContext';

const SECTORES_MANUALES = ['Patio', 'Estacionamiento', 'Pasillo', 'Aula', 'Otro'];

export default function UbicacionReporteScreen() {
  const { estado, parcial, abrirAjustes } = usePermiso('location');
  const { borradorReporte, actualizarBorrador } = useApp();

  const [obteniendo, setObteniendo] = useState(false);
  const [errorUbicacion, setErrorUbicacion] = useState<string | null>(null);

  //obtener coordenadas en primer plano
  const capturarUbicacion = async () => {
    setObteniendo(true);
    setErrorUbicacion(null);

    try {
      const pos = await Location.getCurrentPositionAsync({
        accuracy: parcial ? Location.LocationAccuracy.Balanced : Location.LocationAccuracy.High,
      });

      //guardar ubicacion en el borrador
      actualizarBorrador({
        ubicacion: {
          latitud: pos.coords.latitude,
          longitud: pos.coords.longitude,
          esAproximada: parcial,
        },
        sectorManual: undefined,
      });
    } catch (error) {
      console.warn('Error al obtener ubicacion:', error);
      setErrorUbicacion('No se pudo determinar la ubicación. Podés elegir un sector manual.');
    } finally {
      setObteniendo(false);
    }
  };

  //seleccionar sector manual sin gps
  const seleccionarSector = (sector: string) => {
    actualizarBorrador({
      sectorManual: sector,
      ubicacion: undefined,
    });
  };

  const ubicacionActual = borradorReporte.ubicacion;
  const sectorActual = borradorReporte.sectorManual;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.titulo}>Ubicación del Desperfecto</Text>
      <Text style={styles.subtitulo}>
        Georreferenciá el lugar mediante GPS o seleccioná el sector institucional manualmente.
      </Text>

      {/* estado del permiso de ubicacion */}
      {estado === 'cargando' && (
        <View style={styles.cajaEstado}>
          <ActivityIndicator size="large" color="#208AEF" />
          <Text style={styles.textoCargando}>Comprobando servicio de ubicación...</Text>
        </View>
      )}

      {estado === 'concedido' && (
        <View style={styles.cajaConcedido}>
          <Text style={styles.seccionTitulo}>Ubicación por GPS (Primer plano)</Text>

          <Pressable
            style={[styles.botonPrincipal, obteniendo && styles.botonDeshabilitado]}
            onPress={capturarUbicacion}
            disabled={obteniendo}
          >
            {obteniendo ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.textoBoton}>Obtener ubicación actual</Text>
            )}
          </Pressable>

          {errorUbicacion && (
            <Text style={styles.textoError}>{errorUbicacion}</Text>
          )}

          {ubicacionActual && (
            <View style={styles.datosUbicacionCaja}>
              <Text style={styles.datosUbicacionTitulo}>Ubicación registrada:</Text>
              {ubicacionActual.esAproximada ? (
                <View style={styles.alertaAproximada}>
                  <Text style={styles.textoAlertaAproximada}>Ubicación aproximada</Text>
                  <Text style={styles.detalleAproximada}>
                    Por configuración del sistema solo se accede al área general estimada.
                  </Text>
                </View>
              ) : (
                <View style={styles.coordenadasFila}>
                  <Text style={styles.coordenadaTexto}>
                    Lat: {ubicacionActual.latitud?.toFixed(5)}
                  </Text>
                  <Text style={styles.coordenadaTexto}>
                    Long: {ubicacionActual.longitud?.toFixed(5)}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      )}

      {estado === 'preguntable' && (
        <View style={styles.cajaEstado}>
          <Text style={styles.estadoTitulo}>Permiso de ubicación necesario</Text>
          <Text style={styles.descripcion}>
            Para georreferenciar automáticamente el desperfecto necesitamos acceso a tu ubicación.
          </Text>
          <Pressable
            style={styles.botonPrincipal}
            onPress={() =>
              router.push({
                pathname: '/permisos/[recurso]',
                params: { recurso: 'location' },
              })
            }
          >
            <Text style={styles.textoBoton}>Ver explicación y solicitar</Text>
          </Pressable>
        </View>
      )}

      {estado === 'bloqueado' && (
        <View style={styles.cajaEstado}>
          <Text style={styles.estadoTituloBloqueado}>Ubicación bloqueada</Text>
          <Text style={styles.descripcion}>
            El acceso a la ubicación fue denegado. Podés habilitarlo desde Ajustes o seleccionar el sector manualmente.
          </Text>
          <Pressable style={styles.botonPrincipal} onPress={() => void abrirAjustes()}>
            <Text style={styles.textoBoton}>Abrir Ajustes</Text>
          </Pressable>
        </View>
      )}

      {/* alternativa manual obligatoria */}
      <View style={styles.seccionManual}>
        <Text style={styles.seccionTitulo}>Alternativa manual: Sector institucional</Text>
        <Text style={styles.descripcion}>
          Elegí el sector donde se ubica el problema sin necesidad de GPS:
        </Text>

        <View style={styles.sectoresGrid}>
          {SECTORES_MANUALES.map((sector) => {
            const estaSeleccionado = sectorActual === sector;
            return (
              <Pressable
                key={sector}
                style={[
                  styles.sectorItem,
                  estaSeleccionado && styles.sectorItemSeleccionado,
                ]}
                onPress={() => seleccionarSector(sector)}
              >
                <Text
                  style={[
                    styles.sectorTexto,
                    estaSeleccionado && styles.sectorTextoSeleccionado,
                  ]}
                >
                  {sector}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {sectorActual && (
          <Text style={styles.sectorConfirmadoTexto}>
            Sector seleccionado: <Text style={styles.sectorNegrita}>{sectorActual}</Text>
          </Text>
        )}
      </View>

      <Pressable style={styles.botonListo} onPress={() => router.back()}>
        <Text style={styles.textoBotonListo}>Listo y volver al formulario</Text>
      </Pressable>
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
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 6,
  },
  subtitulo: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 20,
  },
  cajaEstado: {
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
    alignItems: 'center',
  },
  textoCargando: {
    marginTop: 10,
    color: '#64748b',
    fontSize: 14,
  },
  estadoTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 6,
  },
  estadoTituloBloqueado: {
    fontSize: 16,
    fontWeight: '700',
    color: '#dc2626',
    marginBottom: 6,
  },
  descripcion: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 12,
  },
  cajaConcedido: {
    marginBottom: 20,
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  seccionTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  botonPrincipal: {
    backgroundColor: '#208AEF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  botonDeshabilitado: {
    opacity: 0.6,
  },
  textoBoton: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  textoError: {
    color: '#dc2626',
    fontSize: 13,
    marginTop: 6,
  },
  datosUbicacionCaja: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  datosUbicacionTitulo: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  alertaAproximada: {
    backgroundColor: '#fef3c7',
    padding: 10,
    borderRadius: 6,
  },
  textoAlertaAproximada: {
    fontSize: 14,
    fontWeight: '700',
    color: '#b45309',
  },
  detalleAproximada: {
    fontSize: 12,
    color: '#92400e',
    marginTop: 2,
  },
  coordenadasFila: {
    flexDirection: 'row',
    gap: 16,
  },
  coordenadaTexto: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  seccionManual: {
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginBottom: 24,
  },
  sectoresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  sectorItem: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  sectorItemSeleccionado: {
    backgroundColor: '#208AEF',
    borderColor: '#208AEF',
  },
  sectorTexto: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  sectorTextoSeleccionado: {
    color: '#fff',
  },
  sectorConfirmadoTexto: {
    fontSize: 13,
    color: '#16a34a',
    marginTop: 4,
  },
  sectorNegrita: {
    fontWeight: '700',
  },
  botonListo: {
    backgroundColor: '#334155',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoBotonListo: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
