export default function Example() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
          <svg
            viewBox="0 0 1024 1024"
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -z-10 size-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
          >
            <circle
              r={512}
              cx={512}
              cy={512}
              fill="url(#orange-gradient)"
              fillOpacity="0.7"
            />
            <defs>
              <radialGradient id="orange-gradient">
                <stop stopColor="#FFA500" />
                <stop offset={1} stopColor="#FF4500" />
              </radialGradient>
            </defs>
          </svg>

          {/* Text Content */}
          <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
            <h2 className="text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">
              Mavi Dalga’ya Katıl!
            </h2>
            <p className="mt-6 text-lg/8 text-pretty text-gray-300">
              Mavi Dalga, öğrenciler tarafından gönüllülükle sürdürülen bağımsız
              bir yayındır. İçerik üretmekten tasarıma, dağıtımdan organizasyona
              kadar her adımda katkınız bizim için çok değerli. Sen de bu
              heyecana ortak ol, derginin bir parçası haline gel!
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
              <a
                href="/katki-yap"
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-xs hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Katkı yapın
              </a>
              <a
                href="/hakkimizda"
                className="text-sm/6 font-semibold text-white"
              >
                Hakkımızda <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          {/* Image */}
          <div className="relative mt-16 h-80 lg:mt-0 lg:h-full lg:w-auto lg:flex-shrink-0 lg:absolute lg:bottom-0 lg:right-0">
            <img
              alt="App screenshot"
              src="/orangeLady.jpg"
              width={1824}
              height={1080}
              className="h-full w-full object-cover object-center rounded-md bg-white/5 ring-1 ring-white/10"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
