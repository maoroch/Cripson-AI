import Sidebar from "./component/Sidebar";
import Cards from "./component/Cards";
import Hashtags from "./component/Hashtags";
import Recharts from "./component/Recharts"
import Modal from "./component/modal";

export default function Home() {
  return (
    <div className="flex" id="dashboard">
    <Sidebar />
    <div className="ml-0 xl:ml-60 md:ml-70 xl:pt-15 pt-20 xl:px-20 w-full px-5 gap-10 grid">
      <Cards />
      <Hashtags />
      <Recharts />

              {/* --- МОДАЛКИ --- */}
<Modal id="instagram" />

    </div>
    </div>
  );
}
