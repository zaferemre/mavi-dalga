import React, { useState } from "react";
import emailjs from "emailjs-com";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";

export default function IletisimForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs
      .send(
        "service_rm8wtap", // Replace with your EmailJS service ID
        "template_8mhrz14", // Replace with your EmailJS template ID
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        "HDZQ8zui6yCC-Mifg" // Replace with your EmailJS public key
      )
      .then(
        () => {
          alert("Mesajınız başarıyla gönderildi!");
          setFormData({ name: "", email: "", message: "" });
        },
        (error) => {
          console.error("Mesaj gönderme hatası:", error);
          alert("Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
        }
      );
  };

  return (
    <section className="py-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 grid-cols-1">
          <div className="lg:mb-0 mb-10">
            <div className="group w-full h-full">
              <div className="relative h-full">
                <img
                  src="/Nicolas_Fouché_001.jpg"
                  alt="İletişim"
                  className="w-full h-full lg:rounded-l-2xl rounded-2xl bg-blend-multiply bg-indigo-700 object-cover"
                />
                <h1 className="font-manrope text-white text-4xl font-bold leading-10 absolute top-11 left-11">
                  Bize Yazın
                </h1>
                <div className="absolute bottom-0 w-full lg:p-11 p-5">
                  <div className="bg-white rounded-lg p-6 block">
                    <a
                      href="https://maps.app.goo.gl/sSjfgoqKuEPLpFuo6"
                      className="flex items-center mb-6 hover:text-[#fe5200]"
                    >
                      <FaMapMarkerAlt className="text-[#fe5200] mr-3" />
                      <h5 className="text-black hover:text-[#fe5200] text-base font-normal leading-6">
                        Fındıklı, Marmara Üniversitesi Tıp Fakültesi, Başıbüyük
                        Yolu No: 9 D:2, 34854 Maltepe/İstanbul
                      </h5>
                    </a>
                    <a
                      href="mailto:info@mavidalga.org"
                      className="flex items-center mb-6 hover:text-[#fe5200]"
                    >
                      <FaEnvelope className="text-[#fe5200] mr-3" />
                      <h5 className="text-black hover:text-[#fe5200] text-base font-normal leading-6">
                        info@mavidalga.org
                      </h5>
                    </a>
                    <a
                      href="https://instagram.com/mavidalgadergi"
                      className="flex items-center mb-6 hover:text-[#fe5200]"
                    >
                      <FaInstagram className="text-[#fe5200] mr-3" />
                      <h5 className="text-black hover:text-[#fe5200] text-base font-normal leading-6">
                        @mavidalgadergi
                      </h5>
                    </a>
                    <a
                      href="https://twitter.com/mavidalgadergi"
                      className="flex items-center mb-6 hover:text-[#fe5200]"
                    >
                      <FaTwitter className="text-[#fe5200] mr-3" />
                      <h5 className="text-black hover:text-[#fe5200] text-base font-normal leading-6">
                        @mavidalgadergi
                      </h5>
                    </a>
                    <a
                      href="https://www.linkedin.com/company/mavidalga"
                      className="flex items-center hover:text-[#fe5200]"
                    >
                      <FaLinkedin className="text-[#fe5200] mr-3" />
                      <h5 className="text-black hover:text-[#fe5200] text-base font-normal leading-6">
                        Mavi Dalga
                      </h5>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-5 lg:p-11 lg:rounded-r-2xl rounded-2xl">
            <h2 className="text-[#fe5200] font-manrope text-4xl font-semibold leading-10 mb-11">
              İletişime Geçin
            </h2>
            <form onSubmit={sendEmail}>
              <input
                type="text"
                name="name"
                className="w-full h-12 text-gray-600 placeholder-gray-400 shadow-sm bg-transparent text-lg font-normal leading-7 rounded-full border border-gray-200 focus:outline-none pl-4 mb-10"
                placeholder="İsim"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                className="w-full h-12 text-gray-600 placeholder-gray-400 shadow-sm bg-transparent text-lg font-normal leading-7 rounded-full border border-gray-200 focus:outline-none pl-4 mb-10"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <textarea
                name="message"
                className="w-full h-32 text-gray-600 placeholder-gray-400 shadow-sm bg-transparent text-lg font-normal leading-7 rounded-lg border border-gray-200 focus:outline-none pl-4 py-2 mb-10"
                placeholder="Mesajınız"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
              <button className="w-full h-12 text-white text-base font-semibold leading-6 rounded-full transition-all duration-700 hover:bg-[#fe5200] bg-[#fe5200] shadow-sm">
                Gönder
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
