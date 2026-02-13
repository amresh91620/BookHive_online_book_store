import { useEffect, useMemo, useState } from "react";

const BookCarousel3D = ({ books = [], className = "" }) => {
  const [coverStep, setCoverStep] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  const coverBooks = useMemo(
    () => books.filter((book) => book.coverImage).slice(0, 10),
    [books]
  );

  const config = useMemo(() => {
    if (viewportWidth < 640) return { width: 140, height: 210, spacing: 50, rotate: 25, perspective: "1000px" };
    if (viewportWidth < 1024) return { width: 180, height: 270, spacing: 80, rotate: 30, perspective: "1500px" };
    return { width: 220, height: 330, spacing: 120, rotate: 35, perspective: "2000px" };
  }, [viewportWidth]);

  useEffect(() => {
    if (coverBooks.length <= 1) return;
    const timer = setInterval(() => setCoverStep((p) => p + 1), 4000);
    return () => clearInterval(timer);
  }, [coverBooks.length]);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`relative w-full  ${className}`} style={{ perspective: config.perspective }}>
      <div 
        className="relative w-full flex items-center justify-center transition-all duration-700"
        style={{ height: `${config.height + 100}px` }}
      >
        {coverBooks.map((book, index) => {
          const total = coverBooks.length;
          let position = (index - (coverStep % total) + total) % total;
          if (position > total / 2) position -= total;

          const absPos = Math.abs(position);
          const isActive = position === 0;
          
          // Realistic Math
          const scale = isActive ? 1.1 : 1 - absPos * 0.12;
          const xOffset = position * config.spacing;
          const rotateY = position * -config.rotate;
          const opacity = absPos > 3 ? 0 : 1 - absPos * 0.3;

          return (
            <div
              key={book._id || index}
              className="absolute transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]"
              style={{
                width: `${config.width}px`,
                height: `${config.height}px`,
                transform: `translateX(${xOffset}px) scale(${scale}) rotateY(${rotateY}deg)`,
                zIndex: 100 - absPos,
                opacity,
                visibility: opacity === 0 ? "hidden" : "visible",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Active Book Background Glow */}
              {isActive && (
                <div className="absolute inset-0 bg-blue-500/30 blur-[60px] rounded-full scale-110 animate-pulse" />
              )}

              {/* Main Book Container */}
              <div className="group relative w-full h-full preserve-3d">
                {/* Real 3D Spine Effect */}
                <div 
                  className="absolute top-0 left-0 h-full w-[10px] bg-[#020617] origin-left"
                  style={{ transform: "rotateY(-90deg)" }}
                />

                <div className={`
                  relative w-full h-full rounded-r-md overflow-hidden
                  transition-all duration-500
                  border-y border-r border-white/10
                  shadow-[20px_20px_50px_rgba(0,0,0,0.5),-5px_0_15px_rgba(0,0,0,0.2)]
                  ${isActive ? "brightness-110" : "brightness-50 grayscale-[20%]"}
                `}>
                  {/* Glossy Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/20 pointer-events-none z-10" />
                  
                  {/* Book Page Edge Mockup (Right side) */}
                  <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-l from-white/10 to-transparent" />

                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating Shadow */}
                <div 
                  className={`
                    absolute -bottom-12 left-1/2 -translate-x-1/2 
                    w-[90%] h-8 bg-black/40 blur-2xl rounded-[100%]
                    transition-opacity duration-1000
                    ${isActive ? "opacity-100" : "opacity-80"}
                  `}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookCarousel3D;