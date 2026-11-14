// Подвал сайта: контакты и режим работы.
function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__columns">
        <div className="site-footer__column">
          <a className="logo logo--footer" href="#">LOGO</a>
          <p className="site-footer__text">Дружелюбное описание услуг</p>
        </div>

        <div className="site-footer__column">
          <h2 className="site-footer__heading">Контакты</h2>
          <address className="site-footer__contacts">
            <p className="site-footer__contact">
              <svg className="site-footer__icon" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M13.33 6.67c0 3.33-5.33 7.33-5.33 7.33S2.67 10 2.67 6.67a5.33 5.33 0 1 1 10.66 0Z" />
                <circle cx="8" cy="6.67" r="2" />
              </svg>
              ул. Садовая, 15, Москва
            </p>
            <a className="site-footer__contact site-footer__phone" href="tel:+74951234567">
              <svg className="site-footer__icon" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M14.67 11.28v2a1.33 1.33 0 0 1-1.46 1.33 13.2 13.2 0 0 1-5.74-2.04 13 13 0 0 1-4-4A13.2 13.2 0 0 1 1.43 2.8 1.33 1.33 0 0 1 2.75 1.33h2A1.33 1.33 0 0 1 6.09 2.48c.08.64.24 1.27.46 1.87a1.33 1.33 0 0 1-.3 1.4l-.85.85a10.67 10.67 0 0 0 4 4l.85-.85a1.33 1.33 0 0 1 1.4-.3c.6.22 1.23.38 1.87.46a1.33 1.33 0 0 1 1.15 1.37Z" />
              </svg>
              +7 (495) 123-45-67
            </a>
          </address>
        </div>

        <div className="site-footer__column">
          <h2 className="site-footer__heading">Режим работы</h2>
          <ul className="site-footer__hours">
            <li className="site-footer__text-light">Пн–Пт: 9:00 – 21:00</li>
            <li className="site-footer__text-light">Сб–Вс: 10:00 – 19:00</li>
          </ul>
        </div>
      </div>

      <div className="site-footer__bottom">
        <p className="site-footer__copyright">© 2026. Все права защищены.</p>
        <a className="site-footer__policy" href="#">Политика конфиденциальности</a>
      </div>
    </footer>
  );
}

export default Footer;
