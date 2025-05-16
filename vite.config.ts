import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({ // No necesitas ({ mode }) => (...) si no usas 'mode'
  server: {
    // host: true, // O 'localhost'. Si lo omites, Vite usa 'localhost' por defecto.
                  // 'true' es lo mismo que '0.0.0.0' para escuchar en todas las interfaces.
                  // Para localhost, a menudo es mejor omitirlo o poner 'localhost'.
    port: 5173, // Puerto por defecto de Vite, o el que prefieras (ej. 3000, 8080)
    watch: {
      usePolling: true // Puedes mantenerlo si te ayuda con la detección de cambios
    }
    // 'allowedHosts' no suele ser necesario para localhost
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: '/',
  // 'build' options no afectan el servidor de desarrollo
});