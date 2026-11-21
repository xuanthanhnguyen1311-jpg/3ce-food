// ==========================================
// CẤU HÌNH KẾT NỐI SUPABASE CHO 3CEFOODS.SHOP
// ==========================================
const SUPABASE_URL = "https://rvptgvbmeszqhucfhatu.supabase.co/rest/v1/";
const SUPABASE_ANON_KEY = "sb_publishable_XvY--N5R_6jM4ceyW6sWFQ_acdDbGzp";

// Khởi tạo client kết nối (dùng tên supabaseClient để tránh trùng biến toàn cục)
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 1. Lấy toàn bộ danh sách đơn hàng từ Supabase (mới nhất xếp trên cùng)
async function getOrders() {
    const { data, error } = await supabaseClient
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Lỗi tải danh sách đơn hàng:", error);
        return [];
    }

    // Chuẩn hóa tên trường để khớp hoàn toàn với giao diện admin.html
    return data.map(row => ({
        id: row.id,
        customerName: row.customer_name,
        phone: row.phone,
        address: row.address,
        items: row.items,
        total: Number(row.total),
        paymentMethod: row.payment_method,
        status: row.status,
        isNew: row.is_new,
        createdAt: new Date(row.created_at).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit"
        }) + " - " + new Date(row.created_at).toLocaleDateString("vi-VN")
    }));
}

// 2. Gửi đơn hàng mới từ index.html lên Supabase
async function addNewOrder(orderInput) {
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

    const { data, error } = await supabaseClient
        .from("orders")
        .insert([newRow])
        .select()
        .single();

    if (error) {
        console.error("Lỗi gửi đơn hàng:", error);
        throw error;
    }

    return { ...orderInput, id: data.id };
}

// 3. Cập nhật trạng thái đơn hàng từ admin.html (Duyệt bếp, Giao Ship, Hoàn thành, Hủy)
async function updateOrderStatus(orderId, newStatus) {
    const { error } = await supabaseClient
        .from("orders")
        .update({ status: newStatus, is_new: false })
        .eq("id", orderId);

    if (error) {
        console.error("Lỗi cập nhật trạng thái:", error);
    }
}
