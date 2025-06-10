export default function Title({ title }: { title: string }) {
  return (
    <h1 className="font-semibold text-[42px] md:text-[52px] text-lime-300">
      {title}
    </h1>
  );
}

export function SubTitle({ title }: { title: string }) {
  const words = title?.split(" ");
  return (
    <h1 className="text-[15px] md:text-[35px]">
      {words?.map((word, index) => (
        <span
          key={index}
          className={index % 2 === 0 ? "text-white" : "text-white"}
        >
          {word}{" "}
        </span>
      ))}
    </h1>
  );
}

export function SubTitleSecond({ title }: { title: string }) {
  const words = title.split(" ");
  return (
    <h1 className="text-[9px] md:text-[18px]">
      {words.map((word, index) => (
        <span key={index} className={"text-green-400 font-semibold"}>
          {word}{" "}
        </span>
      ))}
    </h1>
  );
}
