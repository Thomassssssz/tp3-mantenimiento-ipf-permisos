//tema centralizado de colores y estilos
export const theme = {
  colors: {
    primary: '#208AEF',
    primaryDark: '#0f172a',
    primaryLight: '#e0f2fe',
    background: '#f8fafc',
    surface: '#ffffff',
    border: '#e2e8f0',
    borderLight: '#f1f5f9',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#64748b',
    textLight: '#94a3b8',
    status: {
      pendiente: {
        bg: '#fef3c7',
        border: '#fde68a',
        text: '#b45309',
        label: 'Pendiente',
      },
      en_curso: {
        bg: '#e0f2fe',
        border: '#bae6fd',
        text: '#0284c7',
        label: 'En curso',
      },
      resuelto: {
        bg: '#dcfce7',
        border: '#bbf7d0',
        text: '#15803d',
        label: 'Resuelto',
      },
      bloqueado: {
        bg: '#fee2e2',
        border: '#fca5a5',
        text: '#dc2626',
        label: 'Bloqueado',
      },
    },
    permisos: {
      concedido: {
        bg: '#dcfce7',
        border: '#bbf7d0',
        text: '#15803d',
      },
      preguntable: {
        bg: '#e0f2fe',
        border: '#bae6fd',
        text: '#0284c7',
      },
      bloqueado: {
        bg: '#fee2e2',
        border: '#fca5a5',
        text: '#dc2626',
      },
      cargando: {
        bg: '#f1f5f9',
        border: '#cbd5e1',
        text: '#64748b',
      },
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  borderRadius: {
    sm: 6,
    md: 10,
    lg: 14,
    full: 9999,
  },
  shadows: {
    card: {
      shadowColor: '#0f172a',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 6,
      elevation: 2,
    },
    button: {
      shadowColor: '#208AEF',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.25,
      shadowRadius: 5,
      elevation: 3,
    },
  },
};
