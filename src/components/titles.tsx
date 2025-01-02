export default function Title({ title }: { title: string }) {
  return (
    <h1 className="font-bold text-[56px] md:text-[72px] text-green-800">
      {title}
    </h1>
  );
}

export function SubTitle({ title }: { title: string }) {
  return (
    <h1 className=" text-[15px] md:text-[35px] text-secondary-300">{title}</h1>
  );
}
