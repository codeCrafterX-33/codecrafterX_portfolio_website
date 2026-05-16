const TitleHeader = ({ title, sub }: { title: any; sub: any }) => {
  return (
    <div className="flex flex-col items-center gap-5 ">
      <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm md:text-base dark:border-transparent dark:bg-black-200">
        <p className="font-medium text-emerald-950 dark:text-white-50">
          {sub}
        </p>
      </div>

      <div className="text-center text-3xl font-semibold leading-tight text-slate-950 md:text-5xl dark:text-white">
        {title}
      </div>
    </div>
  );
};

export default TitleHeader;
