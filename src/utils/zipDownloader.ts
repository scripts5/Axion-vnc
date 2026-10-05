import JSZip from 'jszip';

export async function downloadAndroidProjectZip(filesMap: Record<string, string>): Promise<void> {
  const zip = new JSZip();
  const rootFolder = zip.folder('axion-remote-android');

  if (!rootFolder) {
    throw new Error('Falha ao criar pasta ZIP');
  }

  for (const [relativePath, content] of Object.entries(filesMap)) {
    rootFolder.file(relativePath, content);
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'axion-remote-android.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
