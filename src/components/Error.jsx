import { NavLink } from "react-router-dom";

const Error = () => {
  return (
    <div className="w-screen p-8 flex flex-col justify-center items-center min-h-screen bg-slate-100">
      <h1 className="animate-bounce text-[15px] lg:text-2xl font-extrabold">
        404 - PAGE NOT FOUND!!!
      </h1>
      <h1 className="animate-bounce text-[15px] lg:text-2xl font-extrabold">
        404 - PAGE NOT FOUND!!!
      </h1>
      <h1 className="animate-bounce text-[15px] lg:text-2xl font-extrabold">
        404 - PAGE NOT FOUND!!!
      </h1>
      <NavLink
        to={"/"}
        className="inline-block text-[18px] lg:text-xl text-white font-semibold hover:text-white p-3 my-6 z-50 border-[3px] border-[tomato] rounded-full bg-slate-400 hover:bg-[tomato] duration-300"
      >
        Back to Home...
      </NavLink>
    </div>
  );
};

export default Error;
