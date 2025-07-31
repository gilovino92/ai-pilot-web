export async function downloadFile(
  source: Blob | string,
  filename?: string,
): Promise<void> {
  const DEFAULT_FILENAME = "downloaded-file";

  if (source instanceof Blob) {
    const url = URL.createObjectURL(source);

    try {
      await initiateDownload(url, filename || DEFAULT_FILENAME);
    } finally {
      URL.revokeObjectURL(url);
    }
  } else {
    if (!filename) {
      filename = source.split("/").pop()?.split("?")[0] || "downloaded-file";
    }
    await initiateDownload(source, filename);
  }
}

export function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function trimFilename(filename: string, maxLength = 30): string {
  const lastDotIndex = filename.lastIndexOf(".");
  const ellipsis = "...";

  if (filename.length <= maxLength) {
    return filename;
  }

  if (lastDotIndex <= 0) {
    const halfLength = Math.floor((maxLength - ellipsis.length) / 2);
    return (
      filename.slice(0, halfLength) +
      ellipsis +
      filename.slice(filename.length - halfLength)
    );
  }

  const name = filename.slice(0, lastDotIndex);
  const extension = filename.slice(lastDotIndex);

  if (extension.length >= maxLength - ellipsis.length) {
    return extension.slice(0, maxLength - ellipsis.length) + ellipsis;
  }

  const availableSpace = maxLength - extension.length - ellipsis.length;

  const startChars = Math.ceil(availableSpace / 2);
  const endChars = Math.floor(availableSpace / 2);

  return (
    name.slice(0, startChars) +
    ellipsis +
    name.slice(name.length - endChars) +
    extension
  );
}

function initiateDownload(url: string, filename: string): Promise<void> {
  return new Promise((resolve) => {
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      resolve();
    }, 100);
  });
}
