/**
 * ประกาศตัวแปร cart เป็น Object ว่างใช้เก็บข้อมูลสินค้าในรถเข็นเริ่มต้น
 */
const cart = {};

/**
 * ใช้ querySelectorAll เลือกทุก element ที่อยู่ class ของ add-to-cart และใช้ forEach loop เพื่อเพิ่ม even ที่จะทำงานเมื่อมีการคลิกปุ่ม Add to Cart ในหน้า website
 */
document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", () => {
    const productId = button.getAttribute("data-product-id");
    const price = parseFloat(button.getAttribute("data-price"));
    if (!cart[productId]) {
      cart[productId] = { quantity: 1, price: price };
    } else {
      cart[productId].quantity++;
    }
    updateCartDisplay();
  });
});

/**ฟังก์ชันนี้มีหน้าที่ในการอัปเดตและแสดงผลของรถเข็นในหน้าเว็บให้เป็นตรงกับข้อมูลในตัวแปล Cart={} โดยผู้ใช้จะสามารถเห็นสถานะปัจจุบันของรถเข็นได้ และเพิ่มปุ่มเพื่อลบสินค้าออกได้ จะมีปุ่มลบสินค้าแต่ละชิ้นที่อยู่ในตารางของรถเข็น */
function updateCartDisplay() {
  const cartElement = document.getElementById("cart");
  cartElement.innerHTML = "";

  let totalPrice = 0;

  // Create a table
  const table = document.createElement("table");
  table.classList.add("table", "table-striped");

  // Create table header
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const headers = ["Product", "Quantity", "Price", "Total", "Actions"];
  headers.forEach((headerText) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create table body
  const tbody = document.createElement("tbody");

  for (const productId in cart) {
    const item = cart[productId];
    const itemTotalPrice = item.quantity * item.price;
    totalPrice += itemTotalPrice;

    const tr = document.createElement("tr");

    // Add product image from product_img folder
    const productImage = `product_img/${productId}.jpg`; // เส้นทางของรูป
    const productNameCell = document.createElement("td");
    productNameCell.innerHTML = `<img src="${productImage}" alt="${productId}" style="width: 50px; height: 50px;"> ${productId}`;
    tr.appendChild(productNameCell);

    const quantityCell = document.createElement("td");
    quantityCell.textContent = item.quantity;
    tr.appendChild(quantityCell);

    const priceCell = document.createElement("td");
    priceCell.textContent = `$${item.price}`;
    tr.appendChild(priceCell);

    const totalCell = document.createElement("td");
    totalCell.textContent = `$${itemTotalPrice}`;
    tr.appendChild(totalCell);

    const actionsCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    deleteButton.classList.add("btn", "btn-danger", "delete-product");
    deleteButton.setAttribute("data-product-id", productId);
    deleteButton.addEventListener("click", () => {
      delete cart[productId];
      updateCartDisplay();
    });
    actionsCell.appendChild(deleteButton);
    tr.appendChild(actionsCell);

    tbody.appendChild(tr);
  }

  table.appendChild(tbody);
  cartElement.appendChild(table);

  if (Object.keys(cart).length === 0) {
    cartElement.innerHTML = "<p>No items in cart.</p>";
  } else {
    const totalPriceElement = document.createElement("p");
    totalPriceElement.textContent = `Total Price: $${totalPrice}`;
    cartElement.appendChild(totalPriceElement);
  }
}

/** จะเพิ่ม event ให้กับ element ที่มี id printCart เมื่อมีการคลิก Print Cart Recipt บิลใบเสร็จของสินค้า. */
document.getElementById("printCart").addEventListener("click", () => {
  printReceipt("Thank you!", generateCartReceipt());
});

/**ฟังก์ชันนี้ใช้สำหรับพิมพ์บิลใบเสร็จของสินค้า จะเปิดหน้าต่างใหม่และพิมพ์บิลใบเสร็จของสินค้า. */
function printReceipt(title, content) {
  const printWindow = window.open("1", "_blank");
  printWindow.document.write(
    `<html><head><title>${title}</title></head><body>${content}</body></html>`
  );
  printWindow.document.close();
  printWindow.print();
}

/** ฟังก์ชันนี้ใช้สำหรับสร้างเนื้อหาในใบเสร็จของ Cart. */
function generateCartReceipt() {
  let receiptContent = ` 
    <style>
      @page {
        size: 100mm 100mm;
      }
      body {
        width: 100mm;
        height: 100mm;
        margin: 0;
        padding: 1px;
        font-family: Arial, sans-serif;
      }
      h2 {
        text-align: center;
        margin-bottom: 10px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 10px;
      }
      th, td {
        border: 1px solid #ddd;
        padding: 5px;
        text-align: left;
      }
      th {
        background-color: #f2f2f2;
      }
      .qr-code {
        text-align: center;
        margin-top: 10px;
      }
    </style>
    <p>SANGKONG SHOP!</p>
    <h2>Cart Receipt</h2>
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>`;

  let totalPrice = 0;

  for (const productId in cart) {
    const item = cart[productId];
    const itemTotalPrice = item.quantity * item.price;

    receiptContent += `
        <tr>
          <td>${productId}</td>
          <td>${item.quantity}</td>
          <td>${item.price} บาท</td>
          <td>${itemTotalPrice} บาท</td>
        </tr>`;

    totalPrice += itemTotalPrice;
  }

  receiptContent += `
        </tbody>
      </table>
      <p>Total Price: ${totalPrice} บาท</p>
      <p>คุณ Kays Tel. 082 082 8520</p>
      
      <!-- QR Code สำหรับสั่งซื้อผ่าน LINE -->
      <div style="display: flex; justify-content: center; align-items: center; flex-direction: column; text-align: center;">
          <p>สั่งซื้อผ่าน LINE:</p>
         <img src="product_img/qr-code.png" alt="QR Code to Order on LINE" style="width: 350px; height: 350px;">
      </div>
    `;

  return receiptContent;
}
