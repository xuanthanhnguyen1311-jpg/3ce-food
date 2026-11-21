// =========================================================================
// 1. CẤU HÌNH KẾT NỐI SUPABASE CHO 3CEFOODS.SHOP
// =========================================================================
const SUPABASE_URL = "https://rvptgvbmeszqhucfhatu.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_XvY--N5R_6jM4ceyW6sWFQ_acdDbGzp";

const supabaseClient = window.supabase
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

// =========================================================================
// 2. BẢNG GIÁ NIÊM YẾT 26 MÓN (DÙNG CHO BÁO CÁO DOANH THU Ở ADMIN.HTML)
// =========================================================================
const PRODUCT_PRICES = {
    "Mì trộn Indomie Long Môn Ngự Yến": 40000,
    "Mì trộn Indomie Tứ Hải Hội Tụ": 35000,
    "Mì trộn Indomie Thanh Vân Ngọc Thực": 20000,
    "Mì cay Đế vương bò Wagyu": 65000,
    "Mì cay thập cẩm Hải Sơn Thiên Địa": 80000,
    "Mì cay Busan Xúc Xích": 45000,
    "Mì cay bò Vương Giả Tứ Xuyên": 60000,
    "Mì Hắc Long Bá Vương": 45000,
    "Mì Ý Bò Bằm Hoàng Kim": 50000,
    "Cơm Rang Kim Ngưu Khai Vị": 45000,
    "Cơm Gà Kim Kê Ngự Yến": 50000,
    "Bibimbap Kim Ngọc Hoàng Triều": 55000,
    "Hồng Nhan Tuyết Lệ – Trà đào": 20000,
    "Thanh Long Xuất Hải – Trà chanh": 15000,
    "Bích Ngọc Tiên Trà – Trà tắc": 15000,
    "Hỏa Diệm Sơn – Trà dâu": 25000,
    "Tuyết Sơn Ngọc Ẩn – Trà sữa": 25000,
    "Khoai tây chiên Kim Giáp Hoàng Kim": 25000,
    "Khoai lắc phô mai Kim Ngọc Mãn Đường": 30000,
    "Nem chua Trần Công Châu Hồng Môn": 6000,
    "Phô mai que Bạch Ngọc Kim Tân": 8000,
    "Khoai môn Lệ Phố Tử Ngọc": 30000,
    "Ngô chiên Kim Châu Ngự Tiệc": 30000,
    "Cút lộn xào me Hỏa Long Châu": 50000,
    "Bánh tráng nướng Hỏa Phụng Hoàng Cung": 25000,
    "Viên chiên Ngự Lâm Thập Bát Vị": 10000
};

// =========================================================================
// 3. CÁC HÀM XỬ LÝ ĐƠN HÀNG QUA SUPABASE
// =========================================================================

// Lấy toàn bộ danh sách đơn hàng từ Supabase
async function getOrders() {
    if (!supabaseClient) return [];

    const { data, error } = await supabaseClient
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Lỗi tải danh sách đơn hàng:", error);
        return [];
    }

    return (data || []).map(row => {
        const d = row.created_at ? new Date(row.created_at) : new Date();
        const timeStr = d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
        const dateStr = d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });

        return {
            id: row.id,
            customerName: row.customer_name,
            phone: row.phone,
            address: row.address,
            items: row.items,
            total: Number(row.total || 0),
            paymentMethod: row.payment_method || "COD",
            status: row.status || "Chờ xác nhận",
            isNew: Boolean(row.is_new),
            createdAt: `${timeStr} (${dateStr})`
        };
    });
}

// Gửi đơn hàng mới từ index.html lên Supabase
async function addNewOrder(orderInput) {
    if (!supabaseClient) {
        throw new Error("Chưa nạp được thư viện Supabase.");
    }

    const newId = "3CE-" + Math.floor(100 + Math.random() * 900);
    const newRow = {
        id: newId,
        customer_name: orderInput.customerName,
        phone: orderInput.phone,
        address: orderInput.address,
        items: orderInput.items,
        total: Number(orderInput.total),
        payment_method: orderInput.paymentMethod,
        status: "Chờ xác nhận",
        is_new: true
    };

    // Ghi trực tiếp vào bảng orders (không dùng .select().single() để tránh lỗi phân quyền RLS)
    const { error } = await supabaseClient
        .from("orders")
        .insert([newRow]);

    if (error) {
        console.error("Chi tiết lỗi Supabase:", error);
        alert("⚠️ Lỗi từ Supabase: " + error.message);
        throw error;
    }

    return { ...orderInput, id: newId };
}

// Cập nhật trạng thái đơn hàng từ admin.html
async function updateOrderStatus(orderId, newStatus) {
    if (!supabaseClient) return;

    const { error } = await supabaseClient
        .from("orders")
        .update({ status: newStatus, is_new: false })
        .eq("id", orderId);

    if (error) {
        console.error("Lỗi cập nhật trạng thái:", error);
        throw error;
    }
}

// =========================================================================
// 4. QUẢN LÝ TỒN KHO NGUYÊN VẬT LIỆU (CHO TAB KHO Ở ADMIN.HTML)
// =========================================================================
const INVENTORY_KEY = "3ce_foods_inventory";
const DEFAULT_INVENTORY = [
    { sku: "NVL-01", name: "Mì Indomie & Mì Koreno (Gói)", unit: "Gói", stock: 145, minStock: 50 },
    { sku: "NVL-02", name: "Thịt bò Wagyu & Ba chỉ bò Mỹ", unit: "Kg", stock: 12, minStock: 10 },
    { sku: "NVL-03", name: "Đào ngâm hộp lớn & Trà đen đặc biệt", unit: "Hộp", stock: 6, minStock: 10 },
    { sku: "NVL-04", name: "Khoai tây cọng đông lạnh & Phô mai que", unit: "Túi", stock: 28, minStock: 15 },
    { sku: "NVL-05", name: "Trứng cút lộn & Sốt me đặc chế", unit: "Phần", stock: 8, minStock: 12 },
    { sku: "NVL-06", name: "Gà góc tư & Gạo thơm dẻo", unit: "Phần", stock: 42, minStock: 20 },
    { sku: "BB-01", name: "Hộp giấy Kraft & Ly nhựa nắp cầu 500ml", unit: "Bộ", stock: 320, minStock: 100 }
];

function getInventory() {
    const raw = localStorage.getItem(INVENTORY_KEY);
    if (!raw) {
        localStorage.setItem(INVENTORY_KEY, JSON.stringify(DEFAULT_INVENTORY));
        return DEFAULT_INVENTORY;
    }
    try {
        return JSON.parse(raw);
    } catch (e) {
        return DEFAULT_INVENTORY;
    }
}

function adjustStock(sku, delta) {
    const inv = getInventory().map(item => {
        if (item.sku === sku) {
            return { ...item, stock: Math.max(0, item.stock + delta) };
        }
        return item;
    });
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(inv));
    return inv;
}
