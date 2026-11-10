# Madrid Apoyo Especializado v1.7 (DATAMAD 2026)

Buscador independiente de recursos sociales y sanitarios autorizados en la Comunidad de Madrid, basado en registros públicos oficiales.

## 🚀 Requisitos e Instalación

### Requisitos previos
- Node.js >= 18.0.0
- npm >= 9.0.0

### Pasos de instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/madrid-apoyo/madrid-apoyo-especializado.git
cd madrid-apoyo-especializado

# 2. Instalar dependencias limpiamente
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev
```

El servidor estará disponible en `http://localhost:3000`.

## 📦 Comandos Disponibles

- `npm run dev`: Inicia el servidor de desarrollo en la puerta 3000.
- `npm run build`: Compila la aplicación web optimizada para producción (`dist/`).
- `npm run lint`: Realiza la comprobación de tipos de TypeScript (`tsc --noEmit`).
- `npm run preview`: Sirve la build local para previsualización.

## 📋 Arquitectura y Principios de Diseño

1. **Procedencia Registral al 100%**: Todos los recursos canónicos proceden de registros auditados de la Comunidad de Madrid (RECESS y Sanidad CAM).
2. **Modelo de Evidencia (A1, A2, B1, B2, C)**: Ordenación lexicográfica estricta donde la evidencia de especialización prevalece sobre la distancia.
3. **Privacidad Efímera (RGPD)**: No se almacenan términos de salud ni coordenadas GPS en servidores externos; la geolocalización es efímera en el navegador.
4. **Reproducibilidad Completa**: Todas las dimensiones de búsqueda se codifican en la URL de forma limpia para permitir su compartición.

## 📄 Licencia

Licencia Apache 2.0. Código abierto y transparente.
