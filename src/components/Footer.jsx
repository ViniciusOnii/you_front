const Footer = () => {
  return (
    <footer className="bg-youvisa-dark text-white" role="contentinfo" aria-label="Rodapé do site">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Coluna 1: Logo e Informações */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-youvisa-green rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-2xl font-bold">YOUVISA</span>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              A primeira startup brasileira focada em vistos.
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Aplique de forma fácil, online e segura.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <p>CNPJ: 00.000.000/0001-00</p>
              <p>Tel: <a href="tel:+551100000000" className="hover:text-youvisa-green transition-colors">(11) 0000-0000</a></p>
              <p><a href="mailto:contato@youvisa.com.br" className="hover:text-youvisa-green transition-colors">contato@youvisa.com.br</a></p>
            </div>
          </div>

          {/* Coluna 2: Entre em contato */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Entre em contato</h3>
            <nav aria-label="Links de contato">
              <ul className="space-y-3">
                <li>
                  <a
                    href="#contato"
                    className="text-gray-300 hover:text-youvisa-green transition-colors duration-200 flex items-center group"
                    aria-label="Ir para formulário de contato"
                  >
                    <span className="mr-2 group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true">
                      →
                    </span>
                    Fale Conosco
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/5511000000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-youvisa-green transition-colors duration-200 flex items-center group"
                    aria-label="Abrir WhatsApp (abre em nova aba)"
                  >
                    <span className="mr-2 group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true">
                      →
                    </span>
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    href="#vagas"
                    className="text-gray-300 hover:text-youvisa-green transition-colors duration-200 flex items-center group"
                    aria-label="Ver vagas disponíveis"
                  >
                    <span className="mr-2 group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true">
                      →
                    </span>
                    Trabalhe Conosco
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Coluna 3: Nos siga */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Nos siga</h3>
            <nav aria-label="Redes sociais">
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://instagram.com/youvisa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-youvisa-green transition-colors duration-200 flex items-center group"
                    aria-label="Siga-nos no Instagram (abre em nova aba)"
                  >
                    <svg
                      className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com/company/youvisa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-youvisa-green transition-colors duration-200 flex items-center group"
                    aria-label="Siga-nos no LinkedIn (abre em nova aba)"
                  >
                    <svg
                      className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="https://tiktok.com/@youvisa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-youvisa-green transition-colors duration-200 flex items-center group"
                    aria-label="Siga-nos no TikTok (abre em nova aba)"
                  >
                    <svg
                      className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                    </svg>
                    TikTok
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Coluna 4: Certificados */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Certificados</h3>
            <nav aria-label="Certificações e parcerias">
              <ul className="space-y-3">
                <li>
                  <a
                    href="#cadastur"
                    className="text-gray-300 hover:text-youvisa-green transition-colors duration-200 flex items-center group"
                    aria-label="Ver certificação Cadastur"
                  >
                    <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center mr-3 group-hover:bg-youvisa-green transition-colors duration-200" aria-hidden="true">
                      <span className="text-xs font-bold">C</span>
                    </div>
                    Cadastur
                  </a>
                </li>
                <li>
                  <a
                    href="#abv"
                    className="text-gray-300 hover:text-youvisa-green transition-colors duration-200 flex items-center group"
                    aria-label="Ver certificação ABV"
                  >
                    <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center mr-3 group-hover:bg-youvisa-green transition-colors duration-200" aria-hidden="true">
                      <span className="text-xs font-bold">A</span>
                    </div>
                    ABV
                  </a>
                </li>
                <li>
                  <a
                    href="#aussie"
                    className="text-gray-300 hover:text-youvisa-green transition-colors duration-200 flex items-center group"
                    aria-label="Ver certificação Aussie"
                  >
                    <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center mr-3 group-hover:bg-youvisa-green transition-colors duration-200" aria-hidden="true">
                      <span className="text-xs font-bold">A</span>
                    </div>
                    Aussie
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Rodapé inferior */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © 2025 YOUVISA. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 text-sm">
              <a
                href="#termos"
                className="text-gray-400 hover:text-youvisa-green transition-colors duration-200"
                aria-label="Ler termos e condições"
              >
                Termos e Condições
              </a>
              <span className="text-gray-600" aria-hidden="true">|</span>
              <a
                href="#privacidade"
                className="text-gray-400 hover:text-youvisa-green transition-colors duration-200"
                aria-label="Ler política de privacidade e cookies"
              >
                Política de Privacidade e Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
