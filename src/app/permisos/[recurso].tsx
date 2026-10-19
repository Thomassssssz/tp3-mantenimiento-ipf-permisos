import React from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { TipoRecurso } from '@/lib/types';
import { RECURSOS_INFO } from '@/lib/permisos';
import { usePermiso } from '@/hooks/usePermiso';

const RECURSOS_VALIDOS: TipoRecurso[] = ['camera', 'location', 'photos', 'notifications'];

export default function PermisoRecursoModal() {
  const params = useLocalSearchParams<{ recurso: string }>();
  const recursoParam = params.recurso;

  const esValido = typeof recursoParam === 'string' && RECURSOS_VALIDOS.includes(recursoParam as TipoRecurso);
  const recurso = esValido ? (recursoParam as TipoRecurso) : null;

  const { estado, parcial, pedir, abrirAjustes } = usePermiso(recurso);

  if (!esValido || !recurso) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Recurso no válido</Text>
        <Text style={styles.descripcion}>
          El identificador de permiso solicitado no existe o no es soportado.
        </Text>
        <Pressable style={styles.botonPrincipal} onPress={() => router.back()}>
          <Text style={styles.textoBoton}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  const info = RECURSOS_INFO[recurso];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>{info.nombre}</Text>

      <View style={styles.badgePlataforma}>
        <Text style={styles.textoBadgePlataforma}>
          Plataforma: {Platform.OS.toUpperCase()}
        </Text>
      </View>

      {estado === 'cargando' && (
        <View style={styles.cajaEstado}>
          <ActivityIndicator size="large" color="#208AEF" />
          <Text style={styles.textoCargando}>Consultando estado del permiso...</Text>
        </View>
      )}

      {estado === 'concedido' && (
        <View style={styles.cajaEstado}>
          <Text style={styles.subtituloConcedido}>Permiso ya concedido</Text>
          <Text style={styles.descripcion}>
            El acceso a {info.nombre.toLowerCase()} ya se encuentra habilitado para esta aplicación.
          </Text>

          {parcial && (
            <View style={styles.alertaParcial}>
              <Text style={styles.tituloAlertaParcial}>Acceso parcial detectado</Text>
              <Text style={styles.textoAlertaParcial}>
                {recurso === 'location'
                  ? 'Ubicación aproximada: la aplicación recibe únicamente la zona estimada del predio, sin coordenadas de alta precisión.'
                  : recurso === 'photos'
                  ? 'Acceso limitado: solo se permite consultar las fotos que hayas seleccionado manualmente para la app.'
                  : 'El permiso cuenta con restricciones de acceso parcial.'}
              </Text>
            </View>
          )}

          <Pressable style={styles.botonPrincipal} onPress={() => router.back()}>
            <Text style={styles.textoBoton}>Volver</Text>
          </Pressable>
        </View>
      )}

      {estado === 'preguntable' && (
        <View style={styles.cajaEstado}>
          <Text style={styles.seccionTitulo}>¿Por qué lo necesitamos?</Text>
          <Text style={styles.descripcion}>{info.descripcionUso}</Text>

          <Text style={styles.seccionTitulo}>¿Cuándo se solicita?</Text>
          <Text style={styles.descripcion}>{info.momentoPedido}</Text>

          <Text style={styles.seccionTitulo}>Alternativa si no lo autorizás</Text>
          <Text style={styles.descripcion}>{info.alternativa}</Text>

          <Pressable style={styles.botonPrincipal} onPress={() => void pedir()}>
            <Text style={styles.textoBoton}>Continuar</Text>
          </Pressable>
        </View>
      )}

      {estado === 'bloqueado' && (
        <View style={styles.cajaEstado}>
          <Text style={styles.subtituloBloqueado}>Permiso bloqueado o denegado</Text>
          <Text style={styles.descripcion}>
            El acceso a {info.nombre.toLowerCase()} fue denegado anteriormente o se encuentra bloqueado
            por el sistema operativo. Para utilizar esta función tenés que habilitarlo desde los Ajustes del dispositivo.
          </Text>

          {parcial && (
            <View style={styles.alertaParcial}>
              <Text style={styles.tituloAlertaParcial}>Estado parcial</Text>
              <Text style={styles.textoAlertaParcial}>
                El permiso posee restricciones activas en el sistema.
              </Text>
            </View>
          )}

          <Text style={styles.seccionTitulo}>Alternativa disponible sin permiso</Text>
          <Text style={styles.descripcion}>{info.alternativa}</Text>

          <Pressable style={styles.botonPrincipal} onPress={() => void abrirAjustes()}>
            <Text style={styles.textoBoton}>Abrir Ajustes</Text>
          </Pressable>

          <Pressable style={styles.botonSecundario} onPress={() => router.back()}>
            <Text style={styles.textoBotonSecundario}>Volver</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 8,
  },
  badgePlataforma: {
    alignSelf: 'flex-start',
    backgroundColor: '#eef2f6',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 20,
  },
  textoBadgePlataforma: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  cajaEstado: {
    width: '100%',
  },
  textoCargando: {
    marginTop: 14,
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
  },
  subtituloConcedido: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16a34a',
    marginBottom: 8,
  },
  subtituloBloqueado: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 8,
  },
  seccionTitulo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 12,
    marginBottom: 4,
  },
  descripcion: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
    marginBottom: 10,
  },
  alertaParcial: {
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fcd34d',
    borderRadius: 8,
    padding: 12,
    marginVertical: 12,
  },
  tituloAlertaParcial: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#b45309',
    marginBottom: 4,
  },
  textoAlertaParcial: {
    fontSize: 13,
    lineHeight: 18,
    color: '#92400e',
  },
  botonPrincipal: {
    backgroundColor: '#208AEF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  textoBoton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botonSecundario: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotonSecundario: {
    color: '#444',
    fontSize: 15,
    fontWeight: '600',
  },
});
