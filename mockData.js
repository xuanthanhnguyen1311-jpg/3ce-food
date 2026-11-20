// =========================================================================
// 1. KHÓA LƯU TRỮ DÙNG CHUNG TRÊN TRÌNH DUYỆT (LOCALSTORAGE)
// =========================================================================
const STORAGE_KEY = "3ce_foods_orders";
const INVENTORY_KEY = "3ce_foods_inventory";

// =========================================================================
// 2. BẢNG GIÁ NIÊM YẾT 26 MÓN (DÙNG CHO BÁO CÁO DOANH THU SẢN PHẨM Ở ADMIN)
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
// 3. DỮ LIỆU ĐƠN HÀNG MẪU & CÁC HÀM ĐỒNG BỘ GIỮA INDEX.HTML VÀ ADMIN.HTML
// =========================================================================
const DEFAULT_ORDERS = [
    {
        id: "3CE-108",
        customerName: "Nguyễn Minh Anh",
        phone: "0987654321",
        address: "KTX B5 Học viện Tài chính, Đông Ngạc",
        items: "1x Mì cay Đế vương bò Wagyu, 2x Hồng Nhan Tuyết Lệ – Trà đào",
        total: 105000,
        paymentMethod: "VietQR",
        status: "Chờ xác nhận",
        createdAt: "Hôm nay, 19:45",
        isNew: false
    },
    {
        id: "3CE-107",
        customerName: "Trần Đức Huy",
        phone: "0912345678",
        address: "Ngõ 58 Lê Văn Hiến, Bắc Từ Liêm",
        items: "2x Mì trộn Indomie Long Môn Ngự Yến, 1x Khoai lắc phô mai Kim Ngọc Mãn Đường",
        total: 110000,
        paymentMethod: "COD",
        status: "Đang chế biến",
        createdAt: "Hôm nay, 19:20",
        isNew: false
    },
    {
        id: "3CE-106",
        customerName: "Lê Thu Hà",
        phone: "0965432198",
        address: "Chung cư Ecohome 2, Đông Ngạc",
        items: "1x Cơm Gà Kim Kê Ngự Yến, 1x Tuyết Sơn Ngọc Ẩn – Trà sữa",
        total: 75000,
        paymentMethod: "VietQR",
        status: "Đang giao",
        createdAt: "Hôm nay, 18:50",
        isNew: false
    },
    {
        id: "3CE-105",
        customerName: "Phạm Hoàng Nam",
        phone: "0934567890",
        address: "Cổng sau ĐH Mỏ - Địa chất",
        items: "1x Cút lộn xào me Hỏa Long Châu, 2x Thanh Long Xuất Hải – Trà chanh",
        total: 80000,
        paymentMethod: "COD",
        status: "Hoàn thành",
        createdAt: "Hôm nay, 18:15",
        isNew: false
    }
];

// Lấy danh sách đơn hàng hiện tại từ localStorage
function getOrders() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ORDERS));
        return DEFAULT_ORDERS;
    }
    return JSON.parse(saved);
}

// Đẩy đơn hàng mới từ index.html vào localStorage để admin.html tự nhận
function addNewOrder(orderInput) {
    const orders = getOrders();
    const now = new Date();
    const timeStr = now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

    const newOrder = {
        id: "3CE-" + Math.floor(109 + Math.random() * 890),
        customerName: orderInput.customerName,
        phone: orderInput.phone,
        address: orderInput.address,
        items: orderInput.items,
        total: Number(orderInput.total),
        paymentMethod: orderInput.paymentMethod,
        status: "Chờ xác nhận",
        createdAt: `Hôm nay, ${timeStr}`,
        isNew: true
    };

    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    return newOrder;
}

// Cập nhật trạng thái đơn hàng từ admin.html
function updateOrderStatus(orderId, newStatus) {
    const orders = getOrders();
    const target = orders.find(o => o.id === orderId);
    if (target) {
        target.status = newStatus;
        target.isNew = false;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    }
    return orders;
}

// =========================================================================
// 4. QUẢN LÝ TỒN KHO NGUYÊN VẬT LIỆU
// =========================================================================
const DEFAULT_INVENTORY = [
    { sku: "NVL-01", name: "Mì Indomie & Mì Koreno", unit: "Gói", stock: 120, minStock: 40 },
    { sku: "NVL-02", name: "Thịt bò Wagyu & Ba chỉ bò Mỹ", unit: "Kg", stock: 8, minStock: 10 },
    { sku: "NVL-03", name: "Đào ngâm hộp lớn & Trà đen đặc biệt", unit: "Hộp", stock: 18, minStock: 8 },
    { sku: "NVL-04", name: "Khoai tây cọng & Phô mai que", unit: "Kg", stock: 15, minStock: 10 },
    { sku: "NVL-05", name: "Trứng cút lộn & Sốt me đặc chế", unit: "Chục", stock: 9, minStock: 12 },
    { sku: "NVL-06", name: "Gà góc tư & Gạo thơm dẻo", unit: "Kg", stock: 22, minStock: 10 },
    { sku: "BB-01", name: "Hộp giấy Kraft & Ly nhựa nắp cầu 500ml", unit: "Cái", stock: 250, minStock: 100 }
];

function getInventory() {
    const saved = localStorage.getItem(INVENTORY_KEY);
    if (!saved) {
        localStorage.setItem(INVENTORY_KEY, JSON.stringify(DEFAULT_INVENTORY));
        return DEFAULT_INVENTORY;
    }
    return JSON.parse(saved);
}

function adjustStock(sku, delta) {
    const inv = getInventory();
    const item = inv.find(i => i.sku === sku);
    if (item) {
        item.stock = Math.max(0, item.stock + delta);
        localStorage.setItem(INVENTORY_KEY, JSON.stringify(inv));
    }
    return inv;
}
