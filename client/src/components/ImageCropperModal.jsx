import { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';
import 'react-easy-crop/react-easy-crop.css';

// Helper to generate a Blob/File from the cropped area using a canvas
async function getCroppedImageBlob(imageSrc, cropAreaPixels, fileType = 'image/jpeg') {
  const image = new Image();
  image.src = imageSrc;
  image.crossOrigin = 'anonymous';

  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
  });

  const canvas = document.createElement('canvas');
  canvas.width = cropAreaPixels.width;
  canvas.height = cropAreaPixels.height;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(
    image,
    cropAreaPixels.x,
    cropAreaPixels.y,
    cropAreaPixels.width,
    cropAreaPixels.height,
    0,
    0,
    cropAreaPixels.width,
    cropAreaPixels.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        resolve(blob);
      },
      fileType,
      0.9
    );
  });
}

function ImageCropperModal({ open, imageSrc, originalFile, onCancel, onComplete }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  if (!open || !imageSrc) return null;

  const handleApply = async () => {
    if (!croppedAreaPixels) return;
    setSubmitting(true);
    setError('');

    try {
      const blob = await getCroppedImageBlob(imageSrc, croppedAreaPixels, originalFile.type);
      const croppedFile = new File([blob], originalFile.name, { type: originalFile.type });
      onComplete(croppedFile);
    } catch (err) {
      setError(err.message || 'Failed to crop image');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-xl shadow-slate-950/70">
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-50">Crop Image</h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-slate-400 hover:text-slate-200"
          >
            Cancel
          </button>
        </div>

        <div className="relative h-72 w-full bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={9 / 7} // ~450x350 aspect ratio
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            cropShape="rect"
            showGrid
          />
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-slate-800 px-4 py-3">
          <div className="flex-1">
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-sky-500"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Drag to reposition. Use the slider to zoom. Aspect ratio is fixed for consistency.
            </p>
          </div>
          <button
            type="button"
            disabled={submitting}
            onClick={handleApply}
            className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-sky-900/40 transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-sky-800"
          >
            {submitting ? 'Applying...' : 'Apply Crop'}
          </button>
        </div>
        {error && <p className="px-4 pb-3 text-xs text-red-300">{error}</p>}
      </div>
    </div>
  );
}

export default ImageCropperModal;


