export default function Example() {
  return (
    <div className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
          {/* Katkı Yap */}
          <a
            href="/katki-yap"
            className="group relative transition duration-300 hover:scale-105 lg:row-span-2"
          >
            <div className="absolute inset-px rounded-lg bg-white group-hover:bg-[#fe5200] lg:rounded-l-[2rem] transition-colors duration-300"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
              <div className="px-8 pb-3 pt-8 sm:px-10 sm:pt-10">
                <p className="text-lg font-medium tracking-tight text-gray-950 group-hover:text-white transition-colors duration-300 max-lg:text-center">
                  Katkı Yap
                </p>
                <p className="mt-2 text-sm text-gray-600 group-hover:text-white transition-colors duration-300 max-lg:text-center">
                  Yazı, çizim, tasarım ya da farklı içeriklerle Mavi Dalga’ya
                  sen de katkı sunabilirsin. Kapımız tüm öğrencilere açık!
                </p>
              </div>
              <div className="relative min-h-[30rem] w-full grow">
                <div className="absolute inset-x-10 top-10 bottom-0 overflow-hidden rounded-t-[2rem]  shadow-2xl">
                  <img
                    className="size-full object-cover object-top group-hover:opacity-80 transition duration-300"
                    src="/denizAna.jpg"
                    alt="Katkı Yap"
                  />
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-l-[2rem]"></div>
          </a>

          {/* Destek Ol */}
          <a
            href="/destek-ol"
            className="group relative transition duration-300 hover:scale-105 max-lg:row-start-1"
          >
            <div className="absolute inset-px rounded-lg bg-white group-hover:bg-[#fe5200] max-lg:rounded-t-[2rem] transition-colors duration-300"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
              <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                <p className="text-lg font-medium tracking-tight text-gray-950 group-hover:text-white transition-colors duration-300 max-lg:text-center">
                  Destek Ol
                </p>
                <p className="mt-2 text-sm text-gray-600 group-hover:text-white transition-colors duration-300 max-lg:text-center">
                  Dergimizin basım ve dağıtımını sürdürebilmemiz için
                  maddi/manevi desteğinizi bekliyoruz. Her destek bizim için çok
                  kıymetli.
                </p>
              </div>
              <div className="flex flex-1 items-center justify-center px-8 max-lg:pb-12 max-lg:pt-10 sm:px-10 lg:pb-2">
                <img
                  className="w-full max-w-xs h-24 object-cover object-center group-hover:opacity-80 transition duration-300"
                  src="/orangeEbru.avif"
                  alt="Destek Ol"
                />
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-t-[2rem]"></div>
          </a>

          {/* İletişime Geç */}
          <a
            href="/iletisim"
            className="group relative transition duration-300 hover:scale-105 max-lg:row-start-3 lg:col-start-2 lg:row-start-2"
          >
            <div className="absolute inset-px rounded-lg bg-white group-hover:bg-[#fe5200] transition-colors duration-300"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)]">
              <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                <p className="text-lg font-medium tracking-tight text-gray-950 group-hover:text-white transition-colors duration-300 max-lg:text-center">
                  İletişime Geç
                </p>
                <p className="mt-2 text-sm text-gray-600 group-hover:text-white transition-colors duration-300 max-lg:text-center">
                  Soruların mı var? Bize sosyal medya hesaplarımızdan veya
                  e-posta yoluyla kolayca ulaşabilirsin.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5"></div>
          </a>

          {/* Hakkımızda */}
          <a
            href="/hakkimizda"
            className="group relative transition duration-300 hover:scale-105 lg:row-span-2"
          >
            <div className="absolute inset-px rounded-lg bg-white  max-lg:rounded-b-[2rem] lg:rounded-r-[2rem] transition-colors duration-300"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
              <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10">
                <p className="text-lg font-medium tracking-tight text-gray-950 transition-colors duration-300 max-lg:text-center">
                  Hakkımızda
                </p>
                <p className="mt-2 text-sm text-gray-600  transition-colors duration-300 max-lg:text-center">
                  Mavi Dalga, Marmara Üniversitesi Tıp Fakültesi öğrencileri
                  tarafından çıkarılan; bağımsız, gönüllü ve çok sesli bir
                  öğrenci dergisidir.
                </p>
              </div>
              <div className="relative min-h-[30rem] w-full flex items-center justify-center">
                <div className="overflow-hidden rounded-tl-xl">
                  <img
                    className="max-h-[10rem] object-contain group-hover:opacity-80 transition duration-300"
                    src="/logologo.png"
                    alt="Hakkımızda"
                  />
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
          </a>
        </div>
      </div>
    </div>
  );
}
