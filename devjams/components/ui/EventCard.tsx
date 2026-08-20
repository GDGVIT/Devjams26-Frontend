"use client";

interface EventCardProps {
  title: string;
  description: string;
  imageUrl: string;
  alignment: "left" | "right";
}

export function EventCard({ title, description, imageUrl, alignment }: EventCardProps) {
  const isRight = alignment === "right";

  return (
    <div
      className={`flex flex-col gap-3 sm:gap-4 w-full max-w-[280px] min-[380px]:max-w-[320px] sm:max-w-[360px] md:max-w-[420px] lg:max-w-[440px] group cursor-pointer items-start ${
        isRight ? "md:items-start" : "md:items-end"
      }`}
    >
      {/* Compact Event Photo */}
      <div className="w-full overflow-hidden rounded-xl sm:rounded-2xl aspect-[16/10] border border-white/10 relative origin-center shadow-2xl transition-transform duration-300 group-hover:scale-[1.02]">
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{
            backgroundImage: `url(${imageUrl || "https://via.placeholder.com/800x500/222/555?text=Event+Image"})`,
          }}
        />
      </div>

      {/* Event Text Info */}
      <div
        className={`flex flex-col w-full items-start text-left ${
          isRight ? "md:items-start md:text-left" : "md:items-end md:text-right"
        }`}
      >
        <h3
          className={`text-base min-[380px]:text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 flex items-center gap-1.5 leading-snug ${
            isRight ? "md:justify-start" : "md:justify-end"
          } justify-start`}
        >
          {title}
        </h3>
        <p
          className={`text-gray-300 text-[11px] min-[380px]:text-xs sm:text-sm leading-relaxed text-left ${
            isRight ? "md:text-left" : "md:text-right"
          } opacity-90`}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
