// Шапка сайта: логотип и меню.
const NAV_LINKS = ["Услуги", "Галерея", "Команда", "Отзывы", "Контакты"];

function Header() {
  return (
    <header className="site-header">
      <a className="logo" href="#">LOGO</a>
      <nav className="site-nav" aria-label="Основное меню">
        <ul className="site-nav__list">
          {NAV_LINKS.map((link) => (
            <li key={link}>
              <a className="site-nav__link" href="#">{link}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
