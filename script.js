/* =========================================================
   বাংলাদেশের সকল জেলার তালিকা (৬৪ জেলা)
   ========================================================= */
const districts = [
  "বাগেরহাট", "বান্দরবান", "বরগুনা", "বরিশাল", "ভোলা", "বগুড়া", "ব্রাহ্মণবাড়িয়া",
  "চাঁদপুর", "চাঁপাইনবাবগঞ্জ", "চট্টগ্রাম", "চুয়াডাঙ্গা", "কুমিল্লা", "কক্সবাজার",
  "ঢাকা", "দিনাজপুর", "ফরিদপুর", "ফেনী", "গাইবান্ধা", "গাজীপুর", "গোপালগঞ্জ",
  "হবিগঞ্জ", "জামালপুর", "যশোর", "ঝালকাঠি", "ঝিনাইদহ", "খাগড়াছড়ি", "খুলনা",
  "কিশোরগঞ্জ", "কুড়িগ্রাম", "কুষ্টিয়া", "লক্ষ্মীপুর", "লালমনিরহাট", "মাদারীপুর",
  "মাগুরা", "মানিকগঞ্জ", "মেহেরপুর", "মৌলভীবাজার", "মুন্সিগঞ্জ", "ময়মনসিংহ",
  "নওগাঁ", "নড়াইল", "নারায়ণগঞ্জ", "নরসিংদী", "নাটোর", "নেত্রকোণা", "নিলফামারী",
  "নোয়াখালী", "পাবনা", "পঞ্চগড়", "পটুয়াখালী", "পিরোজপুর", "রাজবাড়ী", "রাজশাহী",
  "রাঙ্গামাটি", "রংপুর", "সাতক্ষীরা", "শরীয়তপুর", "শেরপুর", "সিরাজগঞ্জ", "সুনামগঞ্জ",
  "সিলেট", "টাঙ্গাইল", "ঠাকুরগাঁও"
].sort((a, b) => a.localeCompare(b, "bn"));

/* =========================================================
   একটিভ পেমেন্ট নম্বর
   ========================================================= */
const paymentNumbers = {
  bkashNumber: "01842151907",
  nagadNumber: "01722144619",
  rocketNumber: "01838962362"
};

document.addEventListener("DOMContentLoaded", () => {
  populateDistricts();
  setPaymentNumbers();
  setupFormValidation();
  setupCopyButtons();
  setupConfirmButton();
});

/* জেলার ড্রপডাউন পূরণ */
function populateDistricts() {
  const select = document.getElementById("district");
  districts.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    select.appendChild(option);
  });
}

/* একটিভ পেমেন্ট নম্বর বসানো */
function setPaymentNumbers() {
  Object.entries(paymentNumbers).forEach(([id, number]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = number;
  });
}

/* =========================================================
   ফর্ম ভ্যালিডেশন ও সাবমিশন
   ========================================================= */
function setupFormValidation() {
  const form = document.getElementById("registrationForm");
  const mobileInput = document.getElementById("mobile");

  // শুধুমাত্র সংখ্যা প্রবেশ করানো (মোবাইল নম্বর)
  mobileInput.addEventListener("input", () => {
    mobileInput.value = mobileInput.value.replace(/[^0-9]/g, "").slice(0, 11);
  });

  const ageInput = document.getElementById("age");
  ageInput.addEventListener("input", () => {
    ageInput.value = ageInput.value.replace(/[^0-9]/g, "");
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const isMobileValid = /^01[3-9][0-9]{8}$/.test(mobileInput.value.trim());
    mobileInput.setCustomValidity(isMobileValid ? "" : "invalid");

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      const firstInvalid = form.querySelector(":invalid");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    form.classList.add("was-validated");
    revealPaymentSection();
  });
}

/* ফর্ম সঠিক হলে পেমেন্ট সেকশন দেখানো */
function revealPaymentSection() {
  showLoading(true);

  setTimeout(() => {
    showLoading(false);
    const paymentSection = document.getElementById("payment-section");
    paymentSection.classList.remove("d-none");
    paymentSection.scrollIntoView({ behavior: "smooth", block: "start" });

    // রেজিস্ট্রেশন বাটন disable করে দেওয়া যাতে দুইবার সাবমিট না হয়
    const submitBtn = document.querySelector(".btn-submit");
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> তথ্য যাচাই সম্পন্ন';
  }, 900);
}

/* =========================================================
   কপি টু ক্লিপবোর্ড
   ========================================================= */
function setupCopyButtons() {
  const buttons = document.querySelectorAll(".copy-btn");
  const labels = {
    bkashNumber: "বিকাশ নম্বর সফলভাবে কপি হয়েছে।",
    nagadNumber: "নগদ নম্বর সফলভাবে কপি হয়েছে।",
    rocketNumber: "রকেট নম্বর সফলভাবে কপি হয়েছে।"
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const targetId = btn.getAttribute("data-copy-target");
      const number = paymentNumbers[targetId];

      try {
        await navigator.clipboard.writeText(number);
      } catch (err) {
        // fallback for older browsers
        const tempInput = document.createElement("textarea");
        tempInput.value = number;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
      }

      showToast(labels[targetId] || "কপি হয়েছে।");
    });
  });
}

/* টোস্ট নোটিফিকেশন দেখানো */
function showToast(message) {
  const toastEl = document.getElementById("copyToast");
  document.getElementById("toastMessage").textContent = message;
  const toast = new bootstrap.Toast(toastEl, { delay: 2500 });
  toast.show();
}

/* =========================================================
   পেমেন্ট নিশ্চিতকরণ
   ========================================================= */
function setupConfirmButton() {
  const confirmBtn = document.getElementById("confirmPaymentBtn");

  confirmBtn.addEventListener("click", () => {
    confirmBtn.disabled = true;
    confirmBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> জমা হচ্ছে...';

    showLoading(true, "আপনার তথ্য জমা করা হচ্ছে...");

    setTimeout(() => {
      showLoading(false);
      const successModal = new bootstrap.Modal(document.getElementById("successModal"));
      successModal.show();

      confirmBtn.innerHTML = '<i class="fa-solid fa-check"></i> জমা সম্পন্ন হয়েছে';
    }, 1200);
  });
}

/* =========================================================
   লোডিং ওভারলে দেখানো/লুকানো
   ========================================================= */
function showLoading(show, text) {
  const overlay = document.getElementById("loadingOverlay");
  if (text) overlay.querySelector("p").textContent = text;
  overlay.classList.toggle("d-none", !show);
}
