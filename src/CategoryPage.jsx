import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from './firebase'; 
import { collection, query, where, getDocs } from 'firebase/firestore'; 

function CategoryPage() {
  const { categoryName } = useParams(); 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logoText, setLogoText] = useState('');

  // --- MODAL STATE-LƏRİ ---
  const [selectedProduct, setSelectedProduct] = useState(null); // Sifariş forması üçün
  const [zoomedImage, setZoomedImage] = useState(null);         // Böyük şəkil pəncərəsi üçün

  // --- FORM STATE-LƏRİ ---
  const [size, setSize] = useState('');
  const [material, setMaterial] = useState('Palıd taxtası');
  const [address, setAddress] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('workshop'); // 'workshop' (Emalatxana) və ya 'courier' (Kuryer)

  // 🔴 BİBİOĞLUNUN REAL WHATSAPP NÖMRƏSİ
  const whatsappNumber = "994XXXXXXXXX"; 

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'products'), where('category', '==', categoryName));
        const querySnapshot = await getDocs(q);
        const productsList = [];
        querySnapshot.forEach((doc) => {
          productsList.push({ id: doc.id, ...doc.data() });
        });
        setProducts(productsList);
      } catch (error) {
        console.error("Məhsul yükləmə xətası:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  fetch('http://localhost:5000/api/products')
      .then(response => response.json())
      .then(data => {
        console.log("MÖHTƏŞƏM! Backend-dən gələn məlumatlar:", data);
      })
      .catch(error => console.error("Backend-ə qoşula bilmədik:", error));}, [categoryName]);

  const uploadToImgBB = async (file) => {
    if (!file) return null;
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY; 
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    return data.success ? data.data.url : null;
  };
const handleFinalOrder = (e) => {
  if (e) e.preventDefault();

  const phoneNumber = "994707166863"; 

  // 1. Ünvanı müəyyən edirik
  const currentAddress = typeof address !== 'undefined' ? address : '';
  const currentDelivery = typeof deliveryMethod !== 'undefined' ? deliveryMethod : 'workshop';

  const finalAddress = currentDelivery === 'workshop' 
    ? '📍 Müştəri özü emalatxanadan götürəcək ' 
    : `📍 Kuryerlə çatdırılma: ${currentAddress || 'Ünvan yazılmayıb'}`;

  // 2. Xəritə linki (yalnız kuryer seçiləndə və ünvan varsa)
  const mapsLink = (currentDelivery === 'courier' && currentAddress) 
    ? `https://maps.google.com/?q=${encodeURIComponent(currentAddress)}` 
    : '';

  // 3. Təhlükəsiz Məhsul Adı, Ölçü, Material və Mətn tapılması
  const prodName = typeof title !== 'undefined' ? title : (typeof productName !== 'undefined' ? productName : '');
  const prodSize = typeof size !== 'undefined' ? size : (typeof selectedSize !== 'undefined' ? selectedSize : '');
  const prodMat = typeof material !== 'undefined' ? material : (typeof selectedMaterial !== 'undefined' ? selectedMaterial : '');
  const textVal = typeof customText !== 'undefined' ? customText : (typeof logoText !== 'undefined' ? logoText : '');

  // 4. WhatsApp mesaj mətni
  let message = `Salam! *Taxtadan.az* saytından sifariş etmək istəyirəm:\n\n`;
  if (prodName) message += `🔨 *Məhsul:* ${prodName}\n`;
  if (prodSize) message += `📐 *İstədiyiniz Ölçü:* ${prodSize}\n`;
  if (prodMat) message += `🌲 *İstifadə olunacaq material:* ${prodMat}\n`;
  
  message += `${finalAddress}\n`;

  if (mapsLink) {
    message += `🗺️ *Xəritədə konumu:* ${mapsLink}\n`;
  }

  message += `✍️ *Üzərində yazılacaq mətn:* ${textVal || 'Əlavə edilməyib'}\n\n`;
  message += `Zəhmət olmasa sifarişi qəbul edin.`;

  // 5. WhatsApp keçidi (Pop-up blokerə düşməmək üçün window.location.href)
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
  
  window.location.href = whatsappUrl;
};
  const categoryTitles = {
    reklam: 'Reklam Lövhələri və Banerlər',
    dekorlar: 'Ev və Ofis Dekorları',
    usaq: 'Uşaq Aləmi (Pinata və s.)'
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px', color: '#8B5A2B' }}>🔄 Yüklənir...</div>;
  }

  return (
    <div className="category-page" style={{ padding: '20px', minHeight: '80vh', backgroundColor: '#fdfbf7', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <Link to="/" style={{ textDecoration: 'none', color: '#8B5A2B', fontWeight: 'bold' }}>← Ana Səhifə</Link>
        
        <h2 style={{ textAlign: 'center', margin: '20px 0 40px 0', color: '#4A2E18', borderBottom: '2px solid #E6C280', paddingBottom: '10px' }}>
          {categoryTitles[categoryName] || 'Məhsullarımız'}
        </h2>

        {products.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#777' }}>Bu bölmədə hələ ki məhsul yoxdur.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
            {products.map((product) => (
              <div key={product.id} style={{ border: '1px solid #e2d7c5', borderRadius: '12px', padding: '15px', textAlign: 'center', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                
                {/* 🔍 Şəklə klik edəndə ARTIQ FORM YOX, ŞƏKİL ÖZÜ BÖYÜYƏCƏK */}
                <img 
                  src={product.image} 
                  alt={product.title} 
                  onClick={() => setZoomedImage(product.image)} 
                  style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: '8px', cursor: 'zoom-in' }} 
                  title="Böyütmək üçün klikləyin"
                />
                
                <h3 style={{ fontSize: '18px', margin: '15px 0 5px 0', color: '#3e2723' }}>{product.title}</h3>
                <p style={{ fontWeight: 'bold', color: '#b71c1c', fontSize: '17px', margin: '0 0 15px 0' }}>{product.price} AZN</p>
                
                {/* 💬 Formu açmaq missiyası tamamilə bu düymənindir */}
                <button 
                  onClick={() => setSelectedProduct(product)}
                  style={{ backgroundColor: '#25D366', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  💬 Oxşarını Sifariş Et
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= 1. ŞƏKİL BÖYÜTMƏ MODALI (LIGHTBOX) ================= */}
      {zoomedImage && (
        <div 
          onClick={() => setZoomedImage(null)} // Boşluğa klikləyəndə bağlansın
          style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, cursor: 'zoom-out' }}
        >
          {/* Bağlamaq düyməsi */}
          <button 
            onClick={() => setZoomedImage(null)} 
            style={{ position: 'absolute', top: '20px', right: '30px', background: 'none', border: 'none', color: '#fff', fontSize: '40px', cursor: 'pointer' }}
          >
            &times;
          </button>
          
          {/* Böyüdülmüş Şəkil */}
          <img 
            src={zoomedImage} 
            alt="Böyük görünüş" 
            style={{ maxWidth: '90%', maxHeight: '90vh', borderRadius: '8px', boxShadow: '0 5px 25px rgba(0,0,0,0.5)', objectFit: 'contain' }} 
            onClick={(e) => e.stopPropagation()} // Şəklin özünə klikləyəndə pəncərə bağlanmasın
          />
        </div>
      )}

      {/* ================= 2. TƏFƏRRÜATLAR MODALI (POP-UP FORM) ================= */}
      {selectedProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '10px' }}>
          <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '12px', maxWidth: '500px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, color: '#4A2E18' }}>Sifariş Təfərrüatları</h3>
              <button onClick={() => setSelectedProduct(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#999' }}>&times;</button>
            </div>

            <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
              Sifariş etmək istədiyiniz məhsul: <strong>{selectedProduct.title}</strong>
            </p>

            <form onSubmit={handleFinalOrder}>
              {/* Ölçü */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>📏 İstədiyiniz Ölçü:</label>
                <input type="text" placeholder="Məsələn: 40x60 sm və ya A4 ölçüsü" value={size} onChange={(e) => setSize(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>

              {/* Material */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '14px', display: 'block' }}>🌲 İstifadə olunacaq material:</label>
                <select value={material} onChange={(e) => setMaterial(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                  <option value="Palıd taxtası">Palıd taxtası (Premium Əl işləri üçün)</option>
                  <option value="Şam taxtası">Şam taxtası</option>
                  <option value="MDF / Kontrplak">MDF / Kontrplak (Lazer kəsim üçün)</option>
                  <option value="Pleksiglas (Akril)">Pleksiglas / Akril (İşıqlı reklamlar üçün)</option>
                  <option value="Fərq etməz / Bibioğlu məsləhət bilsin">Bibioğlu özü məsləhət bilsin 🤔</option>
                </select>
              </div>

             

              {/* Loqo Mətn Yükləmə */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>
                  ✍️ Üzərində yazılacaq mətn və ya ad (Varsa):
                </label>
                <input 
                  type="text" 
                  placeholder="Məsələn: 'Bibioğlu Kafe', 'Aylin' və s." 
                  value={logoText} 
                  onChange={(e) => setLogoText(e.target.value)} 
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
                />
              </div>

              {/* Loqo Fayl Yükləmə */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>✨ Loqonuz (Varsa əlavə edin):</label>
                <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files[0])} style={{ fontSize: '13px' }} />
              </div>

              {/* Şəkil Yükləmə */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>📸 Üzərində istifadə olunacaq xüsusi şəkil (Varsa):</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} style={{ fontSize: '13px' }} />
              </div>


{/* ---------------------------------------------------- */}
{/* 6. TƏHVİL ALMA FORMASI VƏ XƏRİTƏ / ÜNVAN BÖLMƏSİ      */}
{/* ---------------------------------------------------- */}
{/* 6. TƏHVİL ALMA FORMASI VƏ XƏRİTƏ / ÜNVAN BÖLMƏSİ */}
<div style={{ marginBottom: '15px' }}>
  <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
    🚚 Təhvil alma forması:
  </label>
  <select 
    value={deliveryMethod} 
    onChange={(e) => setDeliveryMethod(e.target.value)} 
    style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
  >
    <option value="workshop">Emalatxanadan özüm götürəcəm</option>
    <option value="courier">Kuryerlə çatdırılma (əlavə ödənişlə)</option>
  </select>

  {/* A) "Emalatxanadan götürəcəm" seçiləndə -> Sabit Emalatxana Xəritəsi */}
  {deliveryMethod === 'workshop' && (
    <div style={{ marginTop: '10px' }}>
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.7087186492104!2d49.957029975215995!3d40.41530315572746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4030631509165e1d%3A0x9e5fe80f6ac3fd78!2staxtadan!5e0!3m2!1sru!2saz!4v1784576622426!5m2!1sru!2saz" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"
        width="100%" 
        height="160" 
        style={{ border: 0, borderRadius: '8px' }} 
        allowFullScreen="" 
        loading="lazy"
      ></iframe>
      <p style={{ color: '#2e7d32', fontSize: '12px', marginTop: '5px', background: '#e8f5e9', padding: '8px', borderRadius: '5px' }}>
        * Ünvanımız: Sifariş hazır olanda yaxınlaşıb emalatxanadan götürə bilərsiniz.
      </p>
    </div>
  )}

  {/* B) "Kuryerlə çatdırılma" seçiləndə -> Ünvan qutusu + Canlı Xəritə */}
  {deliveryMethod === 'courier' && (
    <div style={{ marginTop: '10px' }}>
      <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>
        📍 Çatdırılma ünvanınızı yazın:
      </label>
      <input 
        type="text" 
        value={address} 
        onChange={(e) => setAddress(e.target.value)} 
        placeholder="Rayon, Küçə, Ev nömrəsi və s." 
        style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', marginBottom: '10px' }}
      />

      {/* Müştəri ünvan yazan kimi avtomatik xəritə çıxır */}
      {address.trim() !== '' && (
        <iframe 
          title="Çatdırılma Ünvanı"
          src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
          width="100%" 
          height="160" 
          style={{ border: 0, borderRadius: '8px' }} 
          allowFullScreen="" 
          loading="lazy"
        ></iframe>
      )}
    </div>
  )}
</div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                style={{ width: '100%', backgroundColor: '#25D366', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
              >
                {isSubmitting ? '⏳ Şəkillər yüklənir və sifariş hazırlanır...' : '✅ Məlumatları Təsdiqlə və WhatsApp-a Keç'}
              </button>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryPage;