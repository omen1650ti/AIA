import { Link } from "react-router-dom";

const Demo = () => {
  return (
    <div className="w-full h-full bg-amber-500 flex flex-col items-center justify-center text-white">
      <h1 className="text-4xl font-bold mb-4">This is the Demo page</h1>
      <Link
        to="/"
        className="bg-white text-amber-500 px-6 py-2 rounded-full font-bold hover:bg-amber-50 transition-colors"
      >
        Back to Marketplace
      </Link>
    </div>
  );
};

export default Demo;
