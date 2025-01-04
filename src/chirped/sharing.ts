import html2canvas from "html2canvas";

export async function exportComponentAsBlob(
  element: HTMLElement,
): Promise<Blob> {
  const canvas = await html2canvas(element);

  const blob = await new Promise<Blob | null>((resolve) => {
    const blobCallback = (blob: Blob | null) => {
      if (!blob) {
        console.error("Failed to export component as image.");
        resolve(null);
        return;
      }

      resolve(blob);
    };

    canvas.toBlob(blobCallback, "image/png", 1.0);
  });

  if (!blob) {
    throw new Error("Failed to export component as image.");
  }

  return blob;
}

const downloadImage = (blob: Blob, fileName: string) => {
  const fakeLink = window.document.createElement("a");
  fakeLink.style.display = "none";
  fakeLink.download = fileName;

  fakeLink.href = window.URL.createObjectURL(blob);

  document.body.appendChild(fakeLink);
  fakeLink.click();
  document.body.removeChild(fakeLink);

  fakeLink.remove();
};

// works by trying to share the file with the Web Share API
// if it's available, otherwise it falls back to a download
export async function shareComponent(element: HTMLElement, fileName: string) {
  const blob = await exportComponentAsBlob(element);
  const file = new File([blob], fileName, { type: "image/png" });
  const shareData = {
    files: [file],
  };
  const navigator = window.navigator;
  if (navigator.canShare && navigator.canShare(shareData)) {
    await navigator.share(shareData);
  } else {
    downloadImage(blob, fileName);
  }
}
