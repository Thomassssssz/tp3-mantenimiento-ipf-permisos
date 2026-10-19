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
import { TipoRecurso, EstadoPermiso } from '@/lib/types';
import { RECURSOS_INFO, obtenerEtiquetaEstado } from '@/lib/permisos';
import { usePermiso } from '@/hooks/usePermiso';

const LISTA_RECURSOS: TipoRecurso[] = ['camera', 'location', 'photos', 'notifications'];

function TarjetaPermiso({ recurso }: { recurso: TipoRecurso }) {
  const { estado, parcial } = usePermiso(recurso);
  const info = RECURSOS_INFO[recurso];

  const navegarAExplicacion = () => {
    router.push({
      pathname: '/permisos/[recurso]',
      params: { recurso },
    });
  };

  const badgeColor = {
    cargando: '#94a3b8',
    concedido: '#16a34a',
    preguntable: '#0284c7',
    bloqueado: '#dc2626',
  }[estado];

  return (
    <View style={styles.tarjeta}>
      <View style={styles.headerTarjeta}>
        <Text style={styles.nombreRecurso}>{info.nombre}</Text>
        <View style={[styles.badgeEstado, { backgroundColor: badgeColor }]}>
          <Text style={styles.textoBadgeEstado}>
            {obtenerEtiquetaEstado(estado, parcial)}
          </Text>
        </View>
      </View>

      <View style={styles.detallesFila}>
        <Text style={styles.plataformaTexto}>
          Sistema: <Text style={styles.plataformaValor}>{Platform.OS.toUpperCase()}</Text>
        </Text>

        {parcial && (
          <View style={styles.badgeParcial}>
            <Text style={styles.textoBadgeParcial}>
              {recurso === 'location'
                ? 'Aproximada'
                : recurso === 'photos'
                ? 'Limitada'
                : 'Parcial'}
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.descripcionCorta} numberOfLines={2}>
        {info.descripcionUso}
      </Text>

      <View style={styles.accionContainer}>
        {estado === 'concedido' ? (
          <View style={styles.contenedorConcedido}>
            <Text style={styles.textoConcedido}>Habilitado correctamente</Text>
          </View>
        ) : estado === 'preguntable' ? (
          <Pressable style={styles.botonAccion} onPress={navegarAExplicacion}>
            <Text style={styles.textoBotonAccion}>Solicitar permiso</Text>
          </Pressable>
        ) : estado === 'bloqueado' ? (
          <Pressable style={[styles.botonAccion, styles.botonBloqueado]} onPress={navegarAExplicacion}>
            <Text style={styles.textoBotonAccion}>Ver cómo habilitar</Text>
          </Pressable>
        ) : (
          <Text style={styles.textoConsultando}>Consultando estado...</Text>
        )}
      </View>
    </View>
  );
}

export default function Permisos() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.titulo}>Permisos del Sistema</Text>
      <Text style={styles.subtitulo}>
        Monitoreo del estado de cada permiso nativo y sus alternativas de acceso.
      </Text>

      {LISTA_RECURSOS.map((recurso) => (
        <TarjetaPermiso key={recurso} recurso={recurso} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 6,
  },
  subtitulo: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
    lineHeight: 20,
  },
  tarjeta: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  headerTarjeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nombreRecurso: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  badgeEstado: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  textoBadgeEstado: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  detallesFila: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  plataformaTexto: {
    fontSize: 13,
    color: '#64748b',
  },
  plataformaValor: {
    fontWeight: '600',
    color: '#334155',
  },
  badgeParcial: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  textoBadgeParcial: {
    fontSize: 11,
    fontWeight: '700',
    color: '#d97706',
  },
  descripcionCorta: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 14,
  },
  accionContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  contenedorConcedido: {
    paddingVertical: 6,
  },
  textoConcedido: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16a34a',
  },
  botonAccion: {
    backgroundColor: '#208AEF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  botonBloqueado: {
    backgroundColor: '#475569',
  },
  textoBotonAccion: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  textoConsultando: {
    fontSize: 13,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
});
