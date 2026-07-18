/*****************************************************
 * TRA CỨU HỒ SƠ TUYỂN SINH
 * Trường Đại học Y Dược - ĐHQGHN
 *****************************************************/

/*====================================================
=                   CẤU HÌNH
====================================================*/

const API_URL = "https://script.google.com/macros/s/AKfycbz-33C5meFQdBWkTvN7gSL7xhIB5Cy-NgMrBeHJjqm4zNINVHvNcy8XF8JxzYtLzR8/exec";

/*====================================================
=                   DOM
====================================================*/

const resultDiv = document.getElementById("result");
const cccdInput = document.getElementById("cccd");
const captchaInput = document.getElementById("captchaInput");
const captchaBox = document.getElementById("captcha");
const reloadBtn = document.getElementById("reloadCaptcha");
const searchBtn = document.getElementById("searchBtn");

/*====================================================
=                   CHỈ CHO NHẬP SỐ CCCD
====================================================*/

cccdInput.addEventListener("input", function () {

    this.value = this.value.replace(/\D/g, "").slice(0, 12);

});

/*====================================================
=                   CAPTCHA
====================================================*/

let currentCaptcha = "";

function generateCaptcha() {

    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let text = "";

    for (let i = 0; i < 5; i++) {

        text += chars.charAt(
            Math.floor(Math.random() * chars.length)
        );

    }

    currentCaptcha = text;

    captchaBox.textContent = text;

}

/*====================================================
=                   KIỂM TRA DỮ LIỆU
====================================================*/

function validateInput() {

    const cccd = cccdInput.value.trim();

    const captcha = captchaInput.value.trim().toUpperCase();

    if (cccd === "") {

        alert("Vui lòng nhập số Căn cước công dân.");

        cccdInput.focus();

        return false;

    }

    if (!/^\d{12}$/.test(cccd)) {

        alert("Số Căn cước công dân phải gồm đúng 12 chữ số.");

        cccdInput.focus();

        return false;

    }

    if (captcha === "") {

        alert("Vui lòng nhập mã xác nhận.");

        captchaInput.focus();

        return false;

    }

    if (captcha !== currentCaptcha) {

        alert("Mã xác nhận không đúng.");

        generateCaptcha();

        captchaInput.value = "";

        captchaInput.focus();

        return false;

    }

    return true;

}

/*====================================================
=                   LOADING
====================================================*/

function showLoading() {

    resultDiv.style.display = "block";

    resultDiv.innerHTML = `

<div class="result-card text-center">

<div class="spinner-border text-primary mb-3"></div>

<p>Đang tra cứu dữ liệu...</p>

</div>

`;

}

/*====================================================
=                   KHUNG LƯU Ý
====================================================*/

function getNoticeBox() {

    return `

<div class="notice-box">

<h5>📌 Lưu ý</h5>

<ul>

<li>
Hồ sơ xét tuyển phải đáp ứng đầy đủ các điều kiện, tiêu chuẩn theo Quy chế tuyển sinh hiện hành và Thông tin tuyển sinh đại học chính quy năm 2026 của Trường Đại học Y Dược, ĐHQGHN. Trường chỉ xem xét công nhận kết quả đối với các hồ sơ hợp lệ.
</li>

<li>
Thí sinh sử dụng chứng chỉ tiếng Anh quốc tế để xét tuyển phải đáp ứng Ngưỡng bảo đảm chất lượng đầu vào từ điểm thi tốt nghiệp THPT năm 2026 theo đúng tổ hợp xét tuyển của ngành đăng ký.
</li>

</ul>

</div>

`;

}/*====================================================
=                   KHÔNG TÌM THẤY
====================================================*/

function showNotFound() {

    resultDiv.style.display = "block";

    resultDiv.innerHTML = `

<div class="error-box">

<h4>Không tìm thấy hồ sơ phù hợp</h4>

<p>

Vui lòng kiểm tra lại số Căn cước công dân đã nhập.

</p>

<p>

Nếu vẫn không tra cứu được, vui lòng liên hệ
Phòng Đào tạo và CTHSSV để được hỗ trợ.

</p>

<p>☎ 0243 7450 188 (máy lẻ 621)</p>

<p>📱 0911 430 050</p>

<p>✉ daotao.ump@gmail.com</p>

</div>

${getNoticeBox()}

`;

}


/*====================================================
=                   HIỂN THỊ KẾT QUẢ
====================================================*/

function showResult(data) {

    let methods = "";

    if (data.methods && data.methods.length > 0) {

        data.methods.forEach(function(item){

            methods += `
<span class="method-badge">${item.name}</span>
`;

        });

    } else {

        methods = "<p>Không có thông tin.</p>";

    }

    resultDiv.style.display = "block";

    resultDiv.innerHTML = `

<div class="result-card">

<div class="section-title">

THÔNG TIN THÍ SINH

</div>

<p>

<strong>Họ và tên</strong><br>

${data.name}

</p>

<p>

<strong>Số Căn cước công dân</strong><br>

${data.cccd}

</p>

<p>

<strong>Ngày sinh</strong><br>

${data.dob}

</p>

<div class="section-title">

PHƯƠNG THỨC ĐĂNG KÝ

</div>

${methods}

<div class="section-title">

TRẠNG THÁI HỒ SƠ

</div>

<p>

<span class="status ${data.statusColor}">

${data.status}

</span>

</p>

<div class="section-title">

GHI CHÚ

</div>

<p>

${data.note || "Không có"}

</p>

</div>

${getNoticeBox()}

`;

}


/*====================================================
=                   TRA CỨU
====================================================*/

async function searchCandidate() {

    if (!validateInput()) {

        return;

    }

    showLoading();

    const cccd = cccdInput.value.trim();

    try {

        const response = await fetch(

            API_URL + "?cccd=" + encodeURIComponent(cccd)

        );

        if (!response.ok) {

            throw new Error("Không kết nối được máy chủ.");

        }

        const data = await response.json();

        if (data.found) {

            showResult(data);

        } else {

            showNotFound();

        }

    } catch (error) {

        console.error(error);

        showNotFound();

    }

    generateCaptcha();

    captchaInput.value = "";

}


/*====================================================
=                   SỰ KIỆN
====================================================*/

reloadBtn.addEventListener("click", generateCaptcha);

searchBtn.addEventListener("click", searchCandidate);


// Nhấn Enter để tra cứu

document.addEventListener("keydown", function(e){

    if(e.key==="Enter"){

        searchCandidate();

    }

});


/*====================================================
=                   KHỞI TẠO
====================================================*/

generateCaptcha();
