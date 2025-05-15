import {
  UsersIcon,
  LightBulbIcon,
  NewspaperIcon,
} from "@heroicons/react/24/solid";

const features = [
  {
    name: "Öğrenci İnisiyatifi",
    description:
      "Mavi Dalga, tamamen Marmara Üniversitesi Tıp Fakültesi öğrencileri tarafından hazırlanır. Her sayı, gönüllülükle ve özveriyle oluşturulur.",
    icon: UsersIcon,
  },
  {
    name: "Yaratıcı Ruh",
    description:
      "Bilimsel yazılardan karikatürlere, edebiyattan röportajlara kadar geniş bir yelpazede içerik sunar. Herkesin katkı sağlayabileceği bir platformdur.",
    icon: LightBulbIcon,
  },
  {
    name: "Bağımsız Yayıncılık",
    description:
      "Hiçbir ticari veya kurumsal bağlılık olmadan, özgünlüğünü ve ifade özgürlüğünü temel alarak yayımlanır.",
    icon: NewspaperIcon,
  },
];

export default function Example() {
  return (
    <div className="overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pt-4 lg:pr-8">
            <div className="lg:max-w-lg">
              <h2
                className="text-base/7 font-semibold"
                style={{ color: "#fe5200" }}
              >
                Biz Kimiz?
              </h2>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
                Mavi Dalga’yı Tanıyın
              </p>
              <p className="mt-6 text-lg/8 text-gray-600">
                Mavi Dalga, Marmara Üniversitesi Tıp Fakültesi öğrencileri
                tarafından kar amacı güdülmeden çıkarılan bir öğrenci
                dergisidir.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base/7 text-gray-600 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900">
                      <feature.icon
                        aria-hidden="true"
                        className="absolute top-1 left-1 size-5"
                        style={{ color: "#fe5200" }}
                      />
                      {feature.name}
                    </dt>{" "}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <img
            alt="Mavi Dalga ekibi"
            src="/dalgaMain.jpg"
            width={2432}
            height={1442}
            className="w-[48rem] max-w-none rounded-xl ring-1 shadow-xl ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
          />
        </div>
      </div>
    </div>
  );
}
