const STORAGE_KEY = "3ce_foods_orders";

// 1. Danh sách 10 đơn hàng mẫu (Mock Data) để bảng thống kê có sẵn số liệu đẹp mắt
const DEFAULT_ORDERS = [
  {
    id: "3CE-109",
    customerName: "Nguyễn Minh Anh",
    phone: "0987654321",
    address: "KTX Học viện Tài chính, Bắc Từ Liêm, Hà Nội",
    items: "2x Hồng Nhan Tuyết Lệ – Trà đào, 1x Bánh tráng trộn",
    total: 85000,
    paymentMethod: "VietQR",
    status: "Chờ xác nhận",
    createdAt: "Hôm nay, 19:45",
    isNew: false
  },
  {
    id: "3CE-108",
    customerName: "Trần Hoàng Nam",
    phone: "0912345678",
    address: "Số 18 Ngõ 58 Lê Văn Hiến, Hà Nội",
    items: "2x Mì cay hải sản cấp độ 2, 2x Trà đào",
    total: 140000,
    paymentMethod: "COD",
    status: "Đang giao",
    createdAt: "Hôm nay, 19:20",
    isNew: false
  },
  {
    id: "3CE-107",
    customerName: "Lê Thu Thảo",
    phone: "0965432198",
    address: "Tòa A2 Chung cư Ecohome 1, Hà Nội",
    items: "1x Cơm gà xối mỡ, 1x Hồng Nhan Tuyết Lệ – Trà đào",
    total: 75000,
    paymentMethod: "VietQR",
    status: "Hoàn thành",
    createdAt: "Hôm nay, 18:15",
    isNew: false
  },
  {
    id: "3CE-106",
    customerName: "Phạm Khánh Linh",
    phone: "0934567890",
    address: "Số 42 Đông Ngạc, Bắc Từ Liêm, Hà Nội",
    items: "3x Mì cay bò Mỹ, 3x Khoai tây lắc phô mai",
    total: 225000,
    paymentMethod: "VietQR",
    status: "Hoàn thành",
    createdAt: "Hôm nay, 17:30",
    isNew: false
  },
  {
    id: "3CE-105",
    customerName: "Vũ Đức Huy",
    phone: "0978123456",
    address: "Ngõ 120 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
    items: "2x Cơm rang dưa bò, 2x Trà đào",
    total: 130000,
    paymentMethod: "COD",
    status: "Hoàn thành",
    createdAt: "Hôm qua, 20:10",
    isNew: false
  },
  {
    id: "3CE-104",
    customerName: "Đặng Ngọc Mai",
    phone: "0945678123",
    address: "Số 15 Trần Cung, Cổ Nhuế, Hà Nội",
    items: "1x Combo Ăn Vặt Sương Sương, 1x Trà đào",
    total: 99000,
    paymentMethod: "VietQR",
    status: "Hoàn thành",
    createdAt: "Hôm qua, 19:05",
    isNew: false
  },
  {
    id: "3CE-103",
    customerName: "Bùi Quang Minh",
    phone: "0909888777",
    address: "Ký túc xá Đại học Mỏ - Địa chất",
    items: "2x Mì cay xúc xích, 1x Nem chua rán",
    total: 115000,
    paymentMethod: "COD",
    status: "Hoàn thành",
    createdAt: "Hôm qua, 18:40",
    isNew: false
  },
  {
    id: "3CE-102",
    customerName: "Hoàng Yến Nhi",
    phone: "0988777666",
    address: "Số 88 Phạm Văn Đồng, Hà Nội",
    items: "4x Hồng Nhan Tuyết Lệ – Trà đào",
    total: 120000,
    paymentMethod: "VietQR",
    status: "Hoàn thành",
    createdAt: "Hôm qua, 15:20",
    isNew: false
  },
  {
    id: "3CE-101",
    customerName: "Ngô Gia Bảo",
    phone: "0911222333",
    address: "Số 10 Phan Bá Vành, Hà Nội",
    items: "1x Cơm đùi gà chiên mắm",
    total: 45000,
    paymentMethod: "COD",
    status: "Đã hủy",
    createdAt: "Hôm qua, 12:15",
    isNew: false
  },
  {
    id: "3CE-100",
    customerName: "Đỗ Thanh Trúc",
    phone: "0922333444",
    address: "Khu đô thị Resco Cổ Nhuế, Hà Nội",
    items: "2x Bánh tráng cuộn bơ, 2x Trà đào",
    total: 110000,
    paymentMethod: "VietQR",
    status: "Hoàn thành",
    createdAt: "Hôm qua, 11:30",
    isNew: false
  }
];

// 2. Hàm khởi tạo và lấy toàn bộ danh sách đơn hàng từ localStorage
function getOrders() {
  const savedData = localStorage.getItem(STORAGE_KEY);
  if (!savedData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ORDERS));
    return DEFAULT_ORDERS;
  }
  return JSON.parse(savedData);
}

// 3. Hàm thêm đơn hàng mới từ trang bán hàng (index.html)
function addNewOrder(orderInfo) {
  const orders = getOrders();
  const now = new Date();
  const timeString = `Vừa xong (${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')})`;

  const newOrder = {
    id: "3CE-" + Math.floor(110 + Math.random() * 890),
    customerName: orderInfo.customerName,
    phone: orderInfo.phone,
    address: orderInfo.address,
    items: orderInfo.items,
    total: orderInfo.total,
    paymentMethod: orderInfo.paymentMethod || "COD",
    status: "Chờ xác nhận",
    createdAt: timeString,
    isNew: true // Gắn cờ để trang Admin hiện nhãn "Đơn mới" nổi bật
  };

  orders.unshift(newOrder); // Đưa đơn mới lên đầu danh sách
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  return newOrder;
}

// 4. Hàm cập nhật trạng thái đơn hàng từ trang quản trị (admin.html)
function updateOrderStatus(orderId, newStatus) {
  const orders = getOrders();
  const updatedOrders = orders.map(order => {
    if (order.id === orderId) {
      return { ...order, status: newStatus, isNew: false };
    }
    return order;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedOrders));
  return updatedOrders;
}

// 5. Hàm khôi phục dữ liệu mẫu ban đầu (Dùng để reset trước khi thuyết trình)
function resetMockData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ORDERS));
  return DEFAULT_ORDERS;
}
