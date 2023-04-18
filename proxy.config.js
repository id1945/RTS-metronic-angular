module.exports = {
  // Ngân sách màn hình detail - đề nghị thanh toán/tạm ứng
  "/api/v1/*": {
    target: "http://10.64.34.40:8082",
    secure: false,
    logLevel: "debug",
    changeOrigin: true,
  },
  "/api/*": {
    target: "http://portal-dev.hyundai.tcmotor.vn:88",
    secure: false,
    logLevel: "debug",
    changeOrigin: true,
  },
  "/notification/*": {
    target: "http://portal-dev.hyundai.tcmotor.vn:88",
    secure: false,
    logLevel: "debug",
    changeOrigin: true,
  },
  // Nhân sự
  "/API/Mobile/*": {
    target: "https://hrm.hyundai.tcmotor.vn:8088",
    secure: false,
    logLevel: "debug",
    changeOrigin: true,
  },
  // Dropbox show qrcode download app
  "/htv_get_link_app/*": {
    target: "https://work.hyundai.tcmotor.vn",
    secure: false,
    logLevel: "debug",
    changeOrigin: true,
  },
  // Màn Hỗ trợ CNTT
  "/tcm_ticket/*": {
    target: "https://irm.tcmotor.vn",
    secure: false,
    logLevel: "debug",
    changeOrigin: true,
  },
};
