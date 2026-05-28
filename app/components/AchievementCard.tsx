type AchievementCardProps = {
  title: string;
  imageSrc: string;
};

export default function AchievementCard({
  title,
  imageSrc,
}: AchievementCardProps) {
  return (
    <article className="relative overflow-hidden rounded-lg achievement-card w-[85vw] sm:w-[360px] md:w-[380px] shrink-0 snap-start">
      <img
        src={imageSrc || "/prestasi/1.png"}
        alt={title || "Prestasi PKA KP"}
        className="block w-full h-90 object-cover"
      />

      <div className="absolute inset-x-0 top-0 h-24 pointer-events-none bg-linear-to-b from-[#2cb0a1] to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-4 bg-linear-to-t from-[#2cb0a1] to-transparent">
        {title ? (
          <h3 className="relative z-10 font-montserrat text-white text-xl leading-tight font-extrabold text-center">
            {title}
          </h3>
        ) : null}
      </div>
    </article>
  );
}
