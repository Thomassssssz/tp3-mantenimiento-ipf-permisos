import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { CameraView, BarcodeScanningResult } from 'expo-camera';
import { usePermiso } from '@/hooks/usePermiso';
import { useApp } from '@/context/AppContext';

export default function EscanearQrScreen() {
  const { estado, abrirAjustes } = usePermiso('camera');
  const { borradorReporte, actualizarBorrador } = useApp();

  const [escaneado, setEscaneado] = useState(false);
  const [aulaManual, setAulaManual] = useState(borradorReporte.aula || '');

  //procesar lectura de codigo qr
  const handleBarcodeScanned = (result: BarcodeScanningResult) => {
    if (escaneado) return;
    setEscaneado(true);
    //guardar aula leida en borrador
    actualizarBorrador({ aula: result.data });
  };

  //guardar aula ingresada de forma manual
  const guardarManual = () => {
    if (aulaManual.trim()) {
      actualizarBorrador({ aula: aulaManual.trim() });
    }
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.titulo}>Escanear QR de Aula</Text>

      {estado === 'cargando' && (
        <View style={styles.cajaEstado}>
          <ActivityIndicator size="large" color="#208AEF" />
          <Text style={styles.textoSecundario}>Comprobando cámara...</Text>
        </View>
      )}

      {estado === 'concedido' && (
        <View style={styles.cajaCamara}>
          {!escaneado ? (
            <View style={styles.camaraWrapper}>
              <CameraView
                style={styles.camara}
                facing="back"
                barcodeScannerSettings={{
                  barcodeTypes: ['qr'],
                }}
                onBarcodeScanned={handleBarcodeScanned}
              />
              <View style={styles.cuadroGuia}>
                <Text style={styles.textoGuia}>Apuntá al código QR del aula</Text>
              </View>
            </View>
          ) : (
            <View style={styles.resultadoCaja}>
              <Text style={styles.resultadoTitulo}>Código QR detectado</Text>
              <Text style={styles.resultadoDato}>{borradorReporte.aula}</Text>

              <Pressable
                style={styles.botonPrincipal}
                onPress={() => router.back()}
              >
                <Text style={styles.textoBoton}>Usar aula y volver</Text>
              </Pressable>

              <Pressable
                style={styles.botonSecundario}
                onPress={() => setEscaneado(false)}
              >
                <Text style={styles.textoBotonSecundario}>Escanear de nuevo</Text>
              </Pressable>
            </View>
          )}
        </View>
      )}

      {estado === 'preguntable' && (
        <View style={styles.cajaEstado}>
          <Text style={styles.subtitulo}>Permiso de cámara necesario</Text>
          <Text style={styles.descripcion}>
            Para leer el código QR del aula requerimos acceso a la cámara.
          </Text>
          <Pressable
            style={styles.botonPrincipal}
            onPress={() =>
              router.push({
                pathname: '/permisos/[recurso]',
                params: { recurso: 'camera' },
              })
            }
          >
            <Text style={styles.textoBoton}>Ver explicación y solicitar</Text>
          </Pressable>
        </View>
      )}

      {estado === 'bloqueado' && (
        <View style={styles.cajaEstado}>
          <Text style={styles.subtituloBloqueado}>Cámara bloqueada</Text>
          <Text style={styles.descripcion}>
            El permiso de cámara fue bloqueado. Podés habilitarlo desde Ajustes o ingresar el aula manualmente abajo.
          </Text>
          <Pressable style={styles.botonPrincipal} onPress={() => void abrirAjustes()}>
            <Text style={styles.textoBoton}>Abrir Ajustes</Text>
          </Pressable>
        </View>
      )}

      {/* alternativa manual obligatoria */}
      <View style={styles.seccionManual}>
        <Text style={styles.seccionManualTitulo}>Alternativa manual</Text>
        <Text style={styles.descripcion}>
          Si no contás con cámara o el código no es legible, escribí el aula directamente:
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Ej: Aula 5, Laboratorio B..."
          value={aulaManual}
          onChangeText={setAulaManual}
        />

        <Pressable style={styles.botonManual} onPress={guardarManual}>
          <Text style={styles.textoBotonManual}>Guardar aula manualmente</Text>
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
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 16,
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
  subtitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtituloBloqueado: {
    fontSize: 16,
    fontWeight: '700',
    color: '#dc2626',
    marginBottom: 8,
  },
  descripcion: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 14,
    textAlign: 'center',
  },
  textoSecundario: {
    marginTop: 10,
    color: '#64748b',
    fontSize: 14,
  },
  cajaCamara: {
    marginBottom: 20,
  },
  camaraWrapper: {
    height: 320,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  camara: {
    flex: 1,
  },
  cuadroGuia: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoGuia: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  resultadoCaja: {
    padding: 16,
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 12,
    alignItems: 'center',
  },
  resultadoTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#16a34a',
    marginBottom: 6,
  },
  resultadoDato: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 16,
  },
  seccionManual: {
    marginTop: 10,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  seccionManualTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 12,
  },
  botonPrincipal: {
    backgroundColor: '#208AEF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  textoBoton: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  botonSecundario: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  textoBotonSecundario: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '600',
  },
  botonManual: {
    backgroundColor: '#334155',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBotonManual: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
