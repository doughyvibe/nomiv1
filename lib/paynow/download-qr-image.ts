/** Compose and download a PayNow payment card PNG (client-only). */
export async function downloadPayNowQrImage(opts: {
  storeName: string;
  amountLabel: string;
  reference: string;
  qrSvg: SVGSVGElement;
  filename: string;
}): Promise<void> {
  const width = 400;
  const height = 520;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#0f1720";
  ctx.font = "bold 22px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(opts.storeName.slice(0, 40), width / 2, 48);

  ctx.fillStyle = "#2dd4bf";
  ctx.font = "bold 32px system-ui, sans-serif";
  ctx.fillText(opts.amountLabel, width / 2, 96);

  ctx.fillStyle = "#64748b";
  ctx.font = "14px system-ui, sans-serif";
  ctx.fillText(`Ref: ${opts.reference}`, width / 2, 128);

  const svgData = new XMLSerializer().serializeToString(opts.qrSvg);
  const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  await new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const qrSize = 240;
      ctx.drawImage(img, (width - qrSize) / 2, 150, qrSize, qrSize);
      URL.revokeObjectURL(url);

      ctx.fillStyle = "#475569";
      ctx.font = "13px system-ui, sans-serif";
      const lines = [
        "Scan with your banking app",
        "to pay via PayNow",
      ];
      lines.forEach((line, i) => {
        ctx.fillText(line, width / 2, 420 + i * 22);
      });

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Failed to create image"));
          return;
        }
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = opts.filename;
        a.click();
        URL.revokeObjectURL(a.href);
        resolve();
      }, "image/png");
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to render QR"));
    };
    img.src = url;
  });
}
