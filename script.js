/* script.js - Final Version */

// ==========================================
// 1. إعدادات الاتصال بـ Supabase
// ==========================================

// رابط المشروع الخاص بك (الذي أرسلته للتو)
const SUPABASE_URL = 'https://zflgifemhopabfzgczgs.supabase.co'; 

// المفتاح العام (Publishable Key)
const SUPABASE_KEY = 'sb_publishable_9xZcd3BkgL6cEQwHJitrew_mbX74lJW'; 

// إنشاء الاتصال
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ==========================================
// 2. وظيفة رفع الصور (إلى Storage)
// ==========================================
async function uploadImage(file) {
    // ننشئ اسماً فريداً للصورة باستخدام التوقيت الحالي
    // ونستبدل المسافات في اسم الملف بشرطة سفلية لتجنب الأخطاء
    const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
    
    // الرفع إلى المجلد المسمى 'proofs'
    const { data, error } = await supabase.storage
        .from('proofs') 
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) {
        console.error('Upload Error:', error);
        throw error;
    }

    // جلب الرابط العام للصورة لكي تظهر للأدمن
    const { data: publicUrlData } = supabase.storage
        .from('proofs')
        .getPublicUrl(fileName);
        
    return publicUrlData.publicUrl;
}

// ==========================================
// 3. وظيفة زر "إنشاء الكود" (Create Code)
// ==========================================
async function submitRequest() {
    const userData = document.getElementById('userData').value;
    const regProofFile = document.getElementById('regProof').files[0];
    const depProofFile = document.getElementById('depProof').files[0];
    const btn = document.getElementById('submitBtn');

    // التحقق من أن المستخدم أدخل كل شيء
    if (!userData || !regProofFile || !depProofFile) {
        alert("يرجى كتابة البيانات ورفع صورتي الإثبات");
        return;
    }

    btn.innerText = "جاري الرفع والمعالجة...";
    btn.disabled = true;

    try {
        // 1. رفع الصور والحصول على الروابط
        const regUrl = await uploadImage(regProofFile);
        const depUrl = await uploadImage(depProofFile);

        // 2. توليد كود عشوائي (مثلاً: CODE-583920)
        const generatedCode = 'CODE-' + Math.floor(100000 + Math.random() * 900000);

        // 3. إرسال البيانات إلى جدول requests
        const { error: insertError } = await supabase
            .from('requests')
            .insert([
                { 
                    user_data: userData, 
                    reg_proof_url: regUrl, 
                    dep_proof_url: depUrl,
                    generated_code: generatedCode
                }
            ]);

        if (insertError) throw insertError;

        // 4. تفعيل الكود بإضافته لجدول active_codes
        const { error: codeError } = await supabase
            .from('active_codes')
            .insert([{ code: generatedCode }]);
            
        if (codeError) throw codeError;

        // 5. إظهار النتيجة للمستخدم
        document.getElementById('codeDisplay').classList.remove('hidden');
        document.getElementById('generatedCode').innerText = generatedCode;
        btn.style.display = 'none';

    } catch (error) {
        console.error('Main Error:', error);
        alert("حدث خطأ! \nالتفاصيل: " + error.message);
        btn.innerText = "إنشاء الكود";
        btn.disabled = false;
    }
}

// ==========================================
// 4. وظيفة تسجيل الدخول (Login)
// ==========================================
async function login() {
    const codeInput = document.getElementById('accessCode').value.trim();
    if (!codeInput) return;

    // البحث عن الكود في جدول active_codes
    const { data, error } = await supabase
        .from('active_codes')
        .select('*')
        .eq('code', codeInput);

    if (error) {
        console.error(error);
        alert("حدث خطأ في الاتصال");
    } else if (data && data.length > 0) {
        // الكود صحيح
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'app.html';
    } else {
        alert("الكود غير صحيح أو غير مفعل");
    }
}

// ==========================================
// 5. وظائف صفحة الأدمن (Admin Panel)
// ==========================================
function adminAuth() {
    const email = document.getElementById('adminEmail').value;
    const pass = document.getElementById('adminPass').value;

    // التحقق من الأدمن
    if (email === "mazen@admin.com" && pass === "mazen250999") {
        document.getElementById('adminLogin').classList.add('hidden');
        document.getElementById('adminPanel').classList.remove('hidden');
        loadRequests();
    } else {
        alert("بيانات الدخول خاطئة");
    }
}

async function loadRequests() {
    const list = document.getElementById('requestsList');
    list.innerHTML = 'جاري تحميل الطلبات...';

    // جلب الطلبات من جدول requests مرتبة من الأحدث للأقدم
    const { data, error } = await supabase
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error(error);
        list.innerHTML = '<p style="color:red">فشل تحميل البيانات. تأكد من إلغاء RLS في Supabase</p>';
        return;
    }

    list.innerHTML = '';
    
    if (!data || data.length === 0) {
        list.innerHTML = '<p>لا توجد طلبات جديدة</p>';
        return;
    }

    // عرض كل طلب
    data.forEach(req => {
        const item = document.createElement('div');
        item.className = 'request-item';
        
        // تنسيق التاريخ
        const date = new Date(req.created_at).toLocaleString('ar-EG');

        item.innerHTML = `
            <p><strong>وقت الطلب:</strong> ${date}</p>
            <p><strong>بيانات المستخدم:</strong> <br>${req.user_data}</p>
            <p><strong>الكود الممنوح:</strong> <span style="color:#4caf50; font-weight:bold; font-size:1.2em">${req.generated_code}</span></p>
            <div style="margin-top:10px;">
                <p>الأدلة (اضغط للتكبير):</p>
                <a href="${req.reg_proof_url}" target="_blank" style="margin-left:10px;">
                    <img src="${req.reg_proof_url}" width="100" height="100" style="object-fit:cover; border:1px solid #555; border-radius:5px;">
                </a>
                <a href="${req.dep_proof_url}" target="_blank">
                    <img src="${req.dep_proof_url}" width="100" height="100" style="object-fit:cover; border:1px solid #555; border-radius:5px;">
                </a>
            </div>
            <hr style="border-color:#333; margin-top:15px;">
        `;
        list.appendChild(item);
    });
}
