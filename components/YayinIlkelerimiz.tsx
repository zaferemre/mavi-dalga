"use client";

import React from "react";
import { motion } from "motion/react";

const spring = { type: "spring", stiffness: 300, damping: 30 } as const;

export default function YayinIlkelerimizMain() {
  const sections = [
    { id: "genel-ilkeler", title: "Genel İlkeler" },
    { id: "etik-ilkeler", title: "Etik İlkeler" },
    { id: "yasal-telif", title: "Yasal İlkeler ve Telif Hakkı" },
    { id: "editoryal-kurallar", title: "Editoryal Kurallar" },
    { id: "yazim-kurallari", title: "Yazım Kuralları" },
    { id: "yazarlar", title: "Yazarlar" },
    { id: "dijital-medya", title: "Dijital Medya" },
  ];

  return (
    <div className="relative mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Page header */}
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
          Mavi Dalga Dergi Yayın İlkeleri
        </h1>
        <p className="mt-3 text-slate-700 leading-relaxed">
          Mavi Dalga dergisi, Marmara Üniversitesi Tıp Fakültesi öğrencileri
          tarafından her akademik yılda Kültür-Sanat-Yaşam ve Bilim konulu bir
          sayı, 14 Mart Tıp Bayramı’nda bir sayı ve dönemin editör ekibinin
          uygun gördüğü ek sayılar ile mavidalga.org adresli internet sitesinde
          yayın yapan kâr amacı gütmeyen bir kuruluştur. Mavi Dalga dergisi,
          Marmara Üniversitesi Tıp Fakültesi öğrencilerinin inisiyatifiyle
          çıkartılır.
        </p>
        <p className="mt-3 text-slate-700 leading-relaxed">
          Mavi Dalga dergisi olarak{" "}
          <span className="font-semibold">01.04.2021</span> tarihinde kabul
          ettiğimiz yayın ilkeleri şunlardır:
        </p>
      </motion.header>

      {/* TOC / Quick nav */}
      <motion.nav
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
        className="sticky top-0 z-[1] -mx-4 mb-8 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-slate-200/60"
      >
        <div className="px-4 py-3 overflow-x-auto">
          <ul className="flex gap-2 min-w-full">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50 active:scale-[.98]"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </motion.nav>

      {/* Content card */}
      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
        className="rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="p-6 sm:p-8 md:p-10 space-y-10">
          {/* Genel İlkeler */}
          <section id="genel-ilkeler" className="scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Genel İlkeler
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700 leading-relaxed">
              <li>
                Dergi, fakülte öğrencileri tarafından çıkarılmakta olup Marmara
                Üniversitesi Tıp Fakültesinin ve T.C. Marmara Üniversitesinin
                kurumsal görüşlerini yansıtmaz.
              </li>
              <li>
                Mavi Dalga dergilerinde, kültür-sanat-yaşam ve bilim ile ilgili
                bilimsel içerikli veya düşünce yazıları yayınlanmaktadır.
              </li>
              <li>
                Dergi içerikleri, dergi editörlerinin ve yayın ekibinin değil;
                yazarların kendi kişisel görüşlerini yansıtır.
              </li>
              <li>
                Mavi Dalga dergisi yukarıda belirtildiği üzere her akademik
                yılda bir defa sayı yayınlanmakta olup 14 Mart Tıp Bayramı’nda
                ve dönem editör ekibinin uygun gördüğü zamanlarda ek sayılar
                halinde yayınlanır, editör takımı değişiklik yapma hakkını saklı
                tutar.
              </li>
              <li>
                Mavi Dalga, 14 Mart Tıp Bayramı’nda çıkardığı özel sayılarla
                Marmara Üniversitesi Tıp Fakültesine özgü içeriklere sahiptir.
              </li>
              <li>
                Derginin ismi “Mavi Dalga”dır ve “MD” olarak kısaltılabilir.
              </li>
            </ul>
          </section>

          {/* Etik İlkeler */}
          <section id="etik-ilkeler" className="scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Etik İlkeler
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700 leading-relaxed">
              <li>
                Mavi Dalga’da hiçbir ırkı, cinsiyeti, yaşı, sağlık durumunu,
                bedensel engeli, sosyal düzeyi ve dini inançları nedeniyle
                kınayan ve aşağılayan yazılara yer verilmez.
              </li>
              <li>
                Bir etnik, dini ve yabancı gruba, azınlıklara veya herhangi bir
                kimlik ya da gruba yönelik ön yargı içeren yazılar yayınlanmaz.
                Yayınlarda farklı kesimlerin hassasiyeti göz önünde
                bulundurulmasına gayret gösterilir.
              </li>
              <li>
                Kişileri ve kuruluşları, eleştiri sınırlarının ötesinde küçük
                düşüren, aşağılayan veya iftira niteliği taşıyan ifadelere yer
                veren yazılar yayınlanmaz.
              </li>
              <li>Şiddet ve zorbalığı özendirici yayın yapmaktan kaçınılır.</li>
              <li>
                Yayınladığı tıbbi içerikli yazılarda bireylerin ve hastaların
                mahremiyetine ve özel hayatın gizliliğine saygı duyulur.
              </li>
              <li>
                Yayınlanan tıbbi içerikli yazılar uzmanlar tarafından yazılmış
                dahi olsa tıbbi tavsiye yerine geçmez, tanı veya tedavi amaçlı
                kullanılamaz. Mavi Dalga, bu durumlarda ortaya çıkabilecek
                sağlık sorunlarından sorumlu değildir.
              </li>
              <li>
                Dergide ve ilişkili platformlardaki ilan ve reklam niteliğindeki
                yayınların bu nitelikleri, tereddüte yer bırakmayacak şekilde
                belirtilir.
              </li>
              <li>
                Yanlış veya eksik bilgi vermekten kaynaklanan mağduriyet
                durumlarının giderilmesi için cevap ve tekzip haklarının
                kullanılmasına özen gösterilir.
              </li>
              <li>
                Yayınlarda şiddet anlatısı ve/veya tetikleyici içerik bulunmakta
                ise okuyucuyu uyaracak bir metin açık olarak yazının girişinde
                bulunur.
              </li>
            </ul>
          </section>

          {/* Yasal İlkeler ve Telif Hakkı */}
          <section id="yasal-telif" className="scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Yasal İlkeler ve Telif Hakkı
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700 leading-relaxed">
              <li>
                Yazarlar ilk yayımlama hakkını Mavi Dalga dergisine verir.
                Dergimiz yazılar için telif ücreti ödemez.
              </li>
              <li>
                Mavi Dalga dergisinde yayımlanan yazıların içerikleriyle ilgili
                her türlü yasal ve bilimsel sorumluluk yazar/yazarlara aittir.
              </li>
              <li>
                Dergimiz makale, yazı ve diğer tüm içeriklerin yayınlanması için
                yazarlardan hiçbir ücret (başvuru ücreti, değerlendirme ücreti,
                yayın ücreti, masraf vb.) veya başka bir menfaat talep etmez.
              </li>
              <li>
                Mavi Dalga dergisinde yayımlanan yazılardan kaynak göstermek
                şartı ile alıntı yapılabilir.
              </li>
              <li>
                Mavi Dalga, dergide yer alan yazıların okurlar tarafından
                indirilmesine, kopyalanmasına, dağıtılmasına, yazdırılmasına,
                yasal bir amaçla kullanılmasına kâr amacı güdülmediği müddetçe
                izin verir.
              </li>
            </ul>
          </section>

          {/* Editoryal Kurallar */}
          <section id="editoryal-kurallar" className="scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Editoryal Kurallar
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700 leading-relaxed">
              <li>
                Yazıların çıkarılacak sayılara atanması, yazım düzenlemeleri ve
                intihal incelemeleri Denetleme ve Redaksiyon Kurulu tarafından
                yapılır.
              </li>
              <li>
                Denetleme ve Redaksiyon Kurulu sayılarda ve internet sitesinde
                hangi yazılara yer verileceğine adil ve tarafsız bir biçimde
                karar verir.
              </li>
              <li>
                Dergimiz okurlarının geçmiş sayılarda yer alan yazılara dair
                düşünce ve görüşlerini belirten yazılara dergimizde yer
                verilebilir. Düşünce yazıları genel yayın ilkelerine tâbidir.
              </li>
              <li>
                {" "}
                Sorular, öneriler ve yorumlar için{" "}
                <a
                  className="underline decoration-slate-300 hover:decoration-slate-400"
                  href="mailto:info@mavidalga.org"
                >
                  info@mavidalga.org
                </a>{" "}
                adresi kullanılabilir.
              </li>
            </ul>
          </section>

          {/* Yazım Kuralları */}
          <section id="yazim-kurallari" className="scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Yazım Kuralları
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700 leading-relaxed">
              <li>
                Mavi Dalga dergisinde Türkçe ve İngilizce dillerinde yazılar
                yayımlanır. Türkçe yazılarda Türk Dil Kurumu Yazım Kılavuzu’na
                sadık kalınır.
              </li>
              <li>
                Mavi Dalga dergisi, sanatsal kaygı ve kolay anlaşılabilirlik
                gibi sebeplerle galat-ı meşhur ifadeleri kullanmayı tercih
                edebilir.
              </li>
            </ul>
            <p className="mt-3 text-slate-700 leading-relaxed">
              Kaynakça belirtilirken yazarlar tarafından izlenmesi gereken
              yöntemler aşağıda sıralanmıştır:
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-6 text-slate-700 leading-relaxed">
              <li>
                Belirtilen kaynakçaların güncelliğini koruduğundan emin olmak
                yazarların sorumluluğundadır. (Örneğin kaynakça olarak bir
                internet sayfası gösterildiğinde içerik tarafımıza yollanmadan
                önce kaynakçası gösterilen içeriğin hala orada durduğundan emin
                olunmalıdır.)
              </li>
              <li>
                Hem bilimsellik savı taşıyan hem de alıntılanan diğer içerikler
                için APA formatında kaynakça belirtilmesi gerekmektedir.
              </li>
            </ul>
            <p className="mt-3 text-slate-700 leading-relaxed">
              İntihal politikamız aşağıda belirtilmiştir:
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-6 text-slate-700 leading-relaxed">
              <li>
                İntihal, emek hırsızlığı gibi etik ihlaller Mavi Dalga
                tarafından kabul edilemez bulunur. Yayımlanan yazıların
                özgünlüğü yazarın kendi sorumluluğundadır.
              </li>
              <li>
                Mavi Dalga Denetleme ve Redaksiyon Kurulu tarafından kaynakça
                belirtmek için izlenecek düzenlemeler üstte belirtilmiştir.
              </li>
            </ul>
          </section>

          {/* Yazarlar */}
          <section id="yazarlar" className="scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Yazarlar
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700 leading-relaxed">
              <li>
                Yukarıda belirtilen amaç ve kapsam çerçevesinde hazırlanan
                yazıların özgün olması gerekmektedir.
              </li>
              <li>
                Yazarlar Türkçe ve İngilizce dillerinde yazılar gönderebilirler.
              </li>
              <li>
                Açık çağrı yöntemi uygulanan veya dizinlenmiş bölümlerde yazan
                yazarlara içeriklerini içeren sayılardan kendileri için bir adet
                ayrılır.
              </li>
              <li>
                Tüm yazarlar, içeriklerinin reklam veya işbirliği gibi
                sebeplerle Mavi Dalga dışı platformlarda da yayımlanabileceğini
                kabul etmiş sayılırlar.
              </li>
              <li>
                Sayılan tüm maddeler bağlamında yazarlar, içeriklerinin yayın
                haklarını Mavi Dalga’ya devretmiş sayılırlar.
              </li>
              <li>
                Genel İlkeler: 5. Madde ile bağlantılı olarak, içeriklerde
                editörler tarafından biçimsel bir değişiklik yapıldıysa yazar
                yazının son hali ile alakalı bilgilendirir. Bilgilendirmeyi
                takip etmek yazarın sorumluluğundadır.
              </li>
            </ul>
          </section>

          {/* Dijital Medya */}
          <section id="dijital-medya" className="scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Dijital Medya
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700 leading-relaxed">
              <li>
                Mavi Dalga’nın resmi hesaplarından yapılan paylaşımlarda amaç,
                Mavi Dalga’nın görünürlüğünü ve bilinirliğini artırmak ve
                okurlarla iletişimde bulunulmasını kolaylaştırmaktır.
              </li>
              <li>
                Mavi Dalga’nın yayın yaptığı sosyal medya platformları
                belirtildiği gibidir:
                <ul className="mt-2 list-disc pl-6">
                  <li>Instagram (@mavidalgadergi)</li>
                  <li>Twitter (@mavidalgadergi)</li>
                  <li>LinkedIn (Mavi Dalga)</li>
                </ul>
              </li>
              <li>
                Yazarlar: 4. Madde ile bağlantılı olarak yazılar yayınlandıktan
                sonra yukarıda belirtilen hesaplardan dergi takipçilerine
                duyurulabilir. Yazar bunu yazısını teslim etmesiyle birlikte
                onaylamış kabul edilir.
              </li>
              <li>
                Sosyal medya içeriklerinde kullanılan dil ve anlatım Mavi Dalga
                Yayın İlkeleri’nin diğer maddeleriyle örtüşecek doğrultudadır.
              </li>
              <li>
                Mavi Dalga editörleri sosyal medyayı haber alma aracı olarak
                kullanabilir. Dijital mecradan alınan her bilgi, kullanılmadan
                önce güvenilir kaynaklardan teyit edilir.
              </li>
            </ul>
          </section>

          {/* Footer note */}
          <section className="scroll-mt-24">
            <p className="mt-2 text-sm text-slate-600">
              Bu yayın ilkeleri Mavi Dalga dergisi editör ekibi tarafından{" "}
              <span className="font-semibold">01.04.2021</span> tarihinde kabul
              edilmiş olup Mavi Dalga bu ilkeleri değiştirme hakkını saklı
              tutar.
            </p>
          </section>
        </div>
      </motion.main>

      {/* Subtle page accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-10 -z-10 h-40 bg-gradient-to-b from-[#89b0bf]/40 via-transparent to-transparent"
      />
    </div>
  );
}
