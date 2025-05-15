import {
  DocumentArrowDownIcon,
  FolderOpenIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";

export default function Example() {
  return (
    <div className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* SVG desen kısmı aynı kalabilir */}
      </div>

      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div className="lg:max-w-lg">
              <p
                className="text-base/7 font-semibold"
                style={{ color: "#fe5200" }}
              >
                Arşiv Yenilendi
              </p>
              <h1 className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                MD Arşiv
              </h1>
              <p className="mt-6 text-xl/8 text-gray-700">
                Marmara Tıp Fakültesi’nin geçmiş yıllarına dair bir yolculuğa
                çıkmaya hazır mısın? Mavi Dalga’nın tüm sayılarını bir araya
                getirdik. 2020 Kasım sayısından çok daha önceye gitmek istersen,
                seni MD Arşiv’e bekliyoruz!
              </p>
            </div>
          </div>
        </div>

        <div className="-ml-12 -mt-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
          <img
            alt=""
            src="/arsivImg.png"
            className="w-[48rem] max-w-none rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]"
          />
        </div>

        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div className="max-w-xl text-base/7 text-gray-700 lg:max-w-lg">
              <p>
                Yıllardır sakladığımız bu arşiv, şimdi dijitalde seninle. Mavi
                Dalga'nın geçmiş sayılarında kaybolmak, nostaljik bir yolculuğa
                çıkmak için hazır mısın?
              </p>
              <ul role="list" className="mt-8 space-y-8 text-gray-600">
                <li className="flex gap-x-3">
                  <FolderOpenIcon
                    aria-hidden="true"
                    className="mt-1 size-5 flex-none"
                    style={{ color: "#fe5200" }}
                  />
                  <span>
                    <strong className="font-semibold text-gray-900">
                      Kolay Erişim
                    </strong>{" "}
                    Tüm sayılar düzenli klasör yapısıyla senin için sıralandı.
                    Dilediğin sayıya tek tıkla ulaş!
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <DocumentArrowDownIcon
                    aria-hidden="true"
                    className="mt-1 size-5 flex-none"
                    style={{ color: "#fe5200" }}
                  />
                  <span>
                    <strong className="font-semibold text-gray-900">
                      PDF Olarak İndir
                    </strong>{" "}
                    Sayıları çevrimdışı okumak mı istiyorsun? İndir, sakla ve
                    istediğin zaman geri dön.
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <ClockIcon
                    aria-hidden="true"
                    className="mt-1 size-5 flex-none"
                    style={{ color: "#fe5200" }}
                  />
                  <span>
                    <strong className="font-semibold text-gray-900">
                      Zamana Yolculuk
                    </strong>{" "}
                    Mavi Dalga’nın ilk sayılarına göz at, fakültemizin tarihine
                    bir pencere aç!
                  </span>
                </li>
              </ul>
              <p className="mt-8">
                Geçmişin izlerini sürmek hiç bu kadar kolay olmamıştı.
                Arşivimizde gezin, tarihle bağ kur, ilham al!
              </p>

              <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">
                Arşiv sadece bir başlangıç!
              </h2>
              <p className="mt-6">
                Yeni sayılarımızı da buradan takip edebilirsin. Her biri
                fakültemizin ruhunu yansıtan içeriklerle dolu. Mavi Dalga’yla
                geçmiş ve gelecek bir arada!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
