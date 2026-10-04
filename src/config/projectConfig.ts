/**
 * =====================================================================
 * AXION — Universal AI Engine
 * Arquivo Central de Configuração do Projeto
 * =====================================================================
 * 
 * Este arquivo foi projetado para que você possa atualizar facilmente as
 * informações do projeto, o repositório GitHub e disponibilizar os arquivos
 * de download tanto para COMPUTADOR (PC / Desktop) quanto para ANDROID (.APK).
 * 
 * INSTRUÇÕES:
 * 1. Para liberar o download para COMPUTADOR (PC):
 *    Substitua o valor de `PC_DOWNLOAD_URL` pela URL direta do instalador
 *    (exemplo: "https://github.com/usuario/axion/releases/download/v0.1.0/axion-setup-pc.exe")
 * 
 * 2. Para liberar o download do APK (Android / Emuladores):
 *    Substitua o valor de `APK_DOWNLOAD_URL` pela URL do arquivo .apk
 *    (exemplo: "https://github.com/usuario/axion/releases/download/v0.1.0/axion-v0.1.0.apk")
 * 
 * 3. Para conectar ao repositório GitHub:
 *    Substitua `GITHUB_URL` pelo link real do seu repositório.
 * =====================================================================
 */

export interface ProjectConfig {
  projectName: string;
  projectSubtitle: string;
  tagline: string;
  version: string;
  versionStage: string;
  primaryPlatform: string;
  targetPlatform: string;
  pcRequirements: string;
  minAndroidVersion: string;
  architecture: string;
  expectedFileSize: string;
  packageIdentifier: string;
  pcDownloadUrl: string;
  apkDownloadUrl: string;
  githubUrl: string;
  isPcReady: boolean;
  isApkReady: boolean;
  isGithubReady: boolean;
  supportEmail: string;
  releaseYear: string;
}

/**
 * CONFIGURAÇÃO PRINCIPAL DO AXION
 * Modifique as variáveis abaixo conforme a evolução do projeto:
 */

// ⚠️ URL DE DOWNLOAD PARA COMPUTADOR (PC / Windows / Linux / macOS)
// Deixe como "" enquanto o executável estiver em desenvolvimento
export const PC_DOWNLOAD_URL: string = "";

// ⚠️ URL REAL DO APK (Android e Emuladores de PC)
// Deixe como "" enquanto o APK estiver em desenvolvimento
export const APK_DOWNLOAD_URL: string = "";

// ⚠️ URL REAL DO GITHUB
// Deixe como "" enquanto o repositório estiver em preparação
export const GITHUB_URL: string = "";

// Versão e detalhes do aplicativo
export const APP_VERSION: string = "0.1.0";
export const APP_STAGE: string = "Alpha Inicial";
export const APP_PRIMARY_PLATFORM: string = "Computador (PC) & Android";
export const PC_REQUIREMENTS: string = "Windows 10/11 (64-bit), Linux ou macOS";
export const MIN_ANDROID_VERSION: string = "Android 8.0+ ou Emulador de PC (BlueStacks / WSA)";
export const TARGET_ARCHITECTURE: string = "x86_64 (PC) / ARM64-v8a";
export const PACKAGE_IDENTIFIER: string = "com.axion.engine";
export const EXPECTED_FILE_SIZE: string = "~45 MB (PC) / ~28 MB (APK)";
export const RELEASE_YEAR: string = "2026";

export const PROJECT_CONFIG: ProjectConfig = {
  projectName: "AXION",
  projectSubtitle: "Universal AI Engine",
  tagline: "Uma plataforma de inteligência artificial para criar, programar e transformar ideias em projetos.",
  version: APP_VERSION,
  versionStage: APP_STAGE,
  primaryPlatform: APP_PRIMARY_PLATFORM,
  targetPlatform: "Computador & Android",
  pcRequirements: PC_REQUIREMENTS,
  minAndroidVersion: MIN_ANDROID_VERSION,
  architecture: TARGET_ARCHITECTURE,
  expectedFileSize: EXPECTED_FILE_SIZE,
  packageIdentifier: PACKAGE_IDENTIFIER,
  pcDownloadUrl: PC_DOWNLOAD_URL,
  apkDownloadUrl: APK_DOWNLOAD_URL,
  githubUrl: GITHUB_URL,
  // Helpers computados para saber se os arquivos estão disponíveis
  isPcReady: Boolean(PC_DOWNLOAD_URL && PC_DOWNLOAD_URL.trim().length > 0),
  isApkReady: Boolean(APK_DOWNLOAD_URL && APK_DOWNLOAD_URL.trim().length > 0),
  isGithubReady: Boolean(GITHUB_URL && GITHUB_URL.trim().length > 0 && !GITHUB_URL.includes("placeholder")),
  supportEmail: "contato@axion-engine.io",
  releaseYear: RELEASE_YEAR,
};
