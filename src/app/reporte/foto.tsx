import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { usePermiso } from '@/hooks/usePermiso';
import { useApp } from '@/context/AppContext';

export default function AdjuntarFotoScreen() {
  const { estado: estadoCamara } = usePermiso('camera');
  const { borradorReporte, actualizarBorrador } = useApp();

  //tomar foto con camara
  const tomarFoto = async () => {
    if (estadoCamara !== 'concedido') {
      router.push({
        pathname: '/permisos/[recurso]',
        params: { recurso: 'camera' },
      });
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        //guardar uri en borrador
        actualizarBorrador({ fotoUri: result.assets[0].uri });
      }
    } catch (error) {
      console.warn('Error al abrir camara:', error);
    }
  };

  //seleccionar con selector del sistema sin pedir permiso de galeria
  const seleccionarDeGaleria = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        //guardar uri en borrador
        actualizarBorrador({ fotoUri: result.assets[0].uri });
      }
    } catch (error) {
      console.warn('Error al abrir selector de imagenes:', error);
    }
  };

  //quitar foto seleccionada
  const quitarFoto = () => {
    actualizarBorrador({ fotoUri: undefined });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.titulo}>Adjuntar Fotografía</Text>
      <Text style={styles.subtitulo}>
        Podés capturar una foto del desperfecto con la cámara o elegir una imagen existente mediante el selector del sistema.
      </Text>

      {/* visualizacion previa si existe foto */}
      {borradorReporte.fotoUri ? (
        <View style={styles.previewContainer}>
          <Text style={styles.previewLabel}>Foto seleccionada:</Text>
          <Image
            source={{ uri: borradorReporte.fotoUri }}
            style={styles.imagenPreview}
            resizeMode="cover"
          />
          <Pressable style={styles.botonQuitar} onPress={quitarFoto}>
            <Text style={styles.textoBotonQuitar}>Quitar foto</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.sinFotoCaja}>
          <Text style={styles.sinFotoTexto}>No hay ninguna fotografía adjunta todavía.</Text>
        </View>
      )}

      {/* opciones de captura */}
      <View style={styles.seccionOpciones}>
        <Pressable style={styles.botonOpcion} onPress={tomarFoto}>
          <Text style={styles.opcionTitulo}>A. Sacar foto con la cámara</Text>
          <Text style={styles.opcionDescripcion}>
            {estadoCamara === 'concedido'
              ? 'Abrir la cámara del dispositivo'
              : 'Requiere permiso de cámara (se solicitará previamente)'}
          </Text>
        </Pressable>

        <Pressable style={styles.botonOpcion} onPress={seleccionarDeGaleria}>
          <Text style={styles.opcionTitulo}>B. Elegir de la galería</Text>
          <Text style={styles.opcionDescripcion}>
            Selector nativo del sistema (sin necesidad de otorgar permisos de lectura de medios)
          </Text>
        </Pressable>
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
  previewContainer: {
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  previewLabel: {
    alignSelf: 'flex-start',
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 10,
  },
  imagenPreview: {
    width: '100%',
    height: 220,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#e2e8f0',
  },
  botonQuitar: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  textoBotonQuitar: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '600',
  },
  sinFotoCaja: {
    padding: 24,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
    alignItems: 'center',
  },
  sinFotoTexto: {
    color: '#94a3b8',
    fontSize: 14,
  },
  seccionOpciones: {
    gap: 12,
    marginBottom: 24,
  },
  botonOpcion: {
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  opcionTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  opcionDescripcion: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  botonListo: {
    backgroundColor: '#208AEF',
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
