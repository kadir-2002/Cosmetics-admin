import OrbitingCircles from "@/Components/ui/orbiting-circles";
const ImagesContent = [
  {
    image: "/Frame15.png",
    image_alternate_text: "Image 1"
  },
  {
    image: "/Frame12.png",
    image_alternate_text: "Image 2"
  },
  {
    image: "/Frame10.png",
    image_alternate_text: "Image 2"
  },
  {
    image: "/Frame11.png",
    image_alternate_text: "Image 2"
  },
  {
    image: "/Frame14.png",
    image_alternate_text: "Image 2"
  },
  {
    image: "/Frame13.png",
    image_alternate_text: "Image 2"
  },

];

export default function TechnologiesOrbitingCircles() {
  const midpoint = Math.ceil(ImagesContent.length / 2);
  console.log(midpoint, "midpoint");
  const innerCircleImages = ImagesContent.slice(0, midpoint);
  const outerCircleImages = ImagesContent.slice(midpoint);

  return (
    <div className="relative flex h-[650px] w-full flex-col items-center justify-center overflow-hidden">
      <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-black">
        <img
          src="/logoicon.png"
          alt="Center Logo"
          className="size-[260px] border-none bg-transparent object-contain"
        />
      </span>

      {innerCircleImages.map((image: any, index: number) => (
        <OrbitingCircles
          key={`inner-${index}`}
          className="size-[40px] border-none bg-transparent z-10"
          duration={20}
          delay={index * 5}
          radius={200}
        >
          <div className="h-[40px] w-[60px] rounded-full">
            <img
              src={`${image?.image}`}
              alt={image?.image_alternate_text}
              className="h-full w-full object-cover"
            />
          </div>

        </OrbitingCircles>
      ))}

      {outerCircleImages.map((image: any, index: number) => (
        <OrbitingCircles
          key={`outer-${index}`}
          className="size-[60px] border-none bg-transparent z-10"
          radius={290}
          duration={20}
          delay={index * 5}
          reverse
        >
          <div className="h-[60px] w-[80px] rounded-full">
            <img
              src={`${image?.image}`}
              alt={image?.image_alternate_text}
              className="h-full w-full object-cover"
            />
          </div>

        </OrbitingCircles>
      ))}
    </div>
  );
}
