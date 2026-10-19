import React from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TipoRecurso } from '@/lib/types';
import { RECURSOS_INFO, obtenerEtiquetaEstado } from '@/lib/permisos';
import { usePermiso } from '@/hooks/usePermiso';
import { theme } from '@/lib/theme';

const LISTA_RECURSOS: TipoRecurso[] = ['camera', 'location', 'photos', 'notifications'];

interface RecursoVisualConfig {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bgIcono: string;
  descripcionBreve: string;
}

const CONFIG_VISUAL_RECURSOS: Record<TipoRecurso, RecursoVisualConfig> = {
  camera: {
    icon: 'camera-outline',
    color: '#208AEF',
    bgIcono: '#e0f2fe',
    descripcionBreve: 'Necesaria para escanear QR y tomar fotografías.',
  },
  location: {
    icon: 'location-outline',
    color: '#0284c7',
    bgIcono: '#e0f2fe',
    descripcionBreve: 'Necesaria para georreferenciar el desperfecto en el instituto.',
  },
  photos: {
    icon: 'images-outline',
    color: '#7c3aed',
    bgIcono: '#f3e8ff',
    descripcionBreve: 'Permite seleccionar imágenes existentes con el selector del sistema.',
  },
  notifications: {
    icon: 'notifications-outline',
    color: '#d97706',
    bgIcono: '#fef3c7',
    descripcionBreve: 'Necesarias para recibir avisos cuando se resuelvan tus reportes.',
  },
};

//tarjeta individual para el estado de cada permiso
function TarjetaPermiso({ recurso }: { recurso: TipoRecurso }) {
  const { estado, parcial } = usePermiso(recurso);
  const info = RECURSOS_INFO[recurso];
  const visual = CONFIG_VISUAL_RECURSOS[recurso];
  const estadoEstilo = theme.colors.permisos[estado] || theme.colors.permisos.cargando;

  const navegarAExplicacion = () => {
    router.push({
      pathname: '/permisos/[recurso]',
      params: { recurso },
    });
  };

  return (
    <View style={styles.tarjeta}>
      {/*encabezado de la tarjeta con icono, nombre y chip de estado*/}
      <View style={styles.headerTarjeta}>
        <View style={styles.iconoYNombre}>
          <View style={[styles.iconoWrapper, { backgroundColor: visual.bgIcono }]}>
            <Ionicons name={visual.icon} size={22} color={visual.color} />
          </View>
          <View>
            <Text style={styles.nombreRecurso}>{info.nombre}</Text>
            <Text style={styles.plataformaTexto}>
              Plataforma: <Text style={styles.plataformaValor}>{Platform.OS.toUpperCase()}</Text>
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.chipEstado,
            { backgroundColor: estadoEstilo.bg, borderColor: estadoEstilo.border },
          ]}
        >
          <Text style={[styles.textoChipEstado, { color: estadoEstilo.text }]}>
            {obtenerEtiquetaEstado(estado, parcial)}
          </Text>
        </View>
      </View>

      {/*badge si cuenta con acceso parcial*/}
      {parcial && (
        <View style={styles.badgeParcial}>
          <Ionicons name="information-circle-outline" size={14} color="#d97706" />
          <Text style={styles.textoBadgeParcial}>
            {recurso === 'location'
              ? 'Acceso a ubicación aproximada activa'
              : recurso === 'photos'
              ? 'Acceso a fotos limitado activo'
              : 'Acceso parcial'}
          </Text>
        </View>
      )}

      {/*descripcion breve solicitada*/}
      <Text style={styles.descripcionCorta}>
        {visual.descripcionBreve}
      </Text>

      {/*acciones segun estado*/}
      <View style={styles.accionContainer}>
        {estado === 'concedido' ? (
          <View style={styles.contenedorConcedido}>
            <Ionicons name="checkmark-circle" size={18} color="#16a34a" />
            <Text style={styles.textoConcedido}>Habilitado correctamente</Text>
          </View>
        ) : estado === 'preguntable' ? (
          <Pressable style={styles.botonAccion} onPress={navegarAExplicacion}>
            <Text style={styles.textoBotonAccion}>Solicitar permiso</Text>
            <Ionicons name="chevron-forward" size={16} color="#ffffff" />
          </Pressable>
        ) : estado === 'bloqueado' ? (
          <Pressable style={[styles.botonAccion, styles.botonBloqueado]} onPress={navegarAExplicacion}>
            <Text style={styles.textoBotonAccion}>Ver cómo habilitar en Ajustes</Text>
            <Ionicons name="open-outline" size={15} color="#ffffff" />
          </Pressable>
        ) : (
          <View style={styles.contenedorCargando}>
            <Text style={styles.textoConsultando}>Consultando estado...</Text>
          </View>
        )}
      </View>
    </View>
  );
}

//pantalla de control general de permisos
export default function Permisos() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.titulo}>Permisos</Text>
      <Text style={styles.subtitulo}>
        Controlá qué funciones puede utilizar la aplicación.
      </Text>

      {LISTA_RECURSOS.map((recurso) => (
        <TarjetaPermiso key={recurso} recurso={recurso} />
      ))}

      {/*acceso directo a ajustes de la app*/}
      <Pressable
        style={styles.botonAjustesSeccion}
        onPress={() => router.push('/ajustes-app')}
      >
        <Ionicons name="notifications-outline" size={18} color={theme.colors.primary} />
        <Text style={styles.textoBotonAjustesSeccion}>
          Configurar preferencias de notificaciones
        </Text>
        <Ionicons name="chevron-forward" size={16} color={theme.colors.primary} />
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
    fontSize: 26,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 14,
    color: theme.colors.textMuted,
    marginBottom: 20,
    lineHeight: 20,
  },
  tarjeta: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  headerTarjeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  iconoYNombre: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconoWrapper: {
    width: 42,
    height: 42,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nombreRecurso: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  plataformaTexto: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  plataformaValor: {
    fontWeight: '600',
    color: '#334155',
  },
  chipEstado: {
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: 20,
    borderWidth: 1,
  },
  textoChipEstado: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  badgeParcial: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fde68a',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.borderRadius.sm,
    marginBottom: 10,
  },
  textoBadgeParcial: {
    fontSize: 12,
    fontWeight: '600',
    color: '#b45309',
  },
  descripcionCorta: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 19,
    marginBottom: 14,
  },
  accionContainer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
    paddingTop: 12,
  },
  contenedorConcedido: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  textoConcedido: {
    fontSize: 13,
    fontWeight: '600',
    color: '#16a34a',
  },
  botonAccion: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.button,
  },
  botonBloqueado: {
    backgroundColor: '#475569',
    shadowColor: '#475569',
  },
  textoBotonAccion: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  contenedorCargando: {
    paddingVertical: 6,
  },
  textoConsultando: {
    fontSize: 13,
    color: theme.colors.textLight,
    fontStyle: 'italic',
  },
  botonAjustesSeccion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 20,
    ...theme.shadows.card,
  },
  textoBotonAjustesSeccion: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.primary,
    flex: 1,
    marginHorizontal: 10,
  },
});
