import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuração para exportar arquivos estáticos
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
