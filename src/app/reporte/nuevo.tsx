import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { CategoriaReporte } from '@/lib/types';

const CATEGORIAS: { id: CategoriaReporte; etiqueta: string }[] = [
  { id: 'electricidad', etiqueta: 'Electricidad' },
  { id: 'agua', etiqueta: 'Agua' },
  { id: 'mobiliario', etiqueta: 'Mobiliario' },
  { id: 'equipos', etiqueta: 'Equipos' },
];

export default function NuevoReporte() {
  const { borradorReporte, actualizarBorrador, limpiarBorrador, crearReporte } = useApp();
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);

  //validar campos y crear reporte
  const handleCrearReporte = () => {
    setErrorValidacion(null);

    if (!borradorReporte.titulo.trim()) {
      setErrorValidacion('Por favor ingresá un título para el reporte.');
      return;
    }

    if (!borradorReporte.descripcion.trim()) {
      setErrorValidacion('Por favor ingresá una descripción del desperfecto.');
      return;
    }

    if (!borradorReporte.categoria) {
      setErrorValidacion('Por favor seleccioná una categoría (electricidad, agua, mobiliario o equipos).');
      return;
    }

    //guardar reporte nuevo con estado pendiente
    crearReporte({
      titulo: borradorReporte.titulo.trim(),
      descripcion: borradorReporte.descripcion.trim(),
      aula: borradorReporte.aula.trim(),
      categoria: borradorReporte.categoria,
      fotoUri: borradorReporte.fotoUri,
      ubicacion: borradorReporte.ubicacion || (borradorReporte.sectorManual ? { sectorManual: borradorReporte.sectorManual } : undefined),
    });

    //limpiar borrador temporal
    limpiarBorrador();

    //volver al listado de reportes
    router.replace('/(tabs)');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.titulo}>Nuevo reporte</Text>

      <Text style={styles.label}>Título *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: Luz quemada / Tubo parpadeando"
        value={borradorReporte.titulo}
        onChangeText={(text) => actualizarBorrador({ titulo: text })}
      />

      <Text style={styles.label}>Descripción *</Text>
      <TextInput
        style={[styles.input, styles.descripcionInput]}
        placeholder="Detallá el desperfecto y su estado actual"
        multiline
        value={borradorReporte.descripcion}
        onChangeText={(text) => actualizarBorrador({ descripcion: text })}
      />

      <Text style={styles.label}>Aula / Espacio</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: Aula 10, Laboratorio..."
        value={borradorReporte.aula}
        onChangeText={(text) => actualizarBorrador({ aula: text })}
      />

      <Text style={styles.label}>Categoría *</Text>
      <View style={styles.categoriasContenedor}>
        {CATEGORIAS.map((cat) => {
          const seleccionada = borradorReporte.categoria === cat.id;
          return (
            <Pressable
              key={cat.id}
              style={[
                styles.chipCategoria,
                seleccionada && styles.chipCategoriaSeleccionada,
              ]}
              onPress={() => actualizarBorrador({ categoria: cat.id })}
            >
              <Text
                style={[
                  styles.textoChip,
                  seleccionada && styles.textoChipSeleccionado,
                ]}
              >
                {cat.etiqueta}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.seccionSubtitulo}>Adjuntos y Geolocalización</Text>

      {/* acceso a escaner qr */}
      <Pressable
        style={styles.botonSecundario}
        onPress={() => router.push('/reporte/escanear')}
      >
        <Text style={styles.textoBotonSecundario}>
          {borradorReporte.aula ? `Aula escaneada: ${borradorReporte.aula}` : 'Escanear QR de Aula'}
        </Text>
      </Pressable>

      {/* acceso a adjuntar foto */}
      <Pressable
        style={styles.botonSecundario}
        onPress={() => router.push('/reporte/foto')}
      >
        <Text style={styles.textoBotonSecundario}>
          {borradorReporte.fotoUri ? '✓ Foto adjuntada (Ver / Cambiar)' : 'Adjuntar foto'}
        </Text>
      </Pressable>

      {/* acceso a marcar ubicacion */}
      <Pressable
        style={styles.botonSecundario}
        onPress={() => router.push('/reporte/ubicacion')}
      >
        <Text style={styles.textoBotonSecundario}>
          {borradorReporte.sectorManual
            ? `Sector: ${borradorReporte.sectorManual}`
            : borradorReporte.ubicacion
            ? borradorReporte.ubicacion.esAproximada
              ? '✓ Ubicación aproximada registrada'
              : '✓ Coordenadas GPS registradas'
            : 'Marcar ubicación'}
        </Text>
      </Pressable>

      {errorValidacion && (
        <View style={styles.cajaError}>
          <Text style={styles.textoError}>{errorValidacion}</Text>
        </View>
      )}

      {/* boton principal crear */}
      <Pressable style={styles.botonPrincipal} onPress={handleCrearReporte}>
        <Text style={styles.textoBotonPrincipal}>Crear reporte</Text>
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
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 16,
    backgroundColor: '#f8fafc',
  },
  descripcionInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  categoriasContenedor: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  chipCategoria: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#f8fafc',
  },
  chipCategoriaSeleccionada: {
    backgroundColor: '#208AEF',
    borderColor: '#208AEF',
  },
  textoChip: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  textoChipSeleccionado: {
    color: '#fff',
  },
  seccionSubtitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 10,
    marginBottom: 12,
  },
  botonSecundario: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#f8fafc',
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  textoBotonSecundario: {
    color: '#1e293b',
    fontSize: 14,
    fontWeight: '600',
  },
  cajaError: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    marginBottom: 10,
  },
  textoError: {
    color: '#b91c1c',
    fontSize: 13,
    fontWeight: '600',
  },
  botonPrincipal: {
    backgroundColor: '#0f172a',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  textoBotonPrincipal: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
