import React, { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '@/context/AppContext';
import { CategoriaReporte } from '@/lib/types';
import { theme } from '@/lib/theme';

interface CategoriaItem {
  id: CategoriaReporte;
  etiqueta: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const CATEGORIAS: CategoriaItem[] = [
  { id: 'electricidad', etiqueta: 'Electricidad', icon: 'flash-outline', color: '#d97706' },
  { id: 'agua', etiqueta: 'Agua', icon: 'water-outline', color: '#0284c7' },
  { id: 'mobiliario', etiqueta: 'Mobiliario', icon: 'construct-outline', color: '#7c3aed' },
  { id: 'equipos', etiqueta: 'Equipos', icon: 'desktop-outline', color: '#475569' },
];

//pantalla de creacion de nuevo reporte
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
      <Text style={styles.subtituloFormulario}>
        Completá los datos y adjuntá la evidencia del desperfecto.
      </Text>

      {/*seccion 1: datos del problema*/}
      <View style={styles.seccionCard}>
        <View style={styles.seccionHeader}>
          <Ionicons name="document-text-outline" size={18} color={theme.colors.primary} />
          <Text style={styles.seccionTitulo}>Datos del problema</Text>
        </View>

        <Text style={styles.label}>Título del desperfecto *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Luz quemada / Canilla goteando"
          placeholderTextColor={theme.colors.textLight}
          value={borradorReporte.titulo}
          onChangeText={(text) => actualizarBorrador({ titulo: text })}
        />

        <Text style={styles.label}>Descripción detallada *</Text>
        <TextInput
          style={[styles.input, styles.descripcionInput]}
          placeholder="Explicá el problema, ubicación exacta y qué ocurre..."
          placeholderTextColor={theme.colors.textLight}
          multiline
          value={borradorReporte.descripcion}
          onChangeText={(text) => actualizarBorrador({ descripcion: text })}
        />

        <Text style={styles.label}>Aula o espacio asignado</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Aula 12, Laboratorio de Redes..."
          placeholderTextColor={theme.colors.textLight}
          value={borradorReporte.aula}
          onChangeText={(text) => actualizarBorrador({ aula: text })}
        />

        <Text style={styles.label}>Categoría *</Text>
        <View style={styles.gridCategorias}>
          {CATEGORIAS.map((cat) => {
            const seleccionada = borradorReporte.categoria === cat.id;
            return (
              <Pressable
                key={cat.id}
                style={[
                  styles.tarjetaCategoria,
                  seleccionada && styles.tarjetaCategoriaSeleccionada,
                ]}
                onPress={() => actualizarBorrador({ categoria: cat.id })}
              >
                <Ionicons
                  name={cat.icon}
                  size={20}
                  color={seleccionada ? theme.colors.primary : cat.color}
                />
                <Text
                  style={[
                    styles.textoCategoria,
                    seleccionada && styles.textoCategoriaSeleccionada,
                  ]}
                >
                  {cat.etiqueta}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/*seccion 2: ubicacion y evidencia*/}
      <View style={styles.seccionCard}>
        <View style={styles.seccionHeader}>
          <Ionicons name="attach-outline" size={18} color={theme.colors.primary} />
          <Text style={styles.seccionTitulo}>Ubicación y evidencia</Text>
        </View>

        {/*tarjeta de accion: escanear qr*/}
        <Pressable
          style={styles.tarjetaAccion}
          onPress={() => router.push('/reporte/escanear')}
        >
          <View style={styles.iconoAccionWrapper}>
            <Ionicons name="qr-code-outline" size={22} color={theme.colors.primary} />
          </View>
          <View style={styles.textosAccion}>
            <Text style={styles.tituloAccion}>Escanear QR de Aula</Text>
            <Text style={styles.descripcionAccion} numberOfLines={1}>
              {borradorReporte.aula
                ? `Aula vinculada: ${borradorReporte.aula}`
                : 'Leé el código QR de la puerta'}
            </Text>
          </View>
          {borradorReporte.aula ? (
            <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
          ) : (
            <Ionicons name="chevron-forward" size={18} color={theme.colors.textLight} />
          )}
        </Pressable>

        {/*tarjeta de accion: adjuntar foto*/}
        <Pressable
          style={styles.tarjetaAccion}
          onPress={() => router.push('/reporte/foto')}
        >
          <View style={styles.iconoAccionWrapper}>
            <Ionicons name="camera-outline" size={22} color={theme.colors.primary} />
          </View>
          <View style={styles.textosAccion}>
            <Text style={styles.tituloAccion}>Adjuntar Fotografía</Text>
            <Text style={styles.descripcionAccion} numberOfLines={1}>
              {borradorReporte.fotoUri
                ? 'Foto adjuntada (tocar para ver o cambiar)'
                : 'Tomá una foto o elegí de la galería'}
            </Text>
          </View>
          {borradorReporte.fotoUri ? (
            <Image
              source={{ uri: borradorReporte.fotoUri }}
              style={styles.miniaturaFoto}
            />
          ) : (
            <Ionicons name="chevron-forward" size={18} color={theme.colors.textLight} />
          )}
        </Pressable>

        {/*tarjeta de accion: agregar ubicacion*/}
        <Pressable
          style={styles.tarjetaAccion}
          onPress={() => router.push('/reporte/ubicacion')}
        >
          <View style={styles.iconoAccionWrapper}>
            <Ionicons name="location-outline" size={22} color={theme.colors.primary} />
          </View>
          <View style={styles.textosAccion}>
            <Text style={styles.tituloAccion}>Marcar Ubicación</Text>
            <Text style={styles.descripcionAccion} numberOfLines={1}>
              {borradorReporte.sectorManual
                ? `Sector manual: ${borradorReporte.sectorManual}`
                : borradorReporte.ubicacion
                ? borradorReporte.ubicacion.esAproximada
                  ? 'Ubicación aproximada registrada'
                  : 'Coordenadas GPS registradas'
                : 'Georreferenciá o elegí sector manual'}
            </Text>
          </View>
          {borradorReporte.sectorManual || borradorReporte.ubicacion ? (
            <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
          ) : (
            <Ionicons name="chevron-forward" size={18} color={theme.colors.textLight} />
          )}
        </Pressable>
      </View>

      {/*mensaje de error de validacion*/}
      {errorValidacion && (
        <View style={styles.cajaError}>
          <Ionicons name="alert-circle-outline" size={18} color="#b91c1c" />
          <Text style={styles.textoError}>{errorValidacion}</Text>
        </View>
      )}

      {/*boton principal crear*/}
      <Pressable style={styles.botonPrincipal} onPress={handleCrearReporte}>
        <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
        <Text style={styles.textoBotonPrincipal}>Crear reporte</Text>
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
  titulo: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    letterSpacing: -0.3,
  },
  subtituloFormulario: {
    fontSize: 13,
    color: theme.colors.textMuted,
    marginTop: 4,
    marginBottom: 18,
  },
  seccionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  seccionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  seccionTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: theme.borderRadius.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: theme.colors.textPrimary,
    marginBottom: 14,
    backgroundColor: theme.colors.background,
  },
  descripcionInput: {
    minHeight: 80,
    textAlignVertical: 'top',
    lineHeight: 20,
  },
  gridCategorias: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 6,
    marginTop: 2,
  },
  tarjetaCategoria: {
    flexBasis: '48%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  tarjetaCategoriaSeleccionada: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  textoCategoria: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  textoCategoriaSeleccionada: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  tarjetaAccion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    marginBottom: 10,
  },
  iconoAccionWrapper: {
    width: 38,
    height: 38,
    borderRadius: 9,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textosAccion: {
    flex: 1,
  },
  tituloAccion: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  descripcionAccion: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  miniaturaFoto: {
    width: 34,
    height: 34,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  cajaError: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    borderRadius: theme.borderRadius.md,
    padding: 12,
    marginBottom: 14,
  },
  textoError: {
    flex: 1,
    color: '#b91c1c',
    fontSize: 13,
    fontWeight: '600',
  },
  botonPrincipal: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 15,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.button,
  },
  textoBotonPrincipal: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
