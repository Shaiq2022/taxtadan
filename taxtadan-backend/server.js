// 1. Gərəkli alətləri (paketləri) çağırırıq
const express = require('express');
const cors = require('cors');

// 2. Serverimizi yaradırıq
const app = express();
const PORT = 5000;

// 3. Təhlükəsizlik və məlumat formatı parametrləri
app.use(cors()); // React ilə əlaqə qurmağa icazə verir
app.use(express.json()); // Gələn JSON siqnallarını oxuyur

// 4. Əsas Yoxlama Xətti (GET)
app.get('/', (req, res) => {
    res.send('Salam! Taxtadan.az serveri mükəmməl işləyir! 🚀');
});

// 5. Məhsulları Oxumaq üçün Xətt (GET)
app.get('/api/products', (req, res) => {
    res.json({ message: "Server aktivdir" });
});

// 6. ÇATIŞMAYAN HİSSƏ: Yeni Məhsul Qəbul Etmək üçün Xətt (POST)
app.post('/api/products', async (req, res) => {
    try {
        const productData = req.body;
        console.log('⚡ Yeni məhsul məlumatı gəldi:', productData);

        // React-ə uğurlu cavab qaytarırıq (STATUS 200)
        res.status(200).json({ 
            success: true, 
            message: 'Məhsul server tərəfindən uğurla qəbul edildi!' 
        });
    } catch (error) {
        console.error('Server xətası:', error);
        res.status(500).json({ error: 'Serverdə daxili xəta baş verdi!' });
    }
});

// 7. Serveri işə salırıq
app.listen(PORT, () => {
    console.log(`⚡ Server uğurla işə düşdü! Port: http://localhost:${PORT}`);
});