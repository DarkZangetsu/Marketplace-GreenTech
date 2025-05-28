export default function Lightbox({ open, onClose, url, type }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80" onClick={onClose}>
      <div className="relative max-w-3xl w-full max-h-[90vh] flex flex-col items-center" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-2 right-2 text-white text-2xl font-bold z-10">×</button>
        {type === 'image' ? (
          <img src={url} alt="Aperçu" className="max-h-[80vh] max-w-full rounded-lg" />
        ) : type === 'video' ? (
          <video src={url} controls autoPlay className="max-h-[80vh] max-w-full rounded-lg bg-black" />
        ) : null}
        <a
          href={url}
          download
          className="mt-4 px-4 py-2 bg-white text-gray-800 rounded shadow hover:bg-gray-100"
        >
          Télécharger
        </a>
      </div>
    </div>
  );
}
