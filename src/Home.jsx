import './App.css';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Link import edildi

function Home() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderMessage, setOrderMessage] = useState('');
  
  // Fərdi seçim paneli üçün state-lər
  const [productSize, setProductSize] = useState('A5 (Standart)');
  const [materialType, setMaterialType] = useState('Tam Təbii Taxta');
  const [customText, setCustomText] = useState('');

  const handleOrderClick = (title) => {
    let message = `Salam! *Taxtadan.az* saytından sifariş etmək istəyirəm:\n\n`;
    message += `🔨 *Məhsul:* ${title}\n`;
    message += `📐 *İstədiyiniz Ölçü:* ${productSize}\n`;
    message += `🌲 *İstifadə olunacaq material:* ${materialType}\n`;
    message += `✍️ *Üzərində yazılacaq mətn:* ${customText}\n\n`;
    message += `Zəhmət olmasa sifarişi qəbul edin.`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=994707166863&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    setSelectedProduct(null); 
    setProductSize('A5 (Standart)');
    setMaterialType('Tam Təbii Taxta');
    setCustomText('');

    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      {/* 1. Naviqasiya Menyusu */}
      {/* 1. Naviqasiya Menyusu */}
<nav className="navbar">
  {/* Sol Hissə: Loqo və onun dərhal sağında Hamburger düyməsi */}
  <div className="nav-left">
    <div className="logo">
      <img src="/woodpecker.jpg" alt="Logo" style={{ height: '45px', width: 'auto' }} />
    </div>

    {/* Mobil üçün Hamburger Düyməsi (☰ / ✕) */}
    <button 
      className="hamburger-btn" 
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
    >
      {isMobileMenuOpen ? '✕' : '☰'}
    </button>
  </div>

  {/* Menyu Linkləri */}
  <ul className={`nav-links ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
    <li><a href="#home" onClick={() => setIsMobileMenuOpen(false)}>Ana Səhifə</a></li>
    <li><a href="#about" onClick={() => setIsMobileMenuOpen(false)}>Biz Kimik?</a></li>
    <li><a href="#products" onClick={() => setIsMobileMenuOpen(false)}>Məhsullar</a></li>
    <li><a href="#contact" onClick={() => setIsMobileMenuOpen(false)}>Əlaqə</a></li>
  </ul>

  {/* Sağ Hissə: Sifariş Et düyməsi */}
  <button className="order-btn" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
    Sifariş Et
  </button>
</nav>

      {/* 2. Giriş (Hero) Hissəsi */}
      <header className="hero-section" id="home">
        <h2 className="hero-title">Eksklüziv Lazer Kəsim Suvenirlər</h2>
        <p className="hero-subtitle">
          Bibioğlunun emalatxanasından tamamilə təbii taxtadan hazırlanmış, fərdi dizaynlı hədiyyələr.
        </p>
      </header>

      {/* 3. Canlı Video Bölməsi */}
      <section className="video-section" id ="about">
        <video className="bg-video" src="/woodpeckerai.mp4" autoPlay loop muted playsInline />
        <div className="video-overlay">
          <div className="video-section-content">
            <h2>Təbiətin Ruhunu Dizayna Çeviririk</h2>
            <p>
              Biz sadəcə taxtanı kəsmirik, ona can veririk. Hər bir detal üzərində 
              incəliklə işləyir, hədiyyənizin sizin qədər orijinal olması üçün çalışırıq.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Məhsullar Kataloqu */}
      <section className="products-section" id="products">
        <h3 className="section-title">Nələr Hazırlayırıq?</h3>
        <div className="products-grid">
          {/* KART 1 */}
          <div className="product-card" onClick={() => navigate('/category/usaq')}>
            <img src="/Tlogo6.jpg" alt="Uşaq dünyası" />
            <h4>Uşaq dünyası</h4>
            <p>Uşaqlar üçün dizayn edilmiş məktəb ləvazimatları, geyim aksesuarları və oyuncaqlar</p>
          </div>

          {/* KART 2 */}
          <div className="product-card" onClick={() => navigate('/category/reklam')}>
            <img src="/mockup-sign.jpg" alt="Reklam lövhələri" />
            <h4>Reklam lövhələri və banerlər</h4>
            <p>Şirkətlər və ofislər üçün premium divar loqoları, reklam lövhələri və fərdi banerlər.</p>
          </div>

          {/* KART 3 */}
          <div className="product-card" onClick={() => navigate('/category/dekorlar')}>
            <img src="/taxtadan logo 5 .jpg" alt="Ev və ofis dekorları" />
            <h4>Ev və ofis dekorları</h4>
            <p>Eviniz və ofisiniz üçün fərdi dizaynda hazırlanan suvenirlər, saatlar və xüsusi hədiyyələr.</p>
          </div>
        </div>
      </section>

      {/* POP-UP MODAL PƏNCƏRƏSİ */}
      {selectedProduct && (
        <div className="modal-backdrop" onClick={() => setSelectedProduct(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setSelectedProduct(null)}>&times;</button>
            <img src={selectedProduct.image} alt={selectedProduct.title} className="modal-img" />
            <div className="modal-info">
              <h3>{selectedProduct.title}</h3>
              <p className="modal-desc">{selectedProduct.desc}</p>
              
              <div className="modal-customization">
                <div className="custom-group">
                  <label>Ölçü seçin:</label>
                  <select value={productSize} onChange={(e) => setProductSize(e.target.value)}>
                    <option value="A5 (Standart)">A5 Ölçüsü (Standart)</option>
                    <option value="A4 (Böyük)">A4 Ölçüsü (Böyük)</option>
                    <option value="Mini (Cib ölçüsü)">Mini Ölçü</option>
                  </select>
                </div>

                <div className="custom-group">
                  <label>Material növü:</label>
                  <select value={materialType} onChange={(e) => setMaterialType(e.target.value)}>
                    <option value="Tam Təbii Taxta">Tam Təbii Taxta</option>
                    <option value="Dəri Detallı Taxta">Dəri Detallı Taxta</option>
                    <option value="Tündləşdirilmiş Palıd">Tündləşdirilmiş Palıd</option>
                  </select>
                </div>

                <div className="custom-group">
                  <label>Üzərində nə yazılsın? (Ad, Loqo və ya Söz):</label>
                  <input 
                    type="text" 
                    placeholder="Məs: Elvin / Şirkət Loqosu" 
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                  />
                </div>
              </div>

              <button className="modal-order-btn" onClick={() => handleOrderClick(selectedProduct.title)}>
                Seçimlərlə Sifariş Et
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Əlaqə və Sonluq (Footer) Bölməsi */}
      <footer className="footer-section" id="contact">
        <video className="bg-video" src="/woodpeckerai.mp4" autoPlay loop muted playsInline />
        <div className="footer-overlay">
          <div className="footer-container">
            <div className="footer-info">
              <h4>Taxtadan Emalatxanası</h4>
              <p style={{ fontStyle: 'italic', color: '#f39c12' }}>Hədiyyəniz qədər orijinalsınız.</p>
              <p>📍 Bakı şəhəri, Nizami rayonu</p>
              <p>📞 +994 (70) 7166863</p>
              <p>✉️ info@taxtadan.az</p>
            </div>
            <div className="footer-form">
              <h4>Bizə Sifarişinizi Yazın</h4>
              <form onSubmit={(e) => e.preventDefault()}>
                <input type="text" placeholder="Adınız" required />
                <input type="email" placeholder="E-poçt ünvanınız" required />
                <textarea 
                  placeholder="İstədiyiniz məhsul və dizayn təfərrüatları..." 
                  rows="4" 
                  value={orderMessage}                      
                  onChange={(e) => setOrderMessage(e.target.value)}  
                  required
                ></textarea>
                <button type="submit" className="send-btn" onClick={() => {
                  const whatsappUrl = `https://wa.me/994707166863?text=${encodeURIComponent(orderMessage)}`;
                  window.open(whatsappUrl, '_blank');
                }}>Mesajı Göndər</button>
              </form>
            </div>
          </div>
        </div>
      </footer>

      {/* FOOTER BOTTOM VƏ GİZLİ ADMİN DÜYMƏSİ */}
      <div className="footer-bottom" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', flexWrap: 'wrap', padding: '15px' }}>
        <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} Taxtadan. Bütün hüquqlar qorunur.</p>
        <Link to="/admin" style={{ opacity: 0.3, textDecoration: 'none', color: 'inherit', fontSize: '12px' }}>
          🔒 Admin
        </Link>
      </div>
    </div>
  );
}

export default Home;