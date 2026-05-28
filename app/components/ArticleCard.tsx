import Link from "next/link";

export type Article = {
  title: string;
  desc: string;
  date: string;
  image: string;
};

export default function ArticleCard({
  article,
  href,
}: {
  article: Article;
  href?: string;
}) {
  const card = (
    <article className="bg-white border border-[#d5d5d5] rounded-xl p-3 shadow-sm w-full">
      <div className="w-full overflow-hidden rounded-md">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-56 md:h-64 rounded-md object-cover"
        />
      </div>
      <h3 className="mt-3 text-lg font-bold text-[#000878] leading-tight line-clamp-2 font-helvetica">
        {article.title}
      </h3>
      <p className="mt-2 text-sm text-[#171b23] leading-snug line-clamp-3 font-poppins">
        {article.desc}
      </p>
      <p className="mt-2 text-sm text-[#171b23] font-poppins">{article.date}</p>
    </article>
  );

  if (href) {
    return (
      <Link href={href} className="block hover:brightness-95">
        {card}
      </Link>
    );
  }

  return card;
}
