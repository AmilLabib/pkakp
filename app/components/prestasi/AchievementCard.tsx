export default function AchievementCard({
  title,
  imageSrc,
}: {
  title: string;
  imageSrc: string;
}) {
  return (
    <div className="rounded-lg overflow-hidden bg-white shadow-sm">
      <img src={imageSrc} alt={title} className="w-full h-48 object-cover" />
      <div className="p-3">
        <h4 className="font-montserrat text-sm font-semibold text-[#143434]">
          {title}
        </h4>
      </div>
    </div>
  );
}
