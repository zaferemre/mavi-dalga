import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Wave from "react-wavify";
import IletisimForm from "./iletisimForm";

const Home = () => {
  return (
    <div className="min-h-screen text-black relative">
      {/* Header */}
      <div className="">
        <Header />

        {/* Wave Background */}
        <div className="relative">
          <Wave
            fill="#fe5200"
            paused={false}
            options={{
              height: 20,
              amplitude: 20,
              speed: 0.2,
              points: 4,
            }}
            style={{
              width: "100%",
              height: "10rem",
            }}
          />
        </div>
        <IletisimForm />
        <Footer />
      </div>
    </div>
  );
};

export default Home;
