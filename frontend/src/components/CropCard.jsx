import { Link } from 'react-router-dom';

export default function CropCard({ crop }) {
  const farm = crop.farmId || {};
  return (
    <Link
      to={`/crops/${crop._id}`}
      className="group overflow-hidden rounded-2xl border border-leaf-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="aspect-[4/3] overflow-hidden bg-leaf-100">
        <img
          src={crop.photos?.[0] || 'https://placehold.co/600x450/e0f3e3/1d602c?text=No+photo'}
          alt={crop.cropName}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-leaf-900">{crop.cropName}</h3>
            {farm.farmName && <p className="mt-0.5 text-xs text-leaf-800/60">{farm.farmName}, {farm.location?.district}</p>}
          </div>
          <span className="whitespace-nowrap rounded-full bg-leaf-100 px-2 py-0.5 text-xs font-semibold text-leaf-800">
            ₹{crop.pricePerUnit}/{crop.unit}
          </span>
        </div>
        {crop.isInSeason && (
          <span className="mt-3 inline-block rounded-full bg-earth-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-earth-700">
            In season
          </span>
        )}
      </div>
    </Link>
  );
}
