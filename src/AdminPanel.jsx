import React, { useState, useEffect } from 'react';
import { db } from './firebase'; 
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import imageCompression from 'browser-image-compression'; 
// 1. ÖZ IMGBB API AÇARINI BURAYA YAZ
const IMGBB_API_KEY = "642e7a19a227356872990def90acf2d2";
// 2. ADMİN PANELƏ GİRİŞ ŞİFRƏSİNİ BURADA TƏYİN ET
const ADMIN_PASSWORD = 'taxtadan2026'; // İstədiyin şifrə ilə dəyişə bilərsən

function AdminPanel() {
  // Giriş təhlükəsizliyi üçün state-lər
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Məhsul state-ləri
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('reklam');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('reklam');
  const [editPrice, setEditPrice] = useState('');

  // Səhifə açılanda brauzerin yaddaşında öncədən giriş olunub-olunmadığını yoxlayırıq
  useEffect(() => {
    const savedAuth = localStorage.getItem('isAdminAuthenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      fetchProducts();
    }
  }, []);

  // Giriş funksiyası
  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('isAdminAuthenticated', 'true');
      setLoginError('');
      fetchProducts();
    } else {
      setLoginError('Daxil edilən şifrə yanlışdır!');
    }
  };

  // Çıxış funksiyası (Logout)
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAdminAuthenticated');
  };

  // Firestore-dan məhsulları çəkmək
  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const list = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setProducts(list);
    } catch (error) {
      console.error("Məhsulları gətirərkən xəta:", error);
    }
  };

 // 1. Yeni Məhsul Əlavə Etmə (ImgBB + Firebase)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!image) {
      alert("Zəhmət olmasa bir şəkil seçin!");
      return;
    }

    setLoading(true);

    try {
      // ADIM A.1: Şəkli brauzerdə sıxırıq
      const options = {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
        fileType: "image/webp"
      };

      const compressedFile = await imageCompression(image, options);

      // ADIM A.2: Sıxılmış şəkli ImgBB-yə yükləyirik
      const formData = new FormData();
      formData.append('image', compressedFile);

      const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      const imgbbData = await imgbbResponse.json();

      if (!imgbbData.success) {
        throw new Error("ImgBB-yə şəkil yüklənərkən xəta baş verdi.");
      }

      const imageUrl = imgbbData.data.display_url;

      // 🌟 ADIM A.3: MƏHSULUN MƏLUMATLARINI FIREBASE FIRESTORE-A YAZIRIQ
      await addDoc(collection(db, 'products'), {
        title: title,
        category: category,
        price: Number(price),
        image: imageUrl,
        createdAt: new Date()
      });

      alert("Məhsul uğurla əlavə olundu!");

      // Formanı sıfırlayırıq
      setTitle('');
      setPrice('');
      setImage(null);
      document.getElementById('imageInput').value = '';

      // Siyahını yeniləyirik
      fetchProducts();

    } catch (error) {
      console.error('Xəta baş verdi:', error);
      alert('Məhsul yerləşdirilə bilmədi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  // 2. Məhsulun Silinməsi
  const handleDelete = async (id) => {
    if (window.confirm("Bu məhsulu silməyə əminsiniz?")) {
      try {
        await deleteDoc(doc(db, 'products', id));
        fetchProducts(); 
      } catch (error) {
        console.error("Silmə xətası:", error);
        alert('Xəta baş verdi, silmək mümkün olmadı.');
      }
    }
  };

  // 3. Redaktə rejiminə keçid
  const startEdit = (product) => {
    setEditingId(product.id);
    setEditTitle(product.title || product.name || '');
    setEditCategory(product.category || 'reklam');
    setEditPrice(product.price || '');
  };

  // 4. Düzəlişlərin Yadda Saxlanılması
  const handleUpdate = async (id) => {
    try {
      await updateDoc(doc(db, 'products', id), {
        title: editTitle,
        category: editCategory,
        price: Number(editPrice)
      });
      setEditingId(null);
      fetchProducts(); 
    } catch (error) {
      console.error("Yeniləmə xətası:", error);
      alert('Dəyişiklikləri yadda saxlamaq mümkün olmadı.');
    }
  };

  // ---------------------------------------------------------------------
  // A) ƏGƏR İSTİFADƏÇİ GİRİŞ ETMƏYİBSƏ -> ŞİFRƏ TƏLƏB EDƏN PƏNCƏRƏ
  // ---------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', fontFamily: 'sans-serif', padding: '20px' }}>
        <form onSubmit={handleLogin} style={{ background: '#fff', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', width: '100%', maxWidth: '380px', border: '1px solid #eee' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Admin Panelə Giriş</h2>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#555' }}>Admin Şifrəsi:</label>
            <input 
              type="password" 
              value={passwordInput} 
              onChange={(e) => setPasswordInput(e.target.value)} 
              placeholder="Şifrəni daxil edin" 
              required 
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>

          {loginError && <p style={{ color: '#dc3545', fontSize: '13px', marginTop: '0', marginBottom: '15px' }}>{loginError}</p>}

          <button type="submit" style={{ width: '100%', padding: '10px', background: '#0d6efd', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
            Daxil Ol
          </button>
        </form>
      </div>
    );
  }

  // ---------------------------------------------------------------------
  // B) ƏGƏR İSTİFADƏÇİ GİRİŞ EDİBSƏ -> İDARƏETMƏ PANELİ
  // ---------------------------------------------------------------------
  return (
    <div className="admin-panel" style={{ padding: '20px', maxWidth: '800px', margin: 'auto', fontFamily: 'sans-serif' }}>
      
      {/* Üst Başlıq və Çıxış Düyməsi */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>İdarəetmə Paneli</h2>
        <button onClick={handleLogout} style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          Çıxış Et 🔒
        </button>
      </div>
      
      {/* 1. MƏHSUL ƏLAVƏ ETME FORMU */}
      <form onSubmit={handleSubmit} style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '40px', border: '1px solid #eee' }}>
        <h3>Yeni Məhsul Əlavə Et</h3>
        <div style={{ marginBottom: '10px' }}>
          <label>Məhsulun Adı:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Məs: Işıqlı Foto Reklam" disabled={loading} style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Bölmə seçin:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} disabled={loading} style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}>
            <option value="reklam">Reklam Lövhələri və Banerlər</option>
            <option value="dekorlar">Ev və Ofis Dekorları</option>
            <option value="usaq">Uşaq Aləmi (Pinata və s.)</option>
          </select>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Qiymət (AZN):</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="Məs: 45" disabled={loading} style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Məhsulun Şəkli:</label>
          <input id="imageInput" type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required disabled={loading} style={{ display: 'block', marginTop: '5px' }} />
        </div>
        <button type="submit" disabled={loading} style={{ background: '#28a745', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          {loading ? 'Şəkil Yüklənir...' : 'Məhsulu Sayta Yerləşdir'}
        </button>
      </form>

      <hr style={{ border: '0', borderTop: '2px solid #eee', margin: '40px 0' }} />

      {/* 2. MƏHSULLARI İDARƏETMƏ SİYAHISI */}
      <div>
        <h3>Mövcud Məhsulları İdarə Et</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {products.map((prod) => (
            <div key={prod.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #ddd', padding: '10px', borderRadius: '8px', background: '#fff' }}>
              
              <img src={prod.image} alt={prod.title || prod.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px', background: '#f0f0f0' }} />
              
              {editingId === prod.id ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} style={{ padding: '6px', width: '90%' }} />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)} style={{ padding: '6px' }}>
                      <option value="reklam">Reklam</option>
                      <option value="dekorlar">Dekorlar</option>
                      <option value="usaq">Uşaq Aləmi</option>
                    </select>
                    <input type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} style={{ padding: '6px', width: '80px' }} />
                  </div>
                </div>
              ) : (
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{prod.title || prod.name}</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
                    Bölmə: <span style={{ fontWeight: 'bold' }}>{prod.category}</span> | Qiymət: <span style={{ fontWeight: 'bold', color: '#28a745' }}>{prod.price} AZN</span>
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px' }}>
                {editingId === prod.id ? (
                  <>
                    <button onClick={() => handleUpdate(prod.id)} style={{ background: '#28a745', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Yadda Saxla</button>
                    <button onClick={() => setEditingId(null)} style={{ background: '#6c757d', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Ləğv Et</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(prod)} style={{ background: '#ffc107', color: '#111', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Düzəliş Et</button>
                    <button onClick={() => handleDelete(prod.id)} style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Sil</button>
                  </>
                )}
              </div>

            </div>
          ))}

          {products.length === 0 && <p style={{ color: '#888', textAlign: 'center' }}>Hələ ki heç bir məhsul əlavə olunmayıb.</p>}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;