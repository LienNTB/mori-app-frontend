import React from "react";
import styles from "./vnpay-return.module.scss";

const Success = () => {
  return (
    <div className={styles.container}>
      <p className={styles.message}>
        Giao dịch được thực hiện thành công. Cảm ơn quý khách đã sử dụng dịch vụ
      </p>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Value</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Merchant ID</td>
              <td>CTTVNP01</td>
              <td>Được cấp bởi VNPAY</td>
            </tr>
            <tr>
              <td>Merchant Name</td>
              <td>VNPAY Demo</td>
              <td>Tên Website Merchant</td>
            </tr>
            <tr>
              <td>Merchant Transaction Reference</td>
              <td>181474</td>
              <td>Mã GD của website merchant</td>
            </tr>
            <tr>
              <td>Transaction Info</td>
              <td>Thanh toan don hang thoi gian: 2024-04-13 01:52:54</td>
              <td>Thông tin mô tả từ website merchant</td>
            </tr>
            <tr>
              <td>Amount</td>
              <td>10000</td>
              <td>Số tiền được thanh toán</td>
            </tr>
            <tr>
              <td>Current Code</td>
              <td>VND</td>
              <td>Đơn vị tiền tệ được thanh toán</td>
            </tr>
            <tr>
              <td>Transaction Response Code</td>
              <td>00</td>
              <td>Trạng thái GD</td>
            </tr>
            <tr>
              <td>Message</td>
              <td>
                Giao dịch được thực hiện thành công. Cảm ơn quý khách đã sử dụng
                dịch vụ
              </td>
              <td>Thông báo từ cổng thanh toán</td>
            </tr>
            <tr>
              <td>Transaction Number</td>
              <td>14376720</td>
              <td>Mã GD trên cổng thanh toán</td>
            </tr>
            <tr>
              <td>Bank</td>
              <td>NCB</td>
              <td>Ngân hàng GD</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={styles.linkContainer}>
        <a href="/" className={styles.button}>
          Về trang chủ
        </a>
      </p>
      <footer className={styles.footer}>
        <p>© VNPAY 2024</p>
      </footer>
    </div>
  );
};

export default Success;
